#!/usr/bin/env node
// Diagnose traffic drop across all 14 Directory Factory sites
// Compares recent 7 days vs previous 7 days, checks indexing status

import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const SITES = [
  'accountingai.tools',
  'aigirlfriend.tools',
  'hrai.tools',
  'legalai.tools',
  'realestateai.tools',
  'bestwriting.tools',
  'bestnootropics.info',
  'bestonlyfans.info',
  'bestanime.info',
  'mattressrank.info',
  'bestofpodcasts.com',
  'nsfwtelegrambot.com',
  'bestaidetector.tools',
  'aihumanizer.tools',
];

// Date ranges
const today = new Date();
const recent7End = new Date(today);
recent7End.setDate(recent7End.getDate() - 1); // Yesterday
const recent7Start = new Date(recent7End);
recent7Start.setDate(recent7Start.getDate() - 6); // 7 days ago

const prev7End = new Date(recent7Start);
prev7End.setDate(prev7End.getDate() - 1);
const prev7Start = new Date(prev7End);
prev7Start.setDate(prev7Start.getDate() - 6);

const formatDate = d => d.toISOString().split('T')[0];

async function getSiteStats(domain, startDate, endDate) {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });
  const siteUrl = `https://${domain}/`;

  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: [],
        rowLimit: 1,
      },
    });

    const row = res.data.rows?.[0];
    if (!row) return { clicks: 0, impressions: 0, position: 0 };

    return {
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      position: row.position || 0,
    };
  } catch (e) {
    return { clicks: 0, impressions: 0, position: 0, error: e.message };
  }
}

async function getSitemapStatus(domain) {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });
  const siteUrl = `https://${domain}/`;

  try {
    const res = await webmasters.sitemaps.list({ siteUrl });
    const maps = res.data.sitemap || [];
    
    if (maps.length === 0) return { status: 'No sitemap', submitted: 0, indexed: 0 };
    
    const mainSitemap = maps.find(m => m.path.includes('sitemap-index.xml')) || maps[0];
    
    return {
      status: mainSitemap.isPending ? 'Pending' : 'Processed',
      submitted: mainSitemap.contents?.[0]?.submitted || 0,
      indexed: mainSitemap.contents?.[0]?.indexed || 0,
      lastSubmitted: mainSitemap.lastSubmitted || 'Unknown',
    };
  } catch (e) {
    return { status: 'Error', error: e.message, submitted: 0, indexed: 0 };
  }
}

async function run() {
  console.log('🔍 **Directory Factory Traffic Drop Diagnosis**');
  console.log(`📅 Recent: ${formatDate(recent7Start)} to ${formatDate(recent7End)}`);
  console.log(`📅 Previous: ${formatDate(prev7Start)} to ${formatDate(prev7End)}\n`);

  const results = [];

  for (const domain of SITES) {
    console.log(`Checking ${domain}...`);
    
    const [recent, previous, sitemap] = await Promise.all([
      getSiteStats(domain, formatDate(recent7Start), formatDate(recent7End)),
      getSiteStats(domain, formatDate(prev7Start), formatDate(prev7End)),
      getSitemapStatus(domain),
    ]);

    const clickChange = previous.clicks > 0 
      ? ((recent.clicks - previous.clicks) / previous.clicks * 100).toFixed(1)
      : (recent.clicks > 0 ? '+∞' : '0');

    const impChange = previous.impressions > 0
      ? ((recent.impressions - previous.impressions) / previous.impressions * 100).toFixed(1)
      : (recent.impressions > 0 ? '+∞' : '0');

    results.push({
      domain,
      recent,
      previous,
      sitemap,
      clickChange,
      impChange,
    });
  }

  // Print summary table
  console.log('\n📊 **Traffic Comparison (7d vs 7d)**\n');
  console.log('Site'.padEnd(30) + 'Recent Clicks'.padEnd(15) + 'Prev Clicks'.padEnd(15) + 'Change'.padEnd(12) + 'Indexed Pages');
  console.log('-'.repeat(90));

  let totalRecentClicks = 0, totalPrevClicks = 0;
  let totalRecentImp = 0, totalPrevImp = 0;

  results.forEach(r => {
    totalRecentClicks += r.recent.clicks;
    totalPrevClicks += r.previous.clicks;
    totalRecentImp += r.recent.impressions;
    totalPrevImp += r.previous.impressions;

    const clickStr = `${r.recent.clicks} (${r.recent.impressions}i)`;
    const prevStr = `${r.previous.clicks} (${r.previous.impressions}i)`;
    const changeStr = `${r.clickChange > 0 ? '+' : ''}${r.clickChange}%`;
    const indexedStr = `${r.sitemap.indexed}/${r.sitemap.submitted}`;

    console.log(
      r.domain.padEnd(30) + 
      clickStr.padEnd(15) + 
      prevStr.padEnd(15) + 
      changeStr.padEnd(12) + 
      indexedStr
    );
  });

  console.log('-'.repeat(90));
  const totalClickChange = totalPrevClicks > 0
    ? ((totalRecentClicks - totalPrevClicks) / totalPrevClicks * 100).toFixed(1)
    : '0';
  const totalImpChange = totalPrevImp > 0
    ? ((totalRecentImp - totalPrevImp) / totalPrevImp * 100).toFixed(1)
    : '0';

  console.log(`TOTAL`.padEnd(30) + 
    `${totalRecentClicks} (${totalRecentImp}i)`.padEnd(15) + 
    `${totalPrevClicks} (${totalPrevImp}i)`.padEnd(15) + 
    `${totalClickChange > 0 ? '+' : ''}${totalClickChange}%`
  );

  // Sitemap status
  console.log('\n🗺️ **Sitemap Status**\n');
  console.log('Site'.padEnd(30) + 'Status'.padEnd(15) + 'Submitted'.padEnd(12) + 'Indexed'.padEnd(12) + 'Last Submit');
  console.log('-'.repeat(90));

  results.forEach(r => {
    console.log(
      r.domain.padEnd(30) + 
      r.sitemap.status.padEnd(15) + 
      r.sitemap.submitted.toString().padEnd(12) + 
      r.sitemap.indexed.toString().padEnd(12) + 
      (r.sitemap.lastSubmitted?.split('T')[0] || 'N/A')
    );
  });

  // Winners and losers
  const sorted = results
    .filter(r => r.previous.clicks > 0 || r.recent.clicks > 0)
    .sort((a, b) => parseFloat(b.clickChange) - parseFloat(a.clickChange));

  if (sorted.length > 0) {
    console.log('\n📈 **Biggest Winners**');
    sorted.slice(0, 3).forEach(r => {
      console.log(`${r.domain}: ${r.clickChange}% (${r.previous.clicks} → ${r.recent.clicks} clicks)`);
    });

    console.log('\n📉 **Biggest Losers**');
    sorted.slice(-3).reverse().forEach(r => {
      console.log(`${r.domain}: ${r.clickChange}% (${r.previous.clicks} → ${r.recent.clicks} clicks)`);
    });
  }

  // Issues to investigate
  console.log('\n⚠️ **Issues Detected**\n');
  
  const sitemapIssues = results.filter(r => 
    r.sitemap.status === 'Pending' || 
    r.sitemap.indexed < r.sitemap.submitted * 0.5
  );
  
  if (sitemapIssues.length > 0) {
    console.log('🔴 Sitemap indexing issues:');
    sitemapIssues.forEach(r => {
      console.log(`  - ${r.domain}: ${r.sitemap.indexed}/${r.sitemap.submitted} indexed (${((r.sitemap.indexed/r.sitemap.submitted)*100).toFixed(1)}%)`);
    });
  }

  const trafficDrops = results.filter(r => parseFloat(r.clickChange) < -20);
  if (trafficDrops.length > 0) {
    console.log('\n🔴 Significant traffic drops (>20%):');
    trafficDrops.forEach(r => {
      console.log(`  - ${r.domain}: ${r.clickChange}% (${r.previous.clicks} → ${r.recent.clicks} clicks)`);
    });
  }

  const noTraffic = results.filter(r => r.recent.clicks === 0 && r.recent.impressions === 0);
  if (noTraffic.length > 0) {
    console.log('\n🔴 No traffic at all:');
    noTraffic.forEach(r => {
      console.log(`  - ${r.domain} (${r.sitemap.indexed}/${r.sitemap.submitted} pages indexed)`);
    });
  }
}

run().catch(console.error);
