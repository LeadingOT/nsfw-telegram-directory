#!/usr/bin/env node
/**
 * GA4 Outbound Click Report - 查看哪些listings被点击最多
 * Usage: node ga4-outbound-report.mjs [domain] [days]
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT_PATH = join(__dirname, '../secrets/gsc-service-account.json');
const CONFIG_PATH = join(__dirname, '../config/ga4-properties.json');

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

async function getOutboundClicks(propertyId, days = 7) {
  const client = new BetaAnalyticsDataClient({
    keyFilename: SERVICE_ACCOUNT_PATH,
  });

  try {
    // Get outbound clicks grouped by listing
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [
        { name: 'customEvent:listing_name' },
        { name: 'customEvent:destination_url' },
        { name: 'customEvent:link_type' },
      ],
      metrics: [
        { name: 'eventCount' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'outbound_click',
            matchType: 'EXACT'
          }
        }
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 50,
    });

    return response;
  } catch (error) {
    console.error(`Error fetching outbound clicks:`, error.message);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const domain = args[0] || 'aigirlfriend.tools';
  const days = parseInt(args[1]) || 7;

  const propertyInfo = config.properties[domain];
  
  if (!propertyInfo || !propertyInfo.propertyId) {
    console.log(`❌ Unknown domain: ${domain}`);
    console.log('Available domains:', Object.keys(config.properties).filter(d => config.properties[d].propertyId).join(', '));
    process.exit(1);
  }

  console.log(`📊 Outbound Click Report for ${domain} (Last ${days} days)\n`);
  console.log('='.repeat(80));
  console.log();

  const report = await getOutboundClicks(propertyInfo.propertyId, days);

  if (!report || !report.rows || report.rows.length === 0) {
    console.log('❌ No outbound click data found yet.');
    console.log();
    console.log('This could mean:');
    console.log('  1. Tracking was just deployed - wait 24-48 hours');
    console.log('  2. No one has clicked a Visit button yet');
    console.log('  3. GA4 is still processing the data');
    console.log();
    console.log('💡 Check back tomorrow!');
    process.exit(0);
  }

  // Process data
  const clicksByListing = new Map();
  
  report.rows.forEach(row => {
    const listing = row.dimensionValues[0].value || '(unknown)';
    const url = row.dimensionValues[1].value || '';
    const linkType = row.dimensionValues[2].value || 'unknown';
    const clicks = parseInt(row.metricValues[0].value);
    
    if (!clicksByListing.has(listing)) {
      clicksByListing.set(listing, {
        listing,
        url,
        linkType,
        clicks: 0
      });
    }
    
    const data = clicksByListing.get(listing);
    data.clicks += clicks;
  });

  // Sort by clicks
  const sorted = Array.from(clicksByListing.values()).sort((a, b) => b.clicks - a.clicks);
  
  const totalClicks = sorted.reduce((sum, item) => sum + item.clicks, 0);

  console.log(`📈 Total Outbound Clicks: ${totalClicks}\n`);
  
  console.log('🏆 Top Listings by Clicks:\n');
  console.log('Rank\tListing Name\t\t\t\t\tClicks\t% of Total');
  console.log('-'.repeat(90));
  
  sorted.forEach((item, index) => {
    const rank = (index + 1).toString().padStart(2);
    const name = item.listing.slice(0, 40).padEnd(40);
    const percent = ((item.clicks / totalClicks) * 100).toFixed(1);
    console.log(`${rank}.\t${name}\t${item.clicks}\t${percent}%`);
  });

  console.log();
  console.log('💡 Insights:\n');
  
  // Top 3 listings
  console.log('   🥇 Top 3 Most Clicked:');
  sorted.slice(0, 3).forEach((item, i) => {
    console.log(`      ${i + 1}. ${item.listing} - ${item.clicks} clicks`);
  });
  console.log();
  
  // Click distribution
  const top5Clicks = sorted.slice(0, 5).reduce((sum, item) => sum + item.clicks, 0);
  const top5Percent = ((top5Clicks / totalClicks) * 100).toFixed(1);
  console.log(`   📊 Top 5 listings account for ${top5Percent}% of all clicks`);
  console.log();
  
  // Low performers
  const lowPerformers = sorted.filter(item => item.clicks < 2);
  if (lowPerformers.length > 0) {
    console.log(`   ⚠️  ${lowPerformers.length} listings with <2 clicks - consider improving visibility`);
  }
  
  console.log();
  console.log('🚀 Next Steps:\n');
  console.log('   1. Identify high-click listings → research affiliate programs');
  console.log('   2. Low-click listings → improve positioning on page');
  console.log('   3. Compare with GA4 pageviews to calculate CTR');
  console.log();
  console.log(`💰 Potential Affiliate Revenue (if 5% convert at $10/conversion):`);
  const estimatedRevenue = totalClicks * 0.05 * 10;
  console.log(`   ${totalClicks} clicks × 5% × $10 = $${estimatedRevenue.toFixed(2)}`);
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
