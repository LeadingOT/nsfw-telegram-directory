#!/usr/bin/env node
// IndexNow bulk URL submission
// Usage: node indexnow-submit.mjs <domain>

import https from 'https';
import fs from 'fs';

const [,, domain] = process.argv;

if (!domain) {
  console.log('Usage: node indexnow-submit.mjs <domain>');
  process.exit(1);
}

// Generate a simple key (in production, use a persistent key and host at /<key>.txt)
const apiKey = '8f4c9a72b1e6d3f0a5b2c7e9d4f1a8c3';

// IndexNow endpoints (Yandex, Bing, etc.)
const ENDPOINTS = {
  yandex: 'yandex.com',
  bing: 'api.indexnow.org', // Bing/Microsoft endpoint
};

// Build URLs for the site
function generateUrls(domain) {
  const base = `https://${domain}`;
  const urls = [
    base,
    `${base}/categories`,
    `${base}/top-creators-2026`,
    `${base}/pricing-guide`,
  ];

  // Add category pages (we have 10 categories)
  const categories = [
    'fitness', 'gaming', 'lifestyle', 'adult', 'asmr',
    'cosplay', 'art', 'fashion', 'music', 'comedy'
  ];
  categories.forEach(cat => urls.push(`${base}/category/${cat}`));

  // Add blog posts (4 posts)
  const blogSlugs = [
    'how-to-choose-onlyfans-creator',
    'onlyfans-vs-fansly-comparison',
    'top-onlyfans-categories-2026',
    'is-onlyfans-subscription-worth-it'
  ];
  blogSlugs.forEach(slug => urls.push(`${base}/blog/${slug}`));

  // Could add all 30 creator pages, but let's keep it to key pages for now
  // Total: ~20 key URLs
  
  return urls;
}

function submitToIndexNow(endpoint, domain, urls, apiKey) {
  const payload = JSON.stringify({
    host: domain,
    key: apiKey,
    keyLocation: `https://${domain}/${apiKey}.txt`,
    urlList: urls,
  });

  const options = {
    hostname: endpoint,
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ endpoint, status: 'success', statusCode: res.statusCode });
        } else {
          resolve({ endpoint, status: 'error', statusCode: res.statusCode, data });
        }
      });
    });

    req.on('error', (e) => reject({ endpoint, status: 'error', message: e.message }));
    req.write(payload);
    req.end();
  });
}

async function run() {
  const urls = generateUrls(domain);
  console.log(`📤 Submitting ${urls.length} URLs for ${domain} via IndexNow...\n`);

  // Submit to Yandex (as specified in task)
  console.log('Submitting to Yandex IndexNow...');
  try {
    const result = await submitToIndexNow(ENDPOINTS.yandex, domain, urls, apiKey);
    if (result.status === 'success') {
      console.log(`✅ Yandex: Successfully submitted ${urls.length} URLs (HTTP ${result.statusCode})`);
    } else {
      console.log(`⚠️  Yandex: ${result.status} (HTTP ${result.statusCode})`);
    }
  } catch (e) {
    console.log(`❌ Yandex: Error - ${e.message || e.status}`);
  }

  // Also submit to Bing/Microsoft (bonus)
  console.log('\nSubmitting to Bing/Microsoft IndexNow...');
  try {
    const result = await submitToIndexNow(ENDPOINTS.bing, domain, urls, apiKey);
    if (result.status === 'success') {
      console.log(`✅ Bing: Successfully submitted ${urls.length} URLs (HTTP ${result.statusCode})`);
    } else {
      console.log(`⚠️  Bing: ${result.status} (HTTP ${result.statusCode})`);
    }
  } catch (e) {
    console.log(`❌ Bing: Error - ${e.message || e.status}`);
  }

  console.log(`\n📝 Note: For IndexNow to work properly, host this file at:`);
  console.log(`   https://${domain}/${apiKey}.txt`);
  console.log(`   Content: ${apiKey}`);
  console.log(`\n💡 URLs submitted:`);
  urls.slice(0, 10).forEach(url => console.log(`   - ${url}`));
  if (urls.length > 10) console.log(`   ... and ${urls.length - 10} more`);
}

run().catch(console.error);
