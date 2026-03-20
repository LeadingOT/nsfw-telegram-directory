#!/usr/bin/env node

/**
 * GSC All Sites Summary - Get 7-day traffic for all 12 directory sites
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITES = [
  // AI垂直（.tools）
  'https://accountingai.tools',
  'https://aigirlfriend.tools',
  'https://hrai.tools',
  'https://legalai.tools',
  'https://realestateai.tools',
  'https://bestwriting.tools',
  
  // Entertainment/NSFW（.info）
  'https://bestnootropics.info',
  'https://bestonlyfans.info',
  'https://bestanime.info',
  'https://mattressrank.info',
  
  // 通用（.com）
  'https://bestofpodcasts.com',
  'https://nsfwtelegrambot.com',
];

const DAYS = 7;

async function getGSCData(auth, siteUrl, days) {
  const webmasters = google.searchconsole({ version: 'v1', auth });
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  
  try {
    const response = await webmasters.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: [],
        rowLimit: 1,
      },
    });
    
    const data = response.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    
    return {
      site: siteUrl.replace('https://', ''),
      clicks: data.clicks || 0,
      impressions: data.impressions || 0,
      ctr: ((data.ctr || 0) * 100).toFixed(2),
      position: (data.position || 0).toFixed(1),
    };
  } catch (error) {
    console.error(`Error fetching ${siteUrl}:`, error.message);
    return {
      site: siteUrl.replace('https://', ''),
      clicks: 0,
      impressions: 0,
      ctr: '0.00',
      position: '0.0',
      error: error.message,
    };
  }
}

async function main() {
  const keyFilePath = path.join(__dirname, '../secrets/gsc-service-account.json');
  
  if (!fs.existsSync(keyFilePath)) {
    console.error('❌ GSC service account key not found:', keyFilePath);
    process.exit(1);
  }
  
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  
  console.log(`📊 Fetching GSC data for ${SITES.length} sites (past ${DAYS} days)...\n`);
  
  const results = [];
  
  for (const site of SITES) {
    const data = await getGSCData(auth, site, DAYS);
    results.push(data);
  }
  
  // Sort by clicks (descending)
  results.sort((a, b) => b.clicks - a.clicks);
  
  // Print table
  console.log('| Site | Clicks | Impressions | CTR | Avg Position |');
  console.log('|------|--------|-------------|-----|--------------|');
  
  for (const r of results) {
    if (r.error) {
      console.log(`| ${r.site} | ERROR | ${r.error} | | |`);
    } else {
      console.log(`| ${r.site} | ${r.clicks} | ${r.impressions.toLocaleString()} | ${r.ctr}% | ${r.position} |`);
    }
  }
  
  // Totals
  const totalClicks = results.reduce((sum, r) => sum + (r.clicks || 0), 0);
  const totalImpressions = results.reduce((sum, r) => sum + (r.impressions || 0), 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  
  console.log('|------|--------|-------------|-----|--------------|');
  console.log(`| **TOTAL** | **${totalClicks}** | **${totalImpressions.toLocaleString()}** | **${avgCTR}%** | - |`);
  
  console.log(`\n✅ Summary: ${totalClicks} clicks, ${totalImpressions.toLocaleString()} impressions over ${DAYS} days`);
}

main().catch(console.error);
