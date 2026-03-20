#!/usr/bin/env node

/**
 * AI Search Test - DeepSeek V3 + Internal DB
 * Phase 1: No external search (waiting for Brave API)
 */

import fs from 'fs';
import path from 'path';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-ee1d86eab3a640bd95602e3c37f4ff12';

// Test with aigirlfriend.tools data
const SITE_DIR = '/home/bill/.openclaw/workspace/aigirlfriend-directory';

/**
 * Load all listings from a directory site
 */
function loadListings(siteDir) {
  const listingsDir = path.join(siteDir, 'src/content/listings');
  
  if (!fs.existsSync(listingsDir)) {
    console.error(`❌ Listings directory not found: ${listingsDir}`);
    return [];
  }
  
  const files = fs.readdirSync(listingsDir).filter(f => f.endsWith('.json'));
  
  const listings = files.map(file => {
    const content = fs.readFileSync(path.join(listingsDir, file), 'utf-8');
    return JSON.parse(content);
  });
  
  console.log(`✅ Loaded ${listings.length} listings from ${siteDir}`);
  return listings;
}

/**
 * Simple semantic search using keyword matching
 * (Later: replace with embeddings for true semantic search)
 */
function searchListings(query, listings) {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = listings.map(listing => {
    let score = 0;
    const searchText = `
      ${listing.name} 
      ${listing.description} 
      ${listing.category || ''} 
      ${listing.tags?.join(' ') || ''}
      ${listing.pricing?.model || ''}
    `.toLowerCase();
    
    // Score based on keyword matches
    keywords.forEach(keyword => {
      if (listing.name.toLowerCase().includes(keyword)) score += 5;
      if (listing.description.toLowerCase().includes(keyword)) score += 2;
      if (searchText.includes(keyword)) score += 1;
    });
    
    // Boost if pricing matches query intent
    if (queryLower.includes('free') && listing.pricing?.model === 'free') score += 3;
    if (queryLower.includes('cheap') && listing.pricing?.startingPrice) {
      const price = parseInt(listing.pricing.startingPrice.replace(/[^0-9]/g, ''));
      if (price < 20) score += 2;
    }
    
    return { listing, score };
  });
  
  // Return top 5 matches
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.listing);
}

/**
 * Generate AI response using DeepSeek V3
 */
async function generateAIResponse(query, matchedListings) {
  const context = matchedListings.map((tool, i) => {
    return `${i + 1}. ${tool.name}
   Description: ${tool.description}
   Pricing: ${tool.pricing?.model || 'N/A'} ${tool.pricing?.startingPrice ? `starting at ${tool.pricing.startingPrice}` : ''}
   Rating: ${tool.rating || 'N/A'}/5
   Tags: ${tool.tags?.join(', ') || 'N/A'}`;
  }).join('\n\n');
  
  const systemPrompt = `You are a helpful AI assistant for an AI girlfriend tool directory website.

Your job:
- Answer user questions about AI girlfriend/companion tools accurately
- Recommend specific tools from our database when appropriate
- Be concise but helpful (max 150 words)
- If a tool is clearly better, say so
- Mention pricing if relevant to the query

Format your response:
1. Direct answer (2-3 sentences)
2. Recommended tools (if applicable)
3. Key considerations (if helpful)`;

  const userPrompt = `User Query: "${query}"

Available Tools in Our Database:
${context}

Please answer the user's question based on these tools.`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 500
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  return {
    answer: data.choices[0].message.content,
    usage: data.usage
  };
}

/**
 * Main AI Search function
 */
async function aiSearch(query, siteDir) {
  console.log(`\n🔍 Query: "${query}"\n`);
  
  // 1. Load listings
  const listings = loadListings(siteDir);
  
  if (listings.length === 0) {
    console.error('❌ No listings found');
    return;
  }
  
  // 2. Search internal DB
  console.log('🔎 Searching internal database...');
  const matchedListings = searchListings(query, listings);
  console.log(`✅ Found ${matchedListings.length} matching tools\n`);
  
  if (matchedListings.length === 0) {
    console.log('❌ No matching tools found for this query');
    return;
  }
  
  // 3. Generate AI response with DeepSeek
  console.log('🤖 Generating AI response with DeepSeek V3...\n');
  const startTime = Date.now();
  
  try {
    const { answer, usage } = await generateAIResponse(query, matchedListings);
    const responseTime = Date.now() - startTime;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 AI ANSWER:\n');
    console.log(answer);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ RECOMMENDED TOOLS:\n');
    
    matchedListings.slice(0, 3).forEach((tool, i) => {
      console.log(`${i + 1}. ${tool.name}`);
      console.log(`   ${tool.pricing?.model || 'N/A'}${tool.pricing?.startingPrice ? ` • ${tool.pricing.startingPrice}` : ''} • ${tool.rating || 'N/A'}⭐`);
      console.log(`   ${tool.description.substring(0, 80)}...`);
      console.log();
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 STATS:\n');
    console.log(`Response time: ${responseTime}ms`);
    console.log(`Tokens used: ${usage.total_tokens} (${usage.prompt_tokens} in + ${usage.completion_tokens} out)`);
    console.log(`Estimated cost: $${(usage.prompt_tokens * 0.27 / 1_000_000 + usage.completion_tokens * 1.10 / 1_000_000).toFixed(6)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error generating AI response:', error.message);
  }
}

// Test queries
const testQueries = [
  "best free AI girlfriend",
  "AI companion for emotional support",
  "replika vs candy ai which is better",
  "AI girlfriend with voice chat",
  "cheapest AI girlfriend under $10"
];

// Run test
const query = process.argv[2] || testQueries[0];
aiSearch(query, SITE_DIR);
