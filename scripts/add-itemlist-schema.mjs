#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const workspace = process.env.HOME + '/.openclaw/workspace';

// All 14 sites need ItemList schema on homepage
const siteConfigs = {
  'accountingai-directory': { domain: 'accountingai.tools', name: 'Best AI Accounting Tools', itemCount: 17 },
  'aigirlfriend-directory': { domain: 'aigirlfriend.tools', name: 'Best AI Girlfriend Apps', itemCount: 28 },
  'aihumanizer-directory': { domain: 'aihumanizer.tools', name: 'Best AI Humanizer Tools', itemCount: 18 },
  'bestaidetector-directory': { domain: 'bestaidetector.tools', name: 'Best AI Detector Tools', itemCount: 18 },
  'bestanime-directory': { domain: 'bestanime.info', name: 'Best Anime Streaming Sites', itemCount: 20 },
  'bestnootropics-directory': { domain: 'bestnootropics.info', name: 'Best Nootropics', itemCount: 28 },
  'bestofpodcasts-directory': { domain: 'bestofpodcasts.com', name: 'Best Podcasts', itemCount: 25 },
  'bestonlyfans-directory': { domain: 'bestonlyfans.info', name: 'Best OnlyFans Creators', itemCount: 30 },
  'bestwriting-directory': { domain: 'bestwriting.tools', name: 'Best Writing Tools', itemCount: 20 },
  'hrai-directory': { domain: 'hrai.tools', name: 'Best AI HR Tools', itemCount: 27 },
  'legalai-directory': { domain: 'legalai.tools', name: 'Best AI Legal Tools', itemCount: 31 },
  'mattressrank-directory': { domain: 'mattressrank.info', name: 'Best Mattresses', itemCount: 12 },
  'nsfw-telegram-directory': { domain: 'nsfwtelegrambot.com', name: 'NSFW Telegram Channels', itemCount: 20 },
  'realestateai-directory': { domain: 'realestateai.tools', name: 'Best AI Real Estate Tools', itemCount: 27 }
};

// Sites still needing Organization schema
const needsOrgSchema = [
  'accountingai-directory',
  'aigirlfriend-directory',
  'aihumanizer-directory',
  'bestaidetector-directory',
  'hrai-directory',
  'legalai-directory',
  'realestateai-directory',
  'nsfw-telegram-directory'
];

function addItemListToIndex(sitePath, config) {
  const indexPath = path.join(sitePath, 'src/pages/index.astro');
  
  if (!fs.existsSync(indexPath)) {
    return { success: false, reason: 'index.astro not found' };
  }
  
  let content = fs.readFileSync(indexPath, 'utf-8');
  
  // Check if ItemList schema already exists
  if (content.includes('"@type": "ItemList"') || content.includes("'@type': 'ItemList'")) {
    return { success: true, changed: false };
  }
  
  // Generate ItemList schema
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${config.name} 2026`,
    description: `Compare and review the top ${config.itemCount} tools in this category`,
    numberOfItems: config.itemCount,
    url: `https://${config.domain}`
  };
  
  // Find where to insert (in frontmatter after other imports/declarations)
  const schemaDeclaration = `\nconst itemListSchema = ${JSON.stringify(itemListSchema, null, 2)};\n`;
  
  // Insert before the closing ---
  if (content.includes('---')) {
    const parts = content.split('---');
    if (parts.length >= 3) {
      // Insert before the second ---
      parts[1] += schemaDeclaration;
      content = parts.join('---');
    }
  }
  
  // Also add to BaseLayout schema prop
  content = content.replace(
    /<BaseLayout([^>]*)schema={schema}/,
    '<BaseLayout$1schema={itemListSchema}'
  );
  
  // If no schema prop exists, add it
  if (!content.includes('schema=')) {
    content = content.replace(
      /<BaseLayout\s+title=/,
      '<BaseLayout\n  schema={itemListSchema}\n  title='
    );
  }
  
  fs.writeFileSync(indexPath, content, 'utf-8');
  return { success: true, changed: true };
}

function addOrgSchemaToLayout(sitePath, config) {
  const layoutPath = path.join(sitePath, 'src/layouts/BaseLayout.astro');
  
  if (!fs.existsSync(layoutPath)) {
    return { success: false, reason: 'layout not found' };
  }
  
  let content = fs.readFileSync(layoutPath, 'utf-8');
  
  // Check if already has Organization schema
  if (content.includes('"@type": "Organization"') || content.includes("'@type': 'Organization'")) {
    return { success: true, changed: false };
  }
  
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: `https://${config.domain}`,
    logo: `https://${config.domain}/logo.png`,
    description: `Comprehensive directory and reviews of the best tools on ${config.domain}`,
    sameAs: []
  };
  
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: `https://${config.domain}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://${config.domain}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
  
  const schemaScripts = `
    <!-- GEO: Organization Schema -->
    <script type="application/ld+json">
      ${JSON.stringify(orgSchema, null, 2)}
    </script>
    
    <!-- GEO: WebSite Schema -->
    <script type="application/ld+json">
      ${JSON.stringify(websiteSchema, null, 2)}
    </script>
  `;
  
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${schemaScripts}\n  </head>`);
    fs.writeFileSync(layoutPath, content, 'utf-8');
    return { success: true, changed: true };
  }
  
  return { success: false, reason: 'no </head> found' };
}

async function main() {
  console.log('📊 Adding ItemList + Organization schemas to all sites...\n');
  
  const results = {
    itemList: { added: 0, skipped: 0 },
    orgSchema: { added: 0, skipped: 0 }
  };
  
  for (const [dirName, config] of Object.entries(siteConfigs)) {
    const sitePath = path.join(workspace, dirName);
    
    if (!fs.existsSync(sitePath)) {
      console.log(`⚠️  ${config.domain} - not found`);
      continue;
    }
    
    console.log(`\n📍 ${config.domain}`);
    
    // Add ItemList to homepage
    const itemListResult = addItemListToIndex(sitePath, config);
    if (itemListResult.changed) {
      console.log(`  ✅ Added ItemList schema (${config.itemCount} items)`);
      results.itemList.added++;
    } else if (itemListResult.success) {
      console.log(`  ✓ ItemList already present`);
      results.itemList.skipped++;
    } else {
      console.log(`  ⚠️  ItemList failed: ${itemListResult.reason}`);
    }
    
    // Add Organization schema if needed
    if (needsOrgSchema.includes(dirName)) {
      const orgResult = addOrgSchemaToLayout(sitePath, config);
      if (orgResult.changed) {
        console.log(`  ✅ Added Organization + WebSite schema`);
        results.orgSchema.added++;
      } else if (orgResult.success) {
        console.log(`  ✓ Organization schema already present`);
        results.orgSchema.skipped++;
      }
    }
  }
  
  console.log(`\n\n📊 Summary:`);
  console.log(`\n ItemList Schema:`);
  console.log(`   Added: ${results.itemList.added}`);
  console.log(`   Already OK: ${results.itemList.skipped}`);
  
  console.log(`\n Organization Schema:`);
  console.log(`   Added: ${results.orgSchema.added}`);
  console.log(`   Already OK: ${results.orgSchema.skipped}`);
  
  console.log('\n✅ Schema optimization complete!');
}

main().catch(console.error);
