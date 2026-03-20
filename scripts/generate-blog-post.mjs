#!/usr/bin/env node
// Generate SEO blog post using DeepSeek V3

import fs from 'fs';

const DEEPSEEK_API_KEY = 'sk-ee1d86eab3a640bd95602e3c37f4ff12';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

async function generateBlog(topic) {
  const prompt = `You are an expert SEO content writer. Write a comprehensive, engaging blog post.

Title: ${topic.title}
Description: ${topic.description}
Keywords: ${topic.keywords.join(', ')}

Requirements:
- Length: 1,500-2,000 words
- Structure: Intro → 4-5 H2 sections → FAQ (5 questions) → Conclusion
- Tone: Conversational, helpful, direct (not corporate)
- SEO: Keywords in first 100 words, H2s, naturally throughout
- Include specific examples and tools
- Add actionable advice
- Write in markdown format

Output ONLY the markdown content (no frontmatter, I'll add that). Start with # ${topic.title}`;

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function main() {
  const topicsFile = process.argv[2];
  const outputDir = process.argv[3];
  
  if (!topicsFile || !outputDir) {
    console.log('Usage: node generate-blog-post.mjs <topics.json> <output-dir>');
    process.exit(1);
  }

  const topics = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));
  
  for (const blog of topics.blogs) {
    console.log(`\n📝 Generating: ${blog.title}...`);
    
    const content = await generateBlog(blog);
    const today = new Date().toISOString().split('T')[0];
    
    const frontmatter = `---
title: "${blog.title}"
description: "${blog.description}"
pubDate: ${today}
author: "Directory Factory"
tags: ${JSON.stringify(blog.keywords)}
---

`;

    const fullContent = frontmatter + content;
    const filepath = `${outputDir}/${blog.slug}.md`;
    
    fs.writeFileSync(filepath, fullContent);
    console.log(`✅ Saved: ${filepath}`);
    console.log(`   Words: ${content.split(/\s+/).length}`);
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 All blogs generated!');
}

main().catch(console.error);
