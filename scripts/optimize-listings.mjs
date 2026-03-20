#!/usr/bin/env node
// Optimize existing listings - add detailed descriptions, use cases, etc.

import fs from 'fs';
import path from 'path';

const DEEPSEEK_API_KEY = 'sk-ee1d86eab3a640bd95602e3c37f4ff12';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

async function enhanceListing(listing) {
  // Skip if description is already long enough
  if (listing.description && listing.description.length > 400) {
    return null; // No changes needed
  }

  const prompt = `You are optimizing a tool listing. Enhance the description to be more detailed and compelling.

Tool: ${listing.name}
Current description: ${listing.description || 'No description'}
Category: ${listing.category || ''}
Pricing: ${listing.pricing?.model || 'Not specified'}

Requirements:
- Length: 150-250 words (not too long)
- Include: What it does, key features, who it's for, main benefit
- Tone: Helpful, direct, specific (not marketing fluff)
- Mention 2-3 standout features
- Add a clear use case
- DO NOT use phrases like "game-changer", "revolutionary", "cutting-edge"
- Be factual and practical

Output ONLY the enhanced description text (no formatting, no quotes).`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 400
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function main() {
  const workspaceDir = process.env.HOME + '/.openclaw/workspace';
  const maxListingsPerSite = 10; // Optimize top 10 per site
  
  const sites = [
    'accountingai-directory',
    'aigirlfriend-directory',
    'bestanime-directory',
    'bestnootropics-directory',
    'bestofpodcasts-directory',
    'bestonlyfans-directory',
    'bestwriting-directory',
    'hrai-directory',
    'legalai-directory',
    'mattressrank-directory',
    'nsfw-telegram-directory',
    'realestate-ai-directory'
  ];

  let totalOptimized = 0;

  for (const site of sites) {
    const listingsDir = path.join(workspaceDir, site, 'src/content/listings');
    
    if (!fs.existsSync(listingsDir)) {
      console.log(`⏩ Skipping ${site} - no listings directory`);
      continue;
    }

    const listingFiles = fs.readdirSync(listingsDir)
      .filter(f => f.endsWith('.json'))
      .slice(0, maxListingsPerSite); // Only top N listings

    console.log(`\n🔧 Optimizing ${site}...`);
    let siteOptimized = 0;

    for (const file of listingFiles) {
      const filepath = path.join(listingsDir, file);
      const listing = JSON.parse(fs.readFileSync(filepath, 'utf8'));

      // Check if needs optimization
      if (!listing.description || listing.description.length < 400) {
        console.log(`  📝 ${listing.name}...`);
        
        const enhancedDesc = await enhanceListing(listing);
        
        if (enhancedDesc) {
          listing.description = enhancedDesc;
          fs.writeFileSync(filepath, JSON.stringify(listing, null, 2));
          console.log(`  ✅ Enhanced (${listing.description.length} chars)`);
          siteOptimized++;
          
          // Rate limit
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } else {
        console.log(`  ⏩ ${listing.name} - already detailed`);
      }
    }

    console.log(`✅ ${site}: ${siteOptimized}/${listingFiles.length} listings enhanced`);
    totalOptimized += siteOptimized;
  }

  console.log(`\n🎉 Total optimized: ${totalOptimized} listings`);
  console.log('\n📋 Next steps:');
  console.log('   1. Review changes in each directory');
  console.log('   2. Git commit and push all sites');
}

main().catch(console.error);
