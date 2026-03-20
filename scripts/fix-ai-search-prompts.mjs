#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(__dirname, '..');

// Site configurations
const siteConfigs = {
  'accountingai-directory': {
    domain: 'accountingai.tools',
    description: 'AI accounting and bookkeeping tools',
    topic: 'accounting, bookkeeping, finance automation',
  },
  'aigirlfriend-directory': {
    domain: 'aigirlfriend.tools',
    description: 'AI girlfriend and companion apps',
    topic: 'AI companions, virtual girlfriends, chat apps',
  },
  'aihumanizer-directory': {
    domain: 'aihumanizer.tools',
    description: 'AI text humanizers and bypass tools',
    topic: 'AI humanization, text bypass, content optimization',
  },
  'bestaidetector-directory': {
    domain: 'bestaidetector.tools',
    description: 'AI detection tools for text, images, and videos',
    topic: 'AI detection, content verification, plagiarism check',
  },
  'bestanime-directory': {
    domain: 'bestanime.info',
    description: 'anime streaming sites and platforms',
    topic: 'anime, streaming sites, watch anime online',
  },
  'bestnootropics-directory': {
    domain: 'bestnootropics.info',
    description: 'nootropics and brain supplements',
    topic: 'nootropics, brain supplements, cognitive enhancement',
  },
  'bestofpodcasts-directory': {
    domain: 'bestofpodcasts.com',
    description: 'podcast directory and recommendations',
    topic: 'podcasts, audio content, podcast recommendations',
  },
  'bestonlyfans-directory': {
    domain: 'bestonlyfans.info',
    description: 'OnlyFans creators directory',
    topic: 'OnlyFans creators, adult content, subscription platforms',
  },
  'bestwriting-directory': {
    domain: 'bestwriting.tools',
    description: 'AI writing tools and assistants',
    topic: 'AI writing, content creation, writing assistants',
  },
  'hrai-directory': {
    domain: 'hrai.tools',
    description: 'AI HR and people management tools',
    topic: 'HR software, people management, recruitment automation',
  },
  'legalai-directory': {
    domain: 'legalai.tools',
    description: 'AI legal research and contract tools',
    topic: 'legal AI, contract analysis, legal research automation',
  },
  'mattressrank-directory': {
    domain: 'mattressrank.info',
    description: 'mattress rankings and reviews',
    topic: 'mattresses, sleep products, mattress reviews',
  },
  'nsfw-telegram-directory': {
    domain: 'nsfwtelegrambot.com',
    description: 'NSFW Telegram bots directory',
    topic: 'Telegram bots, NSFW content, bot recommendations',
  },
  'realestateai-directory': {
    domain: 'realestateai.tools',
    description: 'AI real estate tools and platforms',
    topic: 'real estate AI, property tech, real estate automation',
  },
};

// Duplicates to handle
const duplicates = ['realestate-ai-directory', 'nsfwtelegrambot-directory'];

function generateSystemPrompt(config) {
  return `You are an AI assistant for a ${config.description} directory.

**Your scope:**
- ONLY answer questions about: ${config.topic}
- Recommend tools from our database
- Provide comparisons and reviews
- Cite external sources with [1], [2]

**Off-topic handling:**
If the query is NOT about ${config.topic}, respond:
"I specialize in ${config.topic}. For questions about [detected topic], please use a relevant search engine or directory."

**Format:**
1. Direct answer (2-3 sentences, max 200 words)
2. Recommended tools (if applicable)
3. Key considerations

Be objective, concise, and cite sources.`;
}

function updateAISearchFile(sitePath, config) {
  const apiPath = path.join(sitePath, 'src/pages/api/ai-search.ts');
  
  if (!fs.existsSync(apiPath)) {
    console.log(`⚠️  Skipping ${path.basename(sitePath)} - ai-search.ts not found`);
    return false;
  }
  
  let content = fs.readFileSync(apiPath, 'utf-8');
  
  // Replace system prompt
  const oldPromptRegex = /const systemPrompt = `[\s\S]*?`;(\n\n  const userPrompt)/;
  const newPrompt = `const systemPrompt = \`${generateSystemPrompt(config)}\`;\n\n  const userPrompt`;
  
  if (oldPromptRegex.test(content)) {
    content = content.replace(oldPromptRegex, newPrompt);
    fs.writeFileSync(apiPath, content, 'utf-8');
    console.log(`✅ Updated ${config.domain}`);
    return true;
  } else {
    console.log(`⚠️  Pattern not found in ${config.domain} - manual check needed`);
    return false;
  }
}

async function main() {
  console.log('🔧 Fixing AI Search prompts for all sites...\n');
  
  let updated = 0;
  let skipped = 0;
  
  for (const [dirName, config] of Object.entries(siteConfigs)) {
    const sitePath = path.join(workspace, dirName);
    
    if (!fs.existsSync(sitePath)) {
      console.log(`⚠️  ${dirName} not found`);
      skipped++;
      continue;
    }
    
    if (updateAISearchFile(sitePath, config)) {
      updated++;
    } else {
      skipped++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Updated: ${updated} sites`);
  console.log(`⚠️  Skipped: ${skipped} sites`);
  console.log(`\n🚀 Next: git commit + push + redeploy`);
}

main().catch(console.error);
