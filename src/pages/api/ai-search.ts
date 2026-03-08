import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

const DEEPSEEK_API_KEY = 'sk-ee1d86eab3a640bd95602e3c37f4ff12';
const BRAVE_API_KEY = 'BSAkXg9wOX1i5EuTwVWYQkjqe1SVjWl';

// Load listings
function loadListings() {
  const listingsDir = path.join(process.cwd(), 'src/content/listings');
  const files = fs.readdirSync(listingsDir).filter(f => f.endsWith('.json'));
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(listingsDir, file), 'utf-8');
    return JSON.parse(content);
  });
}

function searchListings(query: string, listings: any[]) {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = listings.map(listing => {
    let score = 0;
    const searchText = `${listing.name} ${listing.description} ${listing.category || ''} ${listing.tags?.join(' ') || ''} ${listing.pricing?.model || ''}`.toLowerCase();
    
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

function classifyQuery(query: string) {
  const queryLower = query.toLowerCase();
  
  if (/(vs|versus|or|compare|difference|better)/i.test(queryLower)) return { type: 'comparison', needsExternal: true };
  if (/(latest|new|2024|2025|2026|recent|updated)/i.test(queryLower)) return { type: 'freshness', needsExternal: true };
  if (/(review|opinion|worth|any good|recommend)/i.test(queryLower)) return { type: 'social_proof', needsExternal: true };
  if (/^(best|top|find|show me)\s+/i.test(queryLower)) return { type: 'simple_listing', needsExternal: false };
  
  return { type: 'general', needsExternal: false };
}

async function searchBrave(query: string, count = 5) {
  try {
    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(count));
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const results = data.web?.results || [];
    
    return results.map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.description || ''
    }));
  } catch (error) {
    console.error('Brave error:', error);
    return [];
  }
}

async function generateAIResponse(query: string, matchedListings: any[], externalResults: any[]) {
  const internalContext = matchedListings.length > 0
    ? matchedListings.map((tool, i) => `${i + 1}. ${tool.name}\n   ${tool.description}\n   Pricing: ${tool.pricing?.model || 'N/A'} ${tool.pricing?.startingPrice || ''}\n   Rating: ${tool.rating || 'N/A'}/5`).join('\n\n')
    : 'No matches found.';
  
  const externalContext = externalResults.length > 0
    ? '\n\n## External Sources:\n' + externalResults.map((r, i) => `[${i + 1}] ${r.title}\n   ${r.url}\n   ${r.snippet}`).join('\n\n')
    : '';
  
  const systemPrompt = `You are an AI assistant for an AI girlfriend/companion tools directory.

Answer questions concisely (max 200 words). Recommend specific tools. Cite external sources with [1], [2]. Be objective in comparisons.

Format:
1. Direct answer (2-3 sentences)
2. Recommended tools (if applicable)
3. Key considerations`;

  const userPrompt = `User Query: "${query}"\n\n## Our Database:\n${internalContext}${externalContext}\n\nAnswer with citations for external sources.`;

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
    throw new Error(`DeepSeek error: ${response.status}`);
  }
  
  const data = await response.json();
  return {
    answer: data.choices[0].message.content,
    usage: data.usage
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid query' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const listings = loadListings();
    const classification = classifyQuery(query);
    const matchedListings = searchListings(query, listings);
    
    let externalResults: any[] = [];
    if (classification.needsExternal) {
      externalResults = await searchBrave(query, 5);
    }
    
    const { answer, usage } = await generateAIResponse(query, matchedListings, externalResults);
    
    return new Response(JSON.stringify({
      answer,
      tools: matchedListings.slice(0, 3),
      sources: externalResults,
      classification: classification.type,
      usage
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('AI Search error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
