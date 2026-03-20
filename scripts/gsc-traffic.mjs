// Google Search Console traffic report
// Usage: node gsc-traffic.mjs <domain> [days]

import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const [,, domain, daysStr] = process.argv;
const days = parseInt(daysStr) || 7;

if (!domain) {
  console.log('Usage: node gsc-traffic.mjs <domain> [days]');
  process.exit(1);
}

const siteUrl = `https://${domain}/`;
const endDate = new Date().toISOString().split('T')[0];
const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

async function run() {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });

  // Overall stats
  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date'],
        rowLimit: 30,
      },
    });
    
    const rows = res.data.rows || [];
    if (rows.length === 0) {
      console.log(`No data yet for ${domain} (${startDate} to ${endDate})`);
      console.log('Note: GSC data usually takes 2-3 days to appear after verification.');
      return;
    }

    let totalClicks = 0, totalImpressions = 0;
    console.log(`\n📊 ${domain} Traffic Report (${startDate} to ${endDate})\n`);
    console.log('Date\t\tClicks\tImpressions\tCTR\tPosition');
    rows.forEach(row => {
      totalClicks += row.clicks;
      totalImpressions += row.impressions;
      console.log(`${row.keys[0]}\t${row.clicks}\t${row.impressions}\t\t${(row.ctr*100).toFixed(1)}%\t${row.position.toFixed(1)}`);
    });
    console.log(`\nTotal: ${totalClicks} clicks, ${totalImpressions} impressions`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Top queries
  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 20,
      },
    });
    
    const rows = res.data.rows || [];
    if (rows.length > 0) {
      console.log('\n🔍 Top Queries:');
      console.log('Query\t\t\t\tClicks\tImpressions\tPosition');
      rows.forEach(row => {
        const q = row.keys[0].padEnd(30);
        console.log(`${q}\t${row.clicks}\t${row.impressions}\t\t${row.position.toFixed(1)}`);
      });
    }
  } catch (e) {}

  // Top pages
  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 10,
      },
    });
    
    const rows = res.data.rows || [];
    if (rows.length > 0) {
      console.log('\n📄 Top Pages:');
      rows.forEach(row => {
        const page = row.keys[0].replace(siteUrl, '/');
        console.log(`${page}\t${row.clicks} clicks\t${row.impressions} impressions`);
      });
    }
  } catch (e) {}

  // Indexing status
  try {
    const res = await webmasters.sitemaps.list({ siteUrl });
    const maps = res.data.sitemap || [];
    if (maps.length > 0) {
      console.log('\n🗺️ Sitemap Status:');
      maps.forEach(m => {
        console.log(`${m.path} — ${m.isPending ? 'Pending' : 'Processed'}, ${m.contents?.[0]?.submitted || '?'} URLs submitted`);
      });
    }
  } catch (e) {}
}

run().catch(console.error);
