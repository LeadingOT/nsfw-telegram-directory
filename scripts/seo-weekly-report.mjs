// Weekly SEO Report - Combines GSC + GA4 data
// Usage: node seo-weekly-report.mjs <domain>

import { google } from 'googleapis';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(
  fs.readFileSync('/home/bill/.openclaw/workspace/secrets/gsc-service-account.json', 'utf8')
);

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
});

const PROPERTY_MAP = {
  'accountingai.tools': '526242077',
  'aigirlfriend.tools': '526242422',
  'realestateai.tools': '526242547',
  'hrai.tools': '526242672',
  'legalai.tools': '526242797',
  'bestnootropics.info': '526242922',
  'nsfwtelegrambot.com': '526243047',
  'bestonlyfans.info': '526243172',
  'bestanime.info': '526243297',
  'bestofpodcasts.com': '526243422',
  'bestwriting.tools': '526275077',
  'mattressrank.info': '526337202',
  'roleoffer.com': '526338627',
};

const [,, domain] = process.argv;
if (!domain) {
  console.log('Usage: node seo-weekly-report.mjs <domain>');
  console.log('\nAvailable domains:');
  Object.keys(PROPERTY_MAP).forEach(d => console.log(`  - ${d}`));
  process.exit(1);
}

const propertyId = PROPERTY_MAP[domain];
if (!propertyId) {
  console.log(`❌ Unknown domain: ${domain}`);
  process.exit(1);
}

const siteUrl = `https://${domain}/`;
const days = 7;
const endDate = new Date().toISOString().split('T')[0];
const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

// Compare with previous week
const prevEndDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
const prevStartDate = new Date(Date.now() - days * 2 * 86400000).toISOString().split('T')[0];

async function run() {
  const authClient = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: authClient });
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth: authClient });

  console.log('━'.repeat(80));
  console.log(`📊 Weekly SEO Report - ${domain}`);
  console.log(`📅 ${startDate} to ${endDate}`);
  console.log('━'.repeat(80));
  console.log('');

  // ===== GOOGLE SEARCH CONSOLE =====
  console.log('🔍 GOOGLE SEARCH CONSOLE\n');

  try {
    // Current week
    const gscRes = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: [],
      },
    });

    const current = gscRes.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    // Previous week
    const gscPrevRes = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: prevStartDate,
        endDate: prevEndDate,
        dimensions: [],
      },
    });

    const prev = gscPrevRes.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    const clicksDelta = current.clicks - prev.clicks;
    const impDelta = current.impressions - prev.impressions;
    const ctrDelta = current.ctr - prev.ctr;
    const posDelta = prev.position - current.position; // Lower is better

    console.log('📈 Performance Summary:');
    console.log(`  Total Clicks:        ${current.clicks.toLocaleString().padStart(8)} ${formatDelta(clicksDelta)}`);
    console.log(`  Total Impressions:   ${current.impressions.toLocaleString().padStart(8)} ${formatDelta(impDelta)}`);
    console.log(`  Average CTR:         ${(current.ctr * 100).toFixed(2).padStart(8)}% ${formatDelta(ctrDelta * 100, '%')}`);
    console.log(`  Average Position:    ${current.position.toFixed(1).padStart(8)} ${formatDelta(posDelta, '', true)}`);
    console.log('');

    // Top queries
    const queriesRes = await webmasters.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 10,
      },
    });

    const queries = queriesRes.data.rows || [];
    if (queries.length > 0) {
      console.log('🔑 Top Queries:');
      queries.forEach(row => {
        const query = row.keys[0];
        const clicks = row.clicks;
        const imp = row.impressions;
        const ctr = row.ctr * 100;
        const pos = row.position;
        console.log(`  ${query.slice(0, 40).padEnd(42)} ${clicks}c ${imp}i ${ctr.toFixed(1)}% #${pos.toFixed(1)}`);
      });
      console.log('');
    }

    // Find optimization opportunities (high impressions, low CTR)
    const opportunities = queries.filter(q => q.impressions > 10 && q.ctr < 0.02);
    if (opportunities.length > 0) {
      console.log('⚠️  Optimization Opportunities (High Impressions, Low CTR):');
      opportunities.forEach(row => {
        const query = row.keys[0];
        const imp = row.impressions;
        const ctr = (row.ctr * 100).toFixed(1);
        const pos = row.position.toFixed(1);
        console.log(`  "${query}"`);
        console.log(`    ${imp} impressions, ${ctr}% CTR, position #${pos}`);
        console.log(`    💡 Improve title/meta to capture more clicks\n`);
      });
    }

  } catch (error) {
    console.log(`⚠️  GSC data not available: ${error.message}\n`);
  }

  // ===== GOOGLE ANALYTICS 4 =====
  console.log('━'.repeat(80));
  console.log('📊 GOOGLE ANALYTICS 4\n');

  try {
    // Overall metrics
    const ga4Res = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
        ],
      },
    });

    const metrics = ga4Res.data.rows?.[0]?.metricValues || [];
    if (metrics.length > 0) {
      console.log('📈 User Engagement:');
      console.log(`  Active Users:        ${parseInt(metrics[0]?.value || 0).toLocaleString()}`);
      console.log(`  Sessions:            ${parseInt(metrics[1]?.value || 0).toLocaleString()}`);
      console.log(`  Page Views:          ${parseInt(metrics[2]?.value || 0).toLocaleString()}`);
      console.log(`  Bounce Rate:         ${(parseFloat(metrics[3]?.value || 0) * 100).toFixed(1)}%`);
      console.log('');

      // Traffic sources
      const sourcesRes = await analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 5,
        },
      });

      console.log('🌍 Traffic Sources:');
      const sources = sourcesRes.data.rows || [];
      const totalSessions = parseInt(metrics[1]?.value || 1);
      sources.forEach(row => {
        const channel = row.dimensionValues[0].value;
        const sessions = parseInt(row.metricValues[0].value);
        const percent = ((sessions / totalSessions) * 100).toFixed(1);
        console.log(`  ${channel.padEnd(25)} ${sessions.toString().padStart(6)} (${percent}%)`);
      });
      console.log('');
    } else {
      console.log('⚠️  No GA4 data yet (takes 24-48h after installation)\n');
    }

  } catch (error) {
    console.log(`⚠️  GA4 data not available: ${error.message}\n`);
  }

  console.log('━'.repeat(80));
  console.log('✅ Report Complete');
  console.log('━'.repeat(80));
}

function formatDelta(delta, suffix = '', reverse = false) {
  if (delta === 0) return '(→)';
  
  const isPositive = reverse ? delta < 0 : delta > 0;
  const arrow = isPositive ? '↑' : '↓';
  const sign = isPositive ? '+' : '';
  const value = Math.abs(delta).toFixed(suffix === '%' ? 2 : 0);
  
  return `(${arrow} ${sign}${value}${suffix})`;
}

run().catch(console.error);
