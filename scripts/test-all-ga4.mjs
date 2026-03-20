#!/usr/bin/env node
/**
 * Test GA4 access for all directory sites
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT_PATH = join(__dirname, '../secrets/gsc-service-account.json');

// Known GA4 Measurement IDs
const SITES = {
  'accountingai.tools': 'G-E8KF1B38B4',
  'aigirlfriend.tools': 'G-93421KKXJM',
  'bestnootropics.info': 'G-8JB00EXKV0',
  'bestofpodcasts.com': 'G-0Y94V75GB2',
  'bestonlyfans.info': 'G-RM2E1Y7V6B',
  'bestwriting.tools': 'G-VK3P0R3PDD',
  'hrai.tools': 'G-D62DBG2E4F',
  'legalai.tools': 'G-G0FYSX4M9G',
  'mattressrank.info': 'G-BP0S500KSN',
  'nsfwtelegrambot.com': 'G-JPBXLQ06VN',
  'realestateai.tools': 'G-KX2K3KGZVY',
};

// Need to discover Property IDs from Measurement IDs
// Using Google Analytics Admin API
import { google } from 'googleapis';

async function discoverPropertyIds() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const authClient = await auth.getClient();
  const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth: authClient });

  console.log('🔍 Discovering GA4 Properties...\n');

  try {
    // List all account summaries
    const response = await analyticsAdmin.accountSummaries.list();
    
    const propertyMap = {};
    
    response.data.accountSummaries?.forEach(account => {
      account.propertySummaries?.forEach(property => {
        // Match by display name or property resource name
        const propertyId = property.property?.split('/')[1];
        const displayName = property.displayName;
        
        // Try to match with our sites
        for (const [domain, measurementId] of Object.entries(SITES)) {
          if (displayName?.toLowerCase().includes(domain.split('.')[0])) {
            propertyMap[domain] = {
              propertyId,
              displayName,
              measurementId,
            };
          }
        }
      });
    });

    return propertyMap;
  } catch (error) {
    console.log('❌ Error listing properties:', error.message);
    return null;
  }
}

async function testPropertyAccess(propertyId, domain) {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: SERVICE_ACCOUNT_PATH,
  });

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'screenPageViews' }],
      limit: 1,
    });

    const totalViews = response.rows?.[0]?.metricValues[0]?.value || 0;
    return { success: true, views: totalViews };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('📊 Testing GA4 Access for All Directory Sites\n');
  
  const propertyMap = await discoverPropertyIds();
  
  if (!propertyMap) {
    console.log('⚠️  Could not auto-discover properties. Trying manual list...\n');
    
    // Manual property IDs (if known)
    const knownProperties = {
      'aigirlfriend.tools': '525598443',
      // Add others as we discover them
    };
    
    for (const [domain, propertyId] of Object.entries(knownProperties)) {
      console.log(`Testing ${domain} (${propertyId})...`);
      const result = await testPropertyAccess(propertyId, domain);
      
      if (result.success) {
        console.log(`   ✅ Access OK - ${result.views} views (7 days)\n`);
      } else {
        console.log(`   ❌ Access denied: ${result.error.split('\n')[0]}\n`);
      }
    }
    
    return;
  }

  console.log(`✅ Found ${Object.keys(propertyMap).length} properties\n`);
  
  for (const [domain, info] of Object.entries(propertyMap)) {
    console.log(`Testing ${domain}...`);
    console.log(`   Property ID: ${info.propertyId}`);
    console.log(`   Display Name: ${info.displayName}`);
    
    const result = await testPropertyAccess(info.propertyId, domain);
    
    if (result.success) {
      console.log(`   ✅ Access OK - ${result.views} views (7 days)\n`);
    } else {
      console.log(`   ❌ Access denied\n`);
    }
  }
  
  // Summary
  console.log('\n📋 Summary:');
  console.log(`   Total sites: ${Object.keys(SITES).length}`);
  console.log(`   Properties found: ${Object.keys(propertyMap).length}`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
