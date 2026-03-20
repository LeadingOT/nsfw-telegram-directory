#!/usr/bin/env node
// Check GSC indexing errors for all sites

import { google } from 'googleapis';
import fs from 'fs';

const SITES = [
  'https://accountingai.tools',
  'https://aigirlfriend.tools',
  'https://hrai.tools',
  'https://legalai.tools',
  'https://realestateai.tools',
  'https://bestwriting.tools',
  'https://bestnootropics.info',
  'https://bestonlyfans.info',
  'https://bestanime.info',
  'https://mattressrank.info',
  'https://bestofpodcasts.com',
  'https://nsfwtelegrambot.com',
  'https://bestaidetector.tools',
  'https://aihumanizer.tools',
];

const keyFile = '/home/bill/.openclaw/workspace/secrets/gsc-service-account.json';
const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

async function checkIndexing(siteUrl) {
  try {
    const response = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: siteUrl,
        siteUrl: siteUrl,
      },
    });
    
    return {
      site: siteUrl.replace('https://', ''),
      status: response.data.inspectionResult?.indexStatusResult?.verdict || 'UNKNOWN',
      coverageState: response.data.inspectionResult?.indexStatusResult?.coverageState || 'UNKNOWN',
    };
  } catch (error) {
    return {
      site: siteUrl.replace('https://', ''),
      status: 'ERROR',
      error: error.message,
    };
  }
}

async function main() {
  console.log('🔍 Checking GSC indexing status for all 14 sites...\n');
  
  const results = [];
  for (const site of SITES) {
    const result = await checkIndexing(site);
    results.push(result);
    
    const emoji = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${emoji} ${result.site}: ${result.status} (${result.coverageState || result.error})`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Summary:');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status !== 'PASS').length;
  console.log(`✅ Indexed: ${passed}`);
  console.log(`❌ Issues: ${failed}`);
}

main().catch(console.error);
