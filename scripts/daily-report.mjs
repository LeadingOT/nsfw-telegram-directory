// Daily report generator for all directories
// Usage: node daily-report.mjs

import fs from 'fs';
import { google } from 'googleapis';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const state = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/memory/heartbeat-state.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const endDate = new Date().toISOString().split('T')[0];
const startDate = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

async function getTraffic(domain) {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });
  const siteUrl = `https://${domain}/`;
  
  try {
    const res = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: { startDate, endDate, dimensions: ['date'], rowLimit: 7 },
    });
    const rows = res.data.rows || [];
    const totalClicks = rows.reduce((s, r) => s + r.clicks, 0);
    const totalImpressions = rows.reduce((s, r) => s + r.impressions, 0);
    const avgPosition = rows.length ? (rows.reduce((s, r) => s + r.position, 0) / rows.length).toFixed(1) : 'N/A';
    return { clicks: totalClicks, impressions: totalImpressions, avgPosition, days: rows.length };
  } catch (e) {
    return { clicks: 0, impressions: 0, avgPosition: 'N/A', days: 0, error: e.message };
  }
}

async function run() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  let report = `📊 Daily Report — ${today}\n\n`;
  
  for (const [domain, info] of Object.entries(state.directories)) {
    const traffic = await getTraffic(domain);
    const daysSinceLaunch = Math.floor((Date.now() - new Date(info.launched).getTime()) / 86400000);
    
    report += `🌐 ${domain}\n`;
    report += `  Launched: ${info.launched} (${daysSinceLaunch} days ago)\n`;
    report += `  Pages: ${info.totalPages} | Listings: ${info.totalListings} | Blog posts: ${info.totalPosts}\n`;
    
    if (traffic.days > 0) {
      report += `  7d Traffic: ${traffic.clicks} clicks, ${traffic.impressions} impressions\n`;
      report += `  Avg Position: ${traffic.avgPosition}\n`;
    } else {
      report += `  Traffic: No data yet (${traffic.error || 'GSC needs 2-3 days'})\n`;
    }
    report += '\n';
  }
  
  console.log(report);
}

run().catch(console.error);
