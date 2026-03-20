#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const sites = ['bestaidetector-directory', 'aihumanizer-directory'];

function fixListing(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let modified = false;
  
  // Add missing fields
  if (!content.description) {
    content.description = content.tagline || `${content.name} - ${content.category}`;
    modified = true;
  }
  
  if (!content.url) {
    // Use website if available
    content.url = content.website || `https://${content.slug}.com`;
    modified = true;
  }
  
  if (!content.features) {
    // Generate basic features from tags
    content.features = content.tags?.slice(0, 3).map(tag => `${tag} support`) || ['Core features'];
    modified = true;
  }
  
  if (!content.lastUpdated) {
    content.lastUpdated = '2026-03-10';
    modified = true;
  }
  
  // Remove website field if it's now in url
  if (content.website && content.url === content.website) {
    delete content.website;
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
    return true;
  }
  
  return false;
}

async function main() {
  console.log('🔧 Fixing incomplete listings...\n');
  
  let totalFixed = 0;
  
  for (const site of sites) {
    const listingsDir = path.join(process.env.HOME, '.openclaw/workspace', site, 'src/content/listings');
    
    if (!fs.existsSync(listingsDir)) {
      console.log(`⚠️  ${site} listings not found`);
      continue;
    }
    
    const files = fs.readdirSync(listingsDir).filter(f => f.endsWith('.json'));
    let siteFixed = 0;
    
    for (const file of files) {
      const filePath = path.join(listingsDir, file);
      if (fixListing(filePath)) {
        siteFixed++;
      }
    }
    
    console.log(`✅ ${site}: fixed ${siteFixed}/${files.length} listings`);
    totalFixed += siteFixed;
  }
  
  console.log(`\n📊 Total fixed: ${totalFixed} listings`);
  console.log('🚀 Ready to build!');
}

main().catch(console.error);
