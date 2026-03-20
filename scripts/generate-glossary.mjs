#!/usr/bin/env node
// Generate glossary pages for all sites

import fs from 'fs';
import path from 'path';

const DEEPSEEK_API_KEY = 'sk-ee1d86eab3a640bd95602e3c37f4ff12';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

async function generateGlossaryEntry(term, siteName) {
  const prompt = `You are an expert technical writer. Write a clear, concise glossary entry.

Term: ${term}
Context: This is for ${siteName}, a directory of tools in this category.

Requirements:
- Length: 200-400 words
- Structure: 
  1. One-sentence definition (bolded)
  2. Detailed explanation (2-3 paragraphs)
  3. Why it matters / Use cases
  4. Related terms (if applicable)
- Tone: Clear, educational, helpful
- No fluff, get straight to the point
- Include practical examples

Output ONLY the markdown content. Start with the term definition.`;

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
      max_tokens: 800
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function main() {
  const termsFile = process.argv[2];
  const workspaceDir = process.argv[3] || process.env.HOME + '/.openclaw/workspace';
  
  if (!termsFile) {
    console.log('Usage: node generate-glossary.mjs <terms.json> [workspace-dir]');
    process.exit(1);
  }

  const allTerms = JSON.parse(fs.readFileSync(termsFile, 'utf8'));
  const today = new Date().toISOString().split('T')[0];
  
  for (const [site, terms] of Object.entries(allTerms)) {
    const dirName = site.replace(/\.(tools|info|com)$/, '-directory');
    const glossaryDir = path.join(workspaceDir, dirName, 'src/content/glossary');
    
    // Create glossary directory if it doesn't exist
    if (!fs.existsSync(glossaryDir)) {
      fs.mkdirSync(glossaryDir, { recursive: true });
      console.log(`📁 Created: ${glossaryDir}`);
    }
    
    console.log(`\n📚 Generating glossary for ${site}...`);
    
    for (const term of terms) {
      const slug = term.toLowerCase()
        .replace(/^what is /, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      console.log(`  📝 ${term}...`);
      
      const content = await generateGlossaryEntry(term, site);
      
      const frontmatter = `---
title: "${term}"
description: "Learn what ${term.replace('What is ', '').toLowerCase()} means and how it's used in ${site.split('.')[0]}."
pubDate: ${today}
---

`;
      
      const fullContent = frontmatter + `# ${term}\n\n` + content;
      const filepath = path.join(glossaryDir, `${slug}.md`);
      
      fs.writeFileSync(filepath, fullContent);
      console.log(`  ✅ Saved: ${slug}.md (${content.split(/\s+/).length} words)`);
      
      // Rate limit - 1 request per 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log(`✅ ${site}: ${terms.length} glossary entries created`);
  }
  
  console.log('\n🎉 All glossary pages generated!');
  console.log('\n📋 Next steps:');
  console.log('   1. Review content quality');
  console.log('   2. Add glossary pages to site navigation');
  console.log('   3. Git commit and push');
}

main().catch(console.error);
