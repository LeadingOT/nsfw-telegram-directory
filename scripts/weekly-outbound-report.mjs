#!/usr/bin/env node
/**
 * Weekly Outbound Click Report - All 11 sites
 * Auto-generates导流报告 for all directory sites
 * Usage: node weekly-outbound-report.mjs
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
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
      dimensions: [
        { name: 'customEvent:listing_name' },
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
      limit: 10,
    });

    if (!response.rows || response.rows.length === 0) {
      return { totalClicks: 0, topListings: [] };
    }

    const listings = response.rows.map(row => ({
      name: row.dimensionValues[0].value || '(unknown)',
      clicks: parseInt(row.metricValues[0].value)
    }));

    const totalClicks = listings.reduce((sum, item) => sum + item.clicks, 0);

    return {
      totalClicks,
      topListings: listings.slice(0, 5)
    };
  } catch (error) {
    // Tracking刚部署，可能还没数据
    return { totalClicks: 0, topListings: [], error: error.message };
  }
}

async function main() {
  const days = parseInt(process.argv[2]) || 7;
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  console.log(`📊 Directory Factory CEO 周报 | ${today}\n`);
  console.log('='.repeat(80));
  console.log();
  console.log(`🔗 Outbound Click Analysis (Last ${days} days)\n`);

  const sites = Object.entries(config.properties)
    .filter(([_, info]) => info.propertyId)
    .sort(([a], [b]) => a.localeCompare(b));

  let totalClicksAll = 0;
  const siteResults = [];

  for (const [domain, info] of sites) {
    process.stdout.write(`📈 ${domain}... `);
    
    const data = await getOutboundClicks(info.propertyId, days);
    totalClicksAll += data.totalClicks;
    
    siteResults.push({
      domain,
      ...data
    });

    if (data.totalClicks > 0) {
      console.log(`✅ ${data.totalClicks} clicks`);
    } else if (data.error) {
      console.log(`⏳ No data yet (${data.error.includes('not been used') ? 'API需要启用' : 'tracking刚部署'})`);
    } else {
      console.log(`⏳ No clicks yet`);
    }
  }

  console.log();
  console.log('='.repeat(80));
  console.log();

  // Summary table
  console.log('📊 Summary by Site\n');
  console.log('Site\t\t\t\t\tTotal Clicks\tTop Listing');
  console.log('-'.repeat(90));

  siteResults.sort((a, b) => b.totalClicks - a.totalClicks);

  siteResults.forEach(site => {
    const domainPadded = site.domain.padEnd(35);
    const clicks = site.totalClicks.toString().padStart(5);
    const topListing = site.topListings[0]?.name || 'N/A';
    const topClicks = site.topListings[0]?.clicks || 0;
    
    if (site.totalClicks > 0) {
      console.log(`${domainPadded}\t${clicks}\t\t${topListing} (${topClicks})`);
    } else {
      console.log(`${domainPadded}\t${clicks}\t\t-`);
    }
  });

  console.log();
  console.log(`TOTAL ACROSS ALL SITES\t\t\t${totalClicksAll}`);
  console.log();

  // Top performers
  const activeSites = siteResults.filter(s => s.totalClicks > 0);
  
  if (activeSites.length > 0) {
    console.log('🏆 Top Performing Sites:\n');
    activeSites.slice(0, 3).forEach((site, i) => {
      const percent = totalClicksAll > 0 ? ((site.totalClicks / totalClicksAll) * 100).toFixed(1) : '0';
      console.log(`   ${i + 1}. ${site.domain} - ${site.totalClicks} clicks (${percent}%)`);
    });
    console.log();

    // Top listings across all sites
    const allListings = new Map();
    
    activeSites.forEach(site => {
      site.topListings.forEach(listing => {
        const current = allListings.get(listing.name) || 0;
        allListings.set(listing.name, current + listing.clicks);
      });
    });

    const topGlobal = Array.from(allListings.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topGlobal.length > 0) {
      console.log('🌟 Top Listings (Across All Sites):\n');
      topGlobal.forEach(([name, clicks], i) => {
        console.log(`   ${i + 1}. ${name} - ${clicks} clicks`);
      });
      console.log();
    }

    // Revenue estimate
    const estimatedRevenue = totalClicksAll * 0.05 * 10; // 5% conversion at $10
    console.log(`💰 Estimated Affiliate Revenue Potential:\n`);
    console.log(`   ${totalClicksAll} clicks × 5% conversion × $10/sale = $${estimatedRevenue.toFixed(2)}\n`);
    console.log(`   📈 Annualized: $${(estimatedRevenue * 52 / days * 7).toFixed(0)}/year\n`);
  } else {
    console.log('⏳ No outbound click data yet.\n');
    console.log('   This is normal if tracking was just deployed (<24 hours ago).\n');
    console.log('   Check back tomorrow for data!\n');
  }

  // Detailed breakdown for top 3 sites
  const top3 = activeSites.slice(0, 3);
  
  if (top3.length > 0) {
    console.log('📋 Detailed Breakdown (Top 3 Sites):\n');
    
    for (const site of top3) {
      console.log(`▸ ${site.domain} - ${site.totalClicks} total clicks`);
      console.log();
      console.log('  Top 5 Listings:');
      site.topListings.forEach((listing, i) => {
        const percent = ((listing.clicks / site.totalClicks) * 100).toFixed(1);
        console.log(`     ${i + 1}. ${listing.name} - ${listing.clicks} clicks (${percent}%)`);
      });
      console.log();
    }
  }

  // Action items
  console.log('🚀 Next Steps:\n');
  
  if (totalClicksAll === 0) {
    console.log('   1. ⏳ Wait 24-48 hours for tracking data to accumulate');
    console.log('   2. 🧪 Test: Visit a listing page and click "Visit" button');
    console.log('   3. 🔍 Verify in GA4: Reports → Events → outbound_click');
  } else {
    console.log('   1. 🔍 Research affiliate programs for top 10 listings');
    console.log('   2. 📝 Apply to Impact.com / CJ Affiliate');
    console.log('   3. 🔗 Get affiliate links and update listings data');
    console.log('   4. 💵 Start earning commissions!');
  }
  
  console.log();
  console.log(`📅 Report generated: ${new Date().toISOString()}`);
  console.log(`⏰ Next report: Run this script weekly or add to cron`);
}

main().catch(error => {
  console.error('❌ Error generating report:', error.message);
  process.exit(1);
});
