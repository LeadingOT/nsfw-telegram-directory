#!/usr/bin/env node
// Verify canonical URLs are correct (not localhost) for all sites

import https from 'https';

const SITES = [
  {
    domain: 'accountingai.tools',
    pages: [
      '/',
      '/blog/best-ai-tax-preparation-tools-for-accountants/',
      '/compare/digits-vs-numeric/',
      '/alternatives/bill/',
    ]
  },
  {
    domain: 'aigirlfriend.tools',
    pages: [
      '/',
      '/compare/candy-ai-vs-darlink-ai/',
      '/alternatives/sillytavern/',
    ]
  },
  {
    domain: 'hrai.tools',
    pages: ['/', '/compare/lattice-vs-15five/']
  },
  {
    domain: 'legalai.tools',
    pages: ['/', '/compare/harvey-ai-vs-casetext/']
  },
  {
    domain: 'realestateai.tools',
    pages: ['/']
  },
  {
    domain: 'bestwriting.tools',
    pages: ['/', '/blog/best-free-ai-writing-tools/']
  },
  {
    domain: 'bestnootropics.info',
    pages: ['/']
  },
  {
    domain: 'bestonlyfans.info',
    pages: ['/']
  },
  {
    domain: 'bestanime.info',
    pages: ['/']
  },
  {
    domain: 'mattressrank.info',
    pages: ['/']
  },
  {
    domain: 'bestofpodcasts.com',
    pages: ['/']
  },
  {
    domain: 'nsfwtelegrambot.com',
    pages: ['/']
  },
  {
    domain: 'bestaidetector.tools',
    pages: [
      '/',
      '/blog/best-ai-content-detectors-2026-comparison/',
      '/compare/gptzero-vs-originality-ai/',
      '/alternatives/turnitin/',
    ]
  },
  {
    domain: 'aihumanizer.tools',
    pages: [
      '/',
      '/blog/best-ai-humanizer-tools-2026/',
      '/compare/undetectable-ai-vs-humbot/',
      '/alternatives/quillbot/',
    ]
  },
];

async function fetchPage(domain, path) {
  return new Promise((resolve) => {
    const url = `https://${domain}${path}`;
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve({ 
          url, 
          status: res.statusCode, 
          canonical: null, 
          error: `HTTP ${res.statusCode}` 
        });
        return;
      }

      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        // Extract canonical URL
        const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
        const canonical = match ? match[1] : null;
        
        resolve({
          url,
          status: res.statusCode,
          canonical,
          isValid: canonical && canonical.startsWith(`https://${domain}`) && !canonical.includes('localhost'),
        });
      });
    }).on('error', (e) => {
      resolve({ url, status: 0, canonical: null, error: e.message });
    });
  });
}

async function verifySite(site) {
  console.log(`\n🔍 Checking ${site.domain}...`);
  
  const results = [];
  for (const path of site.pages) {
    const result = await fetchPage(site.domain, path);
    results.push(result);
    
    const emoji = result.isValid ? '✅' : '❌';
    const statusMsg = result.error ? `ERROR: ${result.error}` : 
                      !result.canonical ? 'NO CANONICAL' :
                      result.canonical.includes('localhost') ? `LOCALHOST: ${result.canonical}` :
                      !result.isValid ? `WRONG: ${result.canonical}` :
                      'OK';
    
    console.log(`  ${emoji} ${path} - ${statusMsg}`);
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}

async function main() {
  console.log('🔍 Verifying canonical URLs for all 14 sites...\n');
  console.log('⏱️  This will take ~2 minutes...\n');
  
  const allResults = [];
  let totalPages = 0;
  let validPages = 0;
  let invalidPages = 0;
  let errorPages = 0;
  
  for (const site of SITES) {
    const results = await verifySite(site);
    allResults.push({ site: site.domain, results });
    
    totalPages += results.length;
    validPages += results.filter(r => r.isValid).length;
    invalidPages += results.filter(r => !r.isValid && r.canonical && !r.error).length;
    errorPages += results.filter(r => r.error || !r.canonical).length;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`Total pages checked: ${totalPages}`);
  console.log(`✅ Valid canonicals: ${validPages} (${Math.round(validPages/totalPages*100)}%)`);
  console.log(`❌ Invalid canonicals: ${invalidPages}`);
  console.log(`⚠️  Errors/Missing: ${errorPages}`);
  
  if (invalidPages > 0) {
    console.log('\n❌ FAILED: Some pages still have incorrect canonicals');
    console.log('Wait 5 minutes for Vercel deployment to complete, then re-run.');
    process.exit(1);
  } else if (errorPages > 0) {
    console.log('\n⚠️  WARNING: Some pages have errors or missing canonicals');
    process.exit(0);
  } else {
    console.log('\n✅ SUCCESS: All canonical URLs are correct!');
    process.exit(0);
  }
}

main().catch(console.error);
