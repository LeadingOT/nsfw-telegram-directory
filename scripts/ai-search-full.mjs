#!/usr/bin/env node

/**
 * AI Search - Full Implementation
 * Phase 2: DeepSeek V3 + Internal DB + Brave Search
 */

import fs from 'fs';
import path from 'path';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-ee1d86eab3a640bd95602e3c37f4ff12';
const BRAVE_API_KEY = process.env.BRAVE_API_KEY || 'BSAkXg9wOX1i5EuTwVWYQkjqe1SVjWl';

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
 * Classify query to determine if external search is needed
 */
function classifyQuery(query) {
  const queryLower = query.toLowerCase();
  
  const patterns = {
    // Needs external search
    comparison: /(vs|versus|or|compare|difference|better)/i,
    freshness: /(latest|new|2024|2025|2026|recent|updated)/i,
    social_proof: /(review|opinion|worth|any good|recommend|experience)/i,
    how_to: /(how to|guide|tutorial|setup|use)/i,
    
    // Internal only
    simple_listing: /^(best|top|find|show me)\s+/i,
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(queryLower)) {
      return {
        type,
        needsExternal: !['simple_listing'].includes(type)
      };
    }
  }
  
  // Default: use internal only for simple queries
  return { type: 'general', needsExternal: false };
}

/**
 * Search Brave for external web results
 */
async function searchBrave(query, count = 5) {
  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', count);
  url.searchParams.set('text_decorations', 'false');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`);
    }
    
    const data = await response.json();
    const results = data.web?.results || [];
    
    return results.map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.description || '',
      age: r.age || null
    }));
  } catch (error) {
    console.error('❌ Brave Search error:', error.message);
    return [];
  }
}

/**
 * Generate AI response using DeepSeek V3
 */
async function generateAIResponse(query, matchedListings, externalResults = []) {
  // Build context from internal DB
  const internalContext = matchedListings.length > 0
    ? matchedListings.map((tool, i) => {
        return `${i + 1}. ${tool.name}
   Description: ${tool.description}
   Pricing: ${tool.pricing?.model || 'N/A'} ${tool.pricing?.startingPrice ? `starting at ${tool.pricing.startingPrice}` : ''}
   Rating: ${tool.rating || 'N/A'}/5
   Tags: ${tool.tags?.join(', ') || 'N/A'}`;
      }).join('\n\n')
    : 'No exact matches found in our database.';
  
  // Build context from external sources
  const externalContext = externalResults.length > 0
    ? '\n\n## External Web Sources:\n' + externalResults.map((result, i) => {
        return `[${i + 1}] ${result.title}
   URL: ${result.url}
   Snippet: ${result.snippet}`;
      }).join('\n\n')
    : '';
  
  const systemPrompt = `You are a helpful AI assistant for an AI girlfriend tool directory website.

Your job:
- Answer user questions about AI girlfriend/companion tools accurately
- Recommend specific tools from our database when appropriate
- Use external sources when available for validation and additional context
- Cite sources using [1], [2] notation for external links
- Be concise but helpful (max 200 words)
- If comparing tools, be objective and mention trade-offs
- If external sources contradict our data, mention both perspectives

Format your response:
1. Direct answer (2-3 sentences)
2. Recommended tools from our database (if applicable)
3. Additional insights from external sources (if available)
4. Key considerations`;

  const userPrompt = `User Query: "${query}"

## Our Database:
${internalContext}${externalContext}

Please answer the user's question. Use [1], [2] for external source citations.`;

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
      max_tokens: 600
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
  
  // 1. Classify query
  const classification = classifyQuery(query);
  console.log(`📊 Query type: ${classification.type} (${classification.needsExternal ? 'needs external search' : 'internal only'})\n`);
  
  // 2. Load listings
  const listings = loadListings(siteDir);
  
  if (listings.length === 0) {
    console.error('❌ No listings found');
    return;
  }
  
  // 3. Search internal DB
  console.log('🔎 Searching internal database...');
  const matchedListings = searchListings(query, listings);
  console.log(`✅ Found ${matchedListings.length} matching tools\n`);
  
  // 4. Search external sources if needed
  let externalResults = [];
  if (classification.needsExternal) {
    console.log('🌐 Searching web via Brave Search API...');
    externalResults = await searchBrave(query, 5);
    console.log(`✅ Found ${externalResults.length} external sources\n`);
  } else {
    console.log('⏩ Skipping external search (not needed for this query)\n');
  }
  
  // 5. Generate AI response with DeepSeek
  console.log('🤖 Generating AI response with DeepSeek V3...\n');
  const startTime = Date.now();
  
  try {
    const { answer, usage } = await generateAIResponse(query, matchedListings, externalResults);
    const responseTime = Date.now() - startTime;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 AI ANSWER:\n');
    console.log(answer);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (matchedListings.length > 0) {
      console.log('\n✨ RECOMMENDED TOOLS (from our database):\n');
      matchedListings.slice(0, 3).forEach((tool, i) => {
        console.log(`${i + 1}. ${tool.name}`);
        console.log(`   ${tool.pricing?.model || 'N/A'}${tool.pricing?.startingPrice ? ` • ${tool.pricing.startingPrice}` : ''} • ${tool.rating || 'N/A'}⭐`);
        console.log(`   ${tool.description.substring(0, 80)}...`);
        console.log();
      });
    }
    
    if (externalResults.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📚 EXTERNAL SOURCES:\n');
      externalResults.forEach((source, i) => {
        console.log(`[${i + 1}] ${source.title}`);
        console.log(`    ${source.url}`);
        console.log();
      });
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 STATS:\n');
    console.log(`Query type: ${classification.type}`);
    console.log(`Internal matches: ${matchedListings.length}`);
    console.log(`External sources: ${externalResults.length}`);
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
  "best free AI girlfriend",                          // simple_listing (internal only)
  "replika vs candy ai which is better",              // comparison (needs external)
  "what do people think about character.ai",          // social_proof (needs external)
  "latest AI girlfriend apps in 2024",                // freshness (needs external)
  "AI companion with voice chat"                      // general (internal only)
];

// Run test
const query = process.argv[2] || testQueries[0];
aiSearch(query, SITE_DIR);
