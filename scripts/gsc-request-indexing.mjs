#!/usr/bin/env node

/**
 * GSC Request Indexing - 批量请求Google重新索引页面
 * 
 * Google Indexing API限制：
 * - 每天200个URL quota
 * - 优先用于Job Posting和livestream video content
 * - For 其他content types，用URL Inspection Tool in GSC dashboard更可靠
 * 
 * 这个脚本会输出需要手动request的URLs
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
];

const keyFilePath = path.join(__dirname, '../secrets/gsc-service-account.json');

if (!fs.existsSync(keyFilePath)) {
  console.error('❌ GSC service account key not found:', keyFilePath);
  process.exit(1);
}

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/webmasters'],
});

async function getTopPagesForSite(siteUrl, days = 7) {
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
        dimensions: ['page'],
        rowLimit: 20, // Top 20 pages per site
        dimensionFilterGroups: [{
          filters: [{
            dimension: 'page',
            expression: '/alternatives/',
            operator: 'contains'
          }]
        }]
      },
    });
    
    const pages = response.data.rows || [];
    return pages.map(row => ({
      url: row.keys[0],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: ((row.ctr || 0) * 100).toFixed(2),
      position: (row.position || 0).toFixed(1),
    }));
  } catch (error) {
    console.error(`Error fetching ${siteUrl}:`, error.message);
    return [];
  }
}

async function main() {
  console.log('🔍 获取所有站点的Top alternatives页面...\n');
  
  const allPages = [];
  
  for (const site of SITES) {
    console.log(`📊 ${site.replace('https://', '')}...`);
    const pages = await getTopPagesForSite(site, 7);
    
    if (pages.length > 0) {
      console.log(`   找到 ${pages.length} 个alternatives页面`);
      allPages.push(...pages.map(p => ({ site, ...p })));
    } else {
      console.log(`   ⚠️ 无数据或无alternatives页面`);
    }
  }
  
  console.log(`\n✅ 总共找到 ${allPages.length} 个页面\n`);
  
  // Sort by impressions (high traffic = priority)
  allPages.sort((a, b) => b.impressions - a.impressions);
  
  // Top 50 pages to prioritize
  const topPages = allPages.slice(0, 50);
  
  console.log('📋 优先请求索引的Top 50页面（按展示量排序）：\n');
  console.log('| URL | 展示 | 点击 | CTR | 排名 |');
  console.log('|-----|------|------|-----|------|');
  
  topPages.forEach(p => {
    const shortUrl = p.url.replace('https://', '').substring(0, 60);
    console.log(`| ${shortUrl} | ${p.impressions} | ${p.clicks} | ${p.ctr}% | ${p.position} |`);
  });
  
  console.log('\n\n📝 手动Request Indexing步骤：\n');
  console.log('1. 打开 Google Search Console: https://search.google.com/search-console');
  console.log('2. 选择一个property（如 accountingai.tools）');
  console.log('3. 左侧 "URL Inspection" 工具');
  console.log('4. 粘贴URL，点击 "Request Indexing"');
  console.log('5. 每天最多10-20个URL（Google限制）\n');
  
  console.log('💡 建议策略：');
  console.log('- 优先做展示量>100的页面（ROI最高）');
  console.log('- 每天处理10个URL × 12个站点 = 120个URLs/天');
  console.log('- 3-5天内可以完成Top 50 × 12站 = 600个页面');
  console.log('- 剩余页面等待自然抓取（2-4周）\n');
  
  // Save to file
  const outputPath = path.join(__dirname, '../memory/gsc-indexing-priority.json');
  fs.writeFileSync(outputPath, JSON.stringify(topPages, null, 2));
  console.log(`✅ 优先级列表已保存到: ${outputPath}\n`);
}

main().catch(console.error);
