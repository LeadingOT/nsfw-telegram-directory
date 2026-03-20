#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const workspace = process.env.HOME + '/.openclaw/workspace';

// Sites missing llms.txt
const sitesConfig = {
  'bestanime-directory': {
    domain: 'bestanime.info',
    name: 'Best Anime',
    description: 'Comprehensive directory of anime streaming sites and platforms',
    categories: [
      'Action Anime: High-energy action-packed series',
      'Romance Anime: Love stories and romantic comedies',
      'Isekai Anime: Fantasy worlds and reincarnation',
      'Slice of Life: Everyday stories and drama',
      'Horror Anime: Psychological and supernatural horror'
    ],
    guides: [
      'Best Free Anime Streaming Sites',
      'Best Anime for Beginners',
      'Top Rated Anime Series 2026'
    ],
    toolCount: 20
  },
  'bestofpodcasts-directory': {
    domain: 'bestofpodcasts.com',
    name: 'Best of Podcasts',
    description: 'Directory of top podcasts across all categories',
    categories: [
      'True Crime: Crime investigations and mysteries',
      'Business: Entrepreneurship and startups',
      'Comedy: Stand-up and comedy shows',
      'Technology: Tech news and programming',
      'Health & Fitness: Wellness and nutrition'
    ],
    guides: [
      'Best True Crime Podcasts',
      'Best Business Podcasts for Entrepreneurs',
      'Top Comedy Podcasts 2026'
    ],
    toolCount: 25
  },
  'bestonlyfans-directory': {
    domain: 'bestonlyfans.info',
    name: 'Best OnlyFans',
    description: 'Directory of top OnlyFans creators and models',
    categories: [
      'Fitness Models: Workout and nutrition content',
      'Cosplay Creators: Anime and gaming cosplay',
      'Lifestyle Creators: Daily life and vlogs',
      'Adult Content: 18+ exclusive content',
      'Amateur Creators: Independent creators'
    ],
    guides: [
      'Best Free OnlyFans Accounts',
      'Top OnlyFans Models by Category',
      'How to Find OnlyFans Creators'
    ],
    toolCount: 30
  },
  'bestwriting-directory': {
    domain: 'bestwriting.tools',
    name: 'Best Writing Tools',
    description: 'AI writing tools, grammar checkers, and content creation platforms',
    categories: [
      'AI Writing Assistants: GPT-powered content generation',
      'Grammar Checkers: Proofreading and editing',
      'SEO Writing: Content optimization tools',
      'Copywriting: Sales and marketing copy',
      'Creative Writing: Fiction and storytelling'
    ],
    guides: [
      'Best Free AI Writing Tools',
      'Best Grammar Checkers 2026',
      'Top SEO Content Optimization Tools'
    ],
    toolCount: 20
  },
  'mattressrank-directory': {
    domain: 'mattressrank.info',
    name: 'Mattress Rank',
    description: 'Mattress reviews, rankings, and buying guides',
    categories: [
      'Memory Foam: Pressure relief mattresses',
      'Hybrid Mattresses: Spring and foam combination',
      'Innerspring: Traditional coil mattresses',
      'Latex Mattresses: Natural and eco-friendly',
      'Budget Mattresses: Affordable options under $500'
    ],
    guides: [
      'Best Mattresses for Back Pain',
      'Best Budget Mattresses 2026',
      'Best Cooling Mattresses for Hot Sleepers'
    ],
    toolCount: 12
  }
};

function generateLlmsTxt(config) {
  const { domain, name, description, categories, guides, toolCount } = config;
  
  let content = `# ${name}\n\n`;
  content += `> ${description}\n\n`;
  
  content += `## Categories\n\n`;
  categories.forEach(cat => {
    content += `- [${cat.split(':')[0]}](/category/${cat.split(':')[0].toLowerCase().replace(/\s+/g, '-')}): ${cat.split(':')[1].trim()}\n`;
  });
  
  content += `\n## Comparison Guides\n\n`;
  guides.forEach(guide => {
    const slug = guide.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    content += `- [${guide}](/best/${slug})\n`;
  });
  
  content += `\n## Key Facts\n\n`;
  content += `- ${toolCount} tools reviewed and compared\n`;
  content += `- ${categories.length} categories covering all types\n`;
  content += `- ${guides.length} in-depth comparison guides\n`;
  content += `- Updated March 2026\n`;
  content += `- Independent reviews — not sponsored\n\n`;
  
  content += `## Sitemap\n\n`;
  content += `- [Sitemap](https://#{domain}/sitemap-index.xml)\n`;
  
  return content;
}

async function main() {
  console.log('📝 Generating llms.txt for 5 missing sites...\n');
  
  let generated = 0;
  
  for (const [dirName, config] of Object.entries(sitesConfig)) {
    const sitePath = path.join(workspace, dirName);
    const llmsPath = path.join(sitePath, 'public/llms.txt');
    
    if (!fs.existsSync(sitePath)) {
      console.log(`⚠️  ${config.domain} - directory not found`);
      continue;
    }
    
    // Create public directory if missing
    const publicDir = path.join(sitePath, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const content = generateLlmsTxt(config);
    fs.writeFileSync(llmsPath, content, 'utf-8');
    
    console.log(`✅ ${config.domain} - llms.txt created (${content.length} bytes)`);
    generated++;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Generated: ${generated} llms.txt files`);
  console.log(`\n🚀 Next: commit & deploy`);
}

main().catch(console.error);
