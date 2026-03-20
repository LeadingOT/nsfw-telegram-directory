#!/usr/bin/env node
// IndexNow bulk submission for all Directory Factory sites
// Usage: node indexnow-bulk-all.mjs

import https from 'https';

const INDEXNOW_KEY = '43ed8b0d2d236763fcadada0c0b14948';

const SITES = [
  'accountingai.tools',
  'aigirlfriend.tools',
  'hrai.tools',
  'legalai.tools',
  'realestateai.tools',
  'bestwriting.tools',
  'bestnootropics.info',
  'bestonlyfans.info',
  'bestanime.info',
  'mattressrank.info',
  'bestofpodcasts.com',
  'nsfwtelegrambot.com',
  'bestaidetector.tools',
  'aihumanizer.tools',
];

async function fetchSitemap(domain) {
  return new Promise((resolve, reject) => {
    https.get(`https://${domain}/sitemap-index.xml`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          // Extract URLs from sitemap
          const urlMatches = data.match(/<loc>(.*?)<\/loc>/g);
          if (urlMatches) {
            const urls = urlMatches.map(match => 
              match.replace('<loc>', '').replace('</loc>', '')
            );
            resolve(urls);
          } else {
            resolve([`https://${domain}`]); // Fallback to homepage
          }
        } else {
          resolve([`https://${domain}`]); // Fallback to homepage
        }
      });
    }).on('error', () => resolve([`https://${domain}`]));
  });
}

async function submitToIndexNow(domain, urls) {
  const payload = JSON.stringify({
    host: domain,
    key: INDEXNOW_KEY,
    keyLocation: `https://${domain}/${INDEXNOW_KEY}.txt`,
    urlList: urls.slice(0, 100), // Limit to 100 URLs per request
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ 
          statusCode: res.statusCode, 
          success: res.statusCode === 200 || res.statusCode === 202 
        });
      });
    });
    req.on('error', (e) => resolve({ success: false, error: e.message }));
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log(`📤 批量提交 ${SITES.length} 个站点到 IndexNow...\n`);
  
  let successCount = 0;
  let failCount = 0;

  for (const domain of SITES) {
    try {
      console.log(`\n🔍 处理 ${domain}...`);
      
      // Fetch sitemap to get all URLs
      const urls = await fetchSitemap(domain);
      console.log(`   找到 ${urls.length} 个URLs`);
      
      // Submit to IndexNow
      const result = await submitToIndexNow(domain, urls);
      
      if (result.success) {
        console.log(`   ✅ 成功提交 (HTTP ${result.statusCode})`);
        successCount++;
      } else {
        console.log(`   ❌ 提交失败: ${result.error || 'HTTP ' + result.statusCode}`);
        failCount++;
      }
      
      // Rate limit: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (e) {
      console.log(`   ❌ 错误: ${e.message}`);
      failCount++;
    }
  }

  console.log(`\n📊 完成！`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ❌ 失败: ${failCount}`);
  console.log(`\n💡 提示: 确保每个站点的 public/${INDEXNOW_KEY}.txt 文件存在`);
}

run().catch(console.error);
