#!/usr/bin/env node

/**
 * AI Search Library - Shared across all Directory Factory sites
 * DeepSeek V3 + Internal DB + Brave Search
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-ee1d86eab3a640bd95602e3c37f4ff12';
const BRAVE_API_KEY = process.env.BRAVE_API_KEY || 'BSAkXg9wOX1i5EuTwVWYQkjqe1SVjWl';

/**
 * Search internal listings database
 */
export function searchListings(query, listings) {
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
    
    keywords.forEach(keyword => {
      if (listing.name.toLowerCase().includes(keyword)) score += 5;
      if (listing.description.toLowerCase().includes(keyword)) score += 2;
      if (searchText.includes(keyword)) score += 1;
    });
    
    if (queryLower.includes('free') && listing.pricing?.model === 'free') score += 3;
    if (queryLower.includes('cheap') && listing.pricing?.startingPrice) {
      const price = parseInt(listing.pricing.startingPrice.replace(/[^0-9]/g, ''));
      if (price < 20) score += 2;
    }
    
    return { listing, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.listing);
}

/**
 * Classify query type
 */
export function classifyQuery(query) {
  const queryLower = query.toLowerCase();
  
  const patterns = {
    comparison: /(vs|versus|or|compare|difference|better)/i,
    freshness: /(latest|new|2024|2025|2026|recent|updated)/i,
    social_proof: /(review|opinion|worth|any good|recommend|experience)/i,
    how_to: /(how to|guide|tutorial|setup|use)/i,
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
  
  return { type: 'general', needsExternal: false };
}

/**
 * Search Brave API
 */
export async function searchBrave(query, count = 5) {
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
    console.error('Brave Search error:', error.message);
    return [];
  }
}

/**
 * Generate AI response with DeepSeek V3
 */
export async function generateAIResponse(query, matchedListings, externalResults = [], siteName = '') {
  const internalContext = matchedListings.length > 0
    ? matchedListings.map((tool, i) => {
        return `${i + 1}. ${tool.name}
   Description: ${tool.description}
   Pricing: ${tool.pricing?.model || 'N/A'} ${tool.pricing?.startingPrice ? `starting at ${tool.pricing.startingPrice}` : ''}
   Rating: ${tool.rating || 'N/A'}/5
   Tags: ${tool.tags?.join(', ') || 'N/A'}`;
      }).join('\n\n')
    : 'No exact matches found in our database.';
  
  const externalContext = externalResults.length > 0
    ? '\n\n## External Web Sources:\n' + externalResults.map((result, i) => {
        return `[${i + 1}] ${result.title}
   URL: ${result.url}
   Snippet: ${result.snippet}`;
      }).join('\n\n')
    : '';
  
  const systemPrompt = `You are a helpful AI assistant for ${siteName || 'a tool directory website'}.

Your job:
- Answer user questions accurately and concisely
- Recommend specific tools from our database when appropriate
- Use external sources when available for validation
- Cite sources using [1], [2] notation
- Be helpful but concise (max 200 words)
- If comparing tools, be objective
- Provide actionable recommendations

Format:
1. Direct answer (2-3 sentences)
2. Recommended tools (if applicable)
3. Additional insights from sources (if available)
4. Key considerations`;

  const userPrompt = `User Query: "${query}"

## Our Database:
${internalContext}${externalContext}

Answer concisely with [1], [2] citations for external sources.`;

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
    usage: data.usage,
    cost: (data.usage.prompt_tokens * 0.27 / 1_000_000 + data.usage.completion_tokens * 1.10 / 1_000_000)
  };
}

/**
 * Main AI Search function
 */
export async function aiSearch(query, listings, siteName = '') {
  const classification = classifyQuery(query);
  const matchedListings = searchListings(query, listings);
  
  let externalResults = [];
  if (classification.needsExternal) {
    externalResults = await searchBrave(query, 5);
  }
  
  const { answer, usage, cost } = await generateAIResponse(
    query,
    matchedListings,
    externalResults,
    siteName
  );
  
  return {
    answer,
    tools: matchedListings.slice(0, 3),
    sources: externalResults,
    classification: classification.type,
    usage,
    cost
  };
}
