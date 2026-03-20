#!/usr/bin/env node
/**
 * Test GA4 access with service account
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';

const SERVICE_ACCOUNT_PATH = './secrets/gsc-service-account.json';
const GA4_PROPERTY_ID = '525598443'; // aigirlfriend.tools

async function testGA4Access() {
  try {
    console.log('🔑 Testing GA4 access...');
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: SERVICE_ACCOUNT_PATH,
    });
    
    console.log('✅ Client initialized');
    
    // Try to fetch basic data for last 7 days
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'pagePath',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
      limit: 10,
    });
    
    console.log('✅ Successfully accessed GA4 data!\n');
    console.log('📊 Top 10 pages (last 7 days):');
    
    response.rows?.forEach((row, i) => {
      const path = row.dimensionValues[0].value;
      const views = row.metricValues[0].value;
      console.log(`${i + 1}. ${path} - ${views} views`);
    });
    
  } catch (error) {
    console.log('❌ Error accessing GA4:', error.message);
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n⚠️  Service account needs to be added to GA4 property');
      console.log('   Email: openclaw-gsc@openclaw-test-488308.iam.gserviceaccount.com');
      console.log('   Steps:');
      console.log('   1. Go to https://analytics.google.com/');
      console.log('   2. Admin → Property Access Management');
      console.log('   3. Click "+" → Add users');
      console.log('   4. Add the service account email with "Viewer" role');
    }
  }
}

testGA4Access();
