#!/usr/bin/env node
/**
 * Complete GA4 Report for All 11 Directory Sites
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT_PATH = join(__dirname, '../secrets/gsc-service-account.json');
const CONFIG_PATH = join(__dirname, '../config/ga4-properties.json');

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

async function getSiteStats(propertyId, days = 7) {
  const client = new BetaAnalyticsDataClient({
    keyFilename: SERVICE_ACCOUNT_PATH,
  });

  try {
    // Overall stats
    const [overall] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'activeUsers' },
      ],
    });

    // Top pages
    const [pages] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    });

    // Traffic sources
    const [sources] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 3,
    });

    const totalViews = parseInt(overall.rows?.[0]?.metricValues[0]?.value || 0);
    const totalSessions = parseInt(overall.rows?.[0]?.metricValues[1]?.value || 0);
    const totalUsers = parseInt(overall.rows?.[0]?.metricValues[2]?.value || 0);

    const googleSessions = parseInt(sources.rows?.find(r => r.dimensionValues[0].value === 'google')?.metricValues[0]?.value || 0);
    const directSessions = parseInt(sources.rows?.find(r => r.dimensionValues[0].value === '(direct)')?.metricValues[0]?.value || 0);

    return {
      totalViews,
      totalSessions,
      totalUsers,
      googleSessions,
      directSessions,
      topPages: pages.rows?.slice(0, 3).map(r => ({
        path: r.dimensionValues[0].value,
        views: parseInt(r.metricValues[0].value),
      })) || [],
    };
  } catch (error) {
    console.error(`Error fetching ${propertyId}:`, error.message);
    return null;
  }
}

async function main() {
  const days = parseInt(process.argv[2]) || 7;
  
  console.log(`📊 Directory Factory - Complete GA4 Report (${days} days)\n`);
  console.log('='.repeat(80));
  console.log();

  const results = [];

  for (const [domain, info] of Object.entries(config.properties)) {
    if (!info.propertyId) {
      console.log(`⏭️  Skipping ${domain} - No GA4 configured`);
      continue;
    }

    process.stdout.write(`Fetching ${domain}... `);
    const stats = await getSiteStats(info.propertyId, days);
    
    if (stats) {
      results.push({ domain, ...stats });
      console.log(`✅ ${stats.totalViews} views`);
    } else {
      console.log(`❌ Failed`);
    }
  }

  console.log();
  console.log('='.repeat(80));
  console.log();

  // Sort by total views
  results.sort((a, b) => b.totalViews - a.totalViews);

  // Summary table
  console.log('📈 Traffic Summary (Ranked by Views)\n');
  console.log('Rank\tSite\t\t\t\tViews\tSessions\tUsers\tGoogle\tDirect');
  console.log('-'.repeat(90));

  results.forEach((r, i) => {
    const domain = r.domain.padEnd(28);
    console.log(`${(i+1).toString().padStart(2)}.\t${domain}\t${r.totalViews}\t${r.totalSessions}\t\t${r.totalUsers}\t${r.googleSessions}\t${r.directSessions}`);
  });

  console.log();

  // Totals
  const totals = results.reduce((acc, r) => ({
    views: acc.views + r.totalViews,
    sessions: acc.sessions + r.totalSessions,
    users: acc.users + r.totalUsers,
    google: acc.google + r.googleSessions,
    direct: acc.direct + r.directSessions,
  }), { views: 0, sessions: 0, users: 0, google: 0, direct: 0 });

  console.log('TOTAL\t\t\t\t\t' + `${totals.views}\t${totals.sessions}\t\t${totals.users}\t${totals.google}\t${totals.direct}`);
  console.log();

  // Insights
  console.log('💡 Key Insights\n');

  // Top 3 sites
  console.log('🏆 Top 3 Sites by Traffic:');
  results.slice(0, 3).forEach((r, i) => {
    const percent = (r.totalViews / totals.views * 100).toFixed(1);
    console.log(`   ${i+1}. ${r.domain} - ${r.totalViews} views (${percent}%)`);
  });
  console.log();

  // Traffic source breakdown
  const organicPercent = (totals.google / totals.sessions * 100).toFixed(1);
  const directPercent = (totals.direct / totals.sessions * 100).toFixed(1);
  console.log('🔗 Traffic Sources (All Sites):');
  console.log(`   Google (Organic): ${totals.google} sessions (${organicPercent}%)`);
  console.log(`   Direct: ${totals.direct} sessions (${directPercent}%)`);
  console.log(`   Other: ${totals.sessions - totals.google - totals.direct} sessions`);
  console.log();

  // Category performance
  const nsfwSites = ['aigirlfriend.tools', 'bestonlyfans.info', 'nsfwtelegrambot.com'];
  const aiSites = ['accountingai.tools', 'legalai.tools', 'hrai.tools', 'realestateai.tools', 'bestwriting.tools'];
  
  const nsfwViews = results.filter(r => nsfwSites.includes(r.domain)).reduce((sum, r) => sum + r.totalViews, 0);
  const aiViews = results.filter(r => aiSites.includes(r.domain)).reduce((sum, r) => sum + r.totalViews, 0);

  console.log('📂 Category Performance:');
  console.log(`   NSFW/Companion: ${nsfwViews} views (${(nsfwViews/totals.views*100).toFixed(1)}%)`);
  console.log(`   AI Tools: ${aiViews} views (${(aiViews/totals.views*100).toFixed(1)}%)`);
  console.log(`   Other: ${totals.views - nsfwViews - aiViews} views`);
  console.log();

  // Top pages across all sites
  console.log('📄 Most Popular Pages (Top 5 across all sites):\n');
  
  const allTopPages = results.flatMap(r => 
    r.topPages.map(p => ({ domain: r.domain, path: p.path, views: p.views }))
  ).sort((a, b) => b.views - a.views).slice(0, 5);

  allTopPages.forEach((p, i) => {
    console.log(`   ${i+1}. ${p.domain}${p.path} - ${p.views} views`);
  });
  console.log();

  // Growth recommendations
  console.log('🚀 Recommendations:\n');
  
  const lowTrafficSites = results.filter(r => r.totalViews < 50);
  if (lowTrafficSites.length > 0) {
    console.log('   📌 Focus on low-traffic sites:');
    lowTrafficSites.forEach(r => {
      console.log(`      - ${r.domain} (${r.totalViews} views) - Add more content/listings`);
    });
    console.log();
  }

  const highOrganicSites = results.filter(r => r.googleSessions / r.totalSessions > 0.5 && r.totalSessions > 10);
  if (highOrganicSites.length > 0) {
    console.log('   📌 SEO performers (>50% organic):');
    highOrganicSites.forEach(r => {
      const organicRate = (r.googleSessions / r.totalSessions * 100).toFixed(0);
      console.log(`      - ${r.domain} (${organicRate}% organic) - Double down on SEO`);
    });
  }
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
