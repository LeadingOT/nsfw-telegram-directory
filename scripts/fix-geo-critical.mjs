#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const workspace = process.env.HOME + '/.openclaw/workspace';

// Site configuration with correct domains
const siteConfigs = {
  'accountingai-directory': { domain: 'accountingai.tools', name: 'AccountingAI.tools' },
  'aigirlfriend-directory': { domain: 'aigirlfriend.tools', name: 'AIGirlfriend.tools' },
  'aihumanizer-directory': { domain: 'aihumanizer.tools', name: 'AI Humanizer Tools' },
  'bestaidetector-directory': { domain: 'bestaidetector.tools', name: 'Best AI Detector' },
  'bestanime-directory': { domain: 'bestanime.info', name: 'Best Anime' },
  'bestnootropics-directory': { domain: 'bestnootropics.info', name: 'Best Nootropics' },
  'bestofpodcasts-directory': { domain: 'bestofpodcasts.com', name: 'Best of Podcasts' },
  'bestonlyfans-directory': { domain: 'bestonlyfans.info', name: 'Best OnlyFans' },
  'bestwriting-directory': { domain: 'bestwriting.tools', name: 'Best Writing Tools' },
  'hrai-directory': { domain: 'hrai.tools', name: 'HRAI.tools' },
  'legalai-directory': { domain: 'legalai.tools', name: 'LegalAI.tools' },
  'mattressrank-directory': { domain: 'mattressrank.info', name: 'Mattress Rank' },
  'nsfw-telegram-directory': { domain: 'nsfwtelegrambot.com', name: 'NSFW Telegram Bot' },
  'realestateai-directory': { domain: 'realestateai.tools', name: 'RealEstateAI.tools' },
};

// AI Crawler robots.txt rules
const aiCrawlerRules = `
# AI Crawler Access (GEO Optimization)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Omgilibot
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: Diffbot
Allow: /

User-agent: ImagesiftBot
Allow: /
`;

// Fix astro.config.mjs canonical URL
function fixAstroConfig(sitePath, domain) {
  const configPath = path.join(sitePath, 'astro.config.mjs');
  
  if (!fs.existsSync(configPath)) {
    return { success: false, reason: 'config not found' };
  }
  
  let content = fs.readFileSync(configPath, 'utf-8');
  const originalContent = content;
  
  // Fix site URL
  content = content.replace(
    /site:\s*['"]https?:\/\/[^'"]+['"]/,
    `site: 'https://${domain}'`
  );
  
  // Also fix if it's localhost or example.com
  content = content.replace(
    /site:\s*['"]https?:\/\/(localhost|example\.com)['"]/,
    `site: 'https://${domain}'`
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(configPath, content, 'utf-8');
    return { success: true, changed: true };
  }
  
  return { success: true, changed: false };
}

// Update robots.txt with AI crawler rules
function updateRobotsTxt(sitePath, domain) {
  const robotsPath = path.join(sitePath, 'public/robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    // Create robots.txt if missing
    const content = `User-agent: *
Allow: /
${aiCrawlerRules}
Sitemap: https://${domain}/sitemap-index.xml`;
    fs.writeFileSync(robotsPath, content, 'utf-8');
    return { success: true, created: true };
  }
  
  let content = fs.readFileSync(robotsPath, 'utf-8');
  
  // Check if AI crawler rules already exist
  if (content.includes('GPTBot') && content.includes('ClaudeBot')) {
    return { success: true, changed: false };
  }
  
  // Add AI crawler rules before sitemap
  if (content.includes('Sitemap:')) {
    content = content.replace(/Sitemap:/, `${aiCrawlerRules}\nSitemap:`);
  } else {
    content += `\n${aiCrawlerRules}`;
  }
  
  fs.writeFileSync(robotsPath, content, 'utf-8');
  return { success: true, changed: true };
}

// Generate Organization schema
function generateOrgSchema(domain, name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: `https://${domain}`,
    description: `Comprehensive directory and comparison of tools on ${domain}`,
    logo: `https://${domain}/logo.png`,
    sameAs: []
  };
}

// Generate WebSite schema with SearchAction
function generateWebSiteSchema(domain, name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    url: `https://${domain}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://${domain}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// Add schema to BaseLayout.astro
function addSchemaToLayout(sitePath, domain, name) {
  const layoutPath = path.join(sitePath, 'src/layouts/BaseLayout.astro');
  
  if (!fs.existsSync(layoutPath)) {
    return { success: false, reason: 'layout not found' };
  }
  
  let content = fs.readFileSync(layoutPath, 'utf-8');
  
  // Check if Organization schema already exists
  if (content.includes('"@type": "Organization"') || content.includes("'@type': 'Organization'")) {
    return { success: true, changed: false };
  }
  
  const orgSchema = generateOrgSchema(domain, name);
  const websiteSchema = generateWebSiteSchema(domain, name);
  
  // Find the </head> tag and insert schemas before it
  const schemaScripts = `
    <!-- GEO Optimization: Organization Schema -->
    <script type="application/ld+json">
      ${JSON.stringify(orgSchema, null, 2)}
    </script>
    
    <!-- GEO Optimization: WebSite Schema -->
    <script type="application/ld+json">
      ${JSON.stringify(websiteSchema, null, 2)}
    </script>
  `;
  
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${schemaScripts}\n  </head>`);
    fs.writeFileSync(layoutPath, content, 'utf-8');
    return { success: true, changed: true };
  }
  
  return { success: false, reason: 'no </head> tag found' };
}

async function main() {
  console.log('🔧 GEO Critical Fixes — 14 Sites\n');
  
  const results = {
    canonical: { fixed: 0, skipped: 0 },
    robots: { fixed: 0, skipped: 0, created: 0 },
    schema: { added: 0, skipped: 0 }
  };
  
  for (const [dirName, config] of Object.entries(siteConfigs)) {
    const sitePath = path.join(workspace, dirName);
    
    if (!fs.existsSync(sitePath)) {
      console.log(`⚠️  ${config.domain} - directory not found`);
      continue;
    }
    
    console.log(`\n📍 ${config.domain}`);
    
    // Fix canonical URL in astro.config.mjs
    const astroResult = fixAstroConfig(sitePath, config.domain);
    if (astroResult.changed) {
      console.log(`  ✅ Fixed canonical URL → https://${config.domain}`);
      results.canonical.fixed++;
    } else if (astroResult.success) {
      console.log(`  ✓ Canonical already correct`);
      results.canonical.skipped++;
    }
    
    // Update robots.txt with AI crawler rules
    const robotsResult = updateRobotsTxt(sitePath, config.domain);
    if (robotsResult.created) {
      console.log(`  ✅ Created robots.txt with AI crawler rules`);
      results.robots.created++;
    } else if (robotsResult.changed) {
      console.log(`  ✅ Added AI crawler rules to robots.txt`);
      results.robots.fixed++;
    } else {
      console.log(`  ✓ AI crawler rules already present`);
      results.robots.skipped++;
    }
    
    // Add Organization + WebSite schema
    const schemaResult = addSchemaToLayout(sitePath, config.domain, config.name);
    if (schemaResult.changed) {
      console.log(`  ✅ Added Organization + WebSite schema`);
      results.schema.added++;
    } else if (schemaResult.success) {
      console.log(`  ✓ Schema already present`);
      results.schema.skipped++;
    }
  }
  
  console.log('\n\n📊 Summary:');
  console.log(`\n Canonical URLs:`);
  console.log(`   Fixed: ${results.canonical.fixed}`);
  console.log(`   Already OK: ${results.canonical.skipped}`);
  
  console.log(`\n robots.txt (AI Crawlers):`);
  console.log(`   Created: ${results.robots.created}`);
  console.log(`   Updated: ${results.robots.fixed}`);
  console.log(`   Already OK: ${results.robots.skipped}`);
  
  console.log(`\n Schema Markup:`);
  console.log(`   Added: ${results.schema.added}`);
  console.log(`   Already OK: ${results.schema.skipped}`);
  
  console.log('\n✅ GEO fixes complete! Ready to commit & deploy.');
}

main().catch(console.error);
