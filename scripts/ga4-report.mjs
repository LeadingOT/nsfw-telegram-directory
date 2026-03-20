#!/usr/bin/env node
/**
 * GA4 Traffic Report - 站内流量分析
 * Usage: node ga4-report.mjs [property-id] [days]
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT_PATH = join(__dirname, '../secrets/gsc-service-account.json');

// Property IDs mapping
const PROPERTIES = {
  'aigirlfriend.tools': '525598443',
};

async function getGA4Report(propertyId, days = 7) {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: SERVICE_ACCOUNT_PATH,
  });

  // 1. Top Pages by Views
  const [pagesReport] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20,
  });

  // 2. Traffic Sources
  const [sourcesReport] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'sessionSource' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });

  // 3. Daily trend
  const [dailyReport] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'activeUsers' },
    ],
    orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
  });

  return {
    pages: pagesReport,
    sources: sourcesReport,
    daily: dailyReport,
  };
}

function formatDate(dateStr) {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}-${month}-${day}`;
}

async function main() {
  const args = process.argv.slice(2);
  const domain = args[0] || 'aigirlfriend.tools';
  const days = parseInt(args[1]) || 7;

  const propertyId = PROPERTIES[domain];
  
  if (!propertyId) {
    console.log(`❌ Unknown domain: ${domain}`);
    console.log('Available domains:', Object.keys(PROPERTIES).join(', '));
    process.exit(1);
  }

  console.log(`📊 GA4 Report for ${domain} (Last ${days} days)\n`);

  const report = await getGA4Report(propertyId, days);

  // Total stats
  const totalViews = report.pages.rows?.reduce((sum, row) => 
    sum + parseInt(row.metricValues[0].value), 0) || 0;
  const totalUsers = report.daily.rows?.reduce((sum, row) => 
    sum + parseInt(row.metricValues[2].value), 0) || 0;

  console.log(`📈 Overview:`);
  console.log(`   Total Views: ${totalViews}`);
  console.log(`   Total Users: ${totalUsers}`);
  console.log();

  // Daily trend
  console.log(`📅 Daily Trend:`);
  console.log(`Date\t\tViews\tSessions\tUsers`);
  report.daily.rows?.forEach(row => {
    const date = formatDate(row.dimensionValues[0].value);
    const views = row.metricValues[0].value;
    const sessions = row.metricValues[1].value;
    const users = row.metricValues[2].value;
    console.log(`${date}\t${views}\t${sessions}\t\t${users}`);
  });
  console.log();

  // Top pages
  console.log(`📄 Top 20 Pages:`);
  console.log(`Page\t\t\t\t\t\tViews\tSessions\tUsers`);
  report.pages.rows?.forEach(row => {
    const path = row.dimensionValues[0].value;
    const views = row.metricValues[0].value;
    const sessions = row.metricValues[1].value;
    const users = row.metricValues[2].value;
    const displayPath = path.length > 50 ? path.slice(0, 47) + '...' : path;
    console.log(`${displayPath.padEnd(50)}\t${views}\t${sessions}\t\t${users}`);
  });
  console.log();

  // Traffic sources
  console.log(`🔗 Traffic Sources:`);
  console.log(`Source\t\t\tSessions\tUsers`);
  report.sources.rows?.forEach(row => {
    const source = row.dimensionValues[0].value;
    const sessions = row.metricValues[0].value;
    const users = row.metricValues[1].value;
    console.log(`${source.padEnd(20)}\t${sessions}\t\t${users}`);
  });
  console.log();

  // Insights
  console.log(`💡 Insights:`);
  
  const listingViews = report.pages.rows?.filter(r => 
    r.dimensionValues[0].value.includes('/listing/')).reduce((sum, row) => 
    sum + parseInt(row.metricValues[0].value), 0) || 0;
  
  const alternativesViews = report.pages.rows?.filter(r => 
    r.dimensionValues[0].value.includes('/alternatives/')).reduce((sum, row) => 
    sum + parseInt(row.metricValues[0].value), 0) || 0;
  
  const compareViews = report.pages.rows?.filter(r => 
    r.dimensionValues[0].value.includes('/compare/')).reduce((sum, row) => 
    sum + parseInt(row.metricValues[0].value), 0) || 0;

  console.log(`   /listing/ pages: ${listingViews} views (${(listingViews/totalViews*100).toFixed(1)}%)`);
  console.log(`   /alternatives/ pages: ${alternativesViews} views (${(alternativesViews/totalViews*100).toFixed(1)}%)`);
  console.log(`   /compare/ pages: ${compareViews} views (${(compareViews/totalViews*100).toFixed(1)}%)`);
  
  const organicSessions = report.sources.rows?.find(r => 
    r.dimensionValues[0].value === 'google')?.metricValues[0].value || 0;
  const directSessions = report.sources.rows?.find(r => 
    r.dimensionValues[0].value === '(direct)')?.metricValues[0].value || 0;
  
  console.log(`\n   Organic (Google): ${organicSessions} sessions`);
  console.log(`   Direct: ${directSessions} sessions`);
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
