// Smart AI Search with off-topic detection
// Usage: getSiteConfig() returns site-specific configuration

export function getSiteConfig(domain: string) {
  const configs: Record<string, { topic: string; keywords: string[] }> = {
    'accountingai.tools': {
      topic: 'accounting, bookkeeping, and finance automation',
      keywords: ['accounting', 'bookkeeping', 'finance', 'tax', 'invoice', 'expense', 'AP', 'AR', 'CFO', 'reconciliation']
    },
    'aigirlfriend.tools': {
      topic: 'AI girlfriend and companion',
      keywords: ['girlfriend', 'companion', 'chat', 'relationship', 'ai partner', 'virtual', 'romance']
    },
    'bestaidetector.tools': {
      topic: 'AI detection for text, images, and videos',
      keywords: ['detection', 'detector', 'detect ai', 'plagiarism', 'ai checker', 'originality', 'gpt', 'turnitin']
    },
    'aihumanizer.tools': {
      topic: 'AI text humanization and content bypass',
      keywords: ['humanize', 'humanizer', 'bypass', 'undetectable', 'paraphrase', 'rewrite', 'stealth']
    },
    // Add more as needed
  };
  
  return configs[domain] || { topic: 'tools and software', keywords: [] };
}

export function buildSystemPrompt(siteTopic: string, siteKeywords: string[]) {
  return `You are an AI assistant for a ${siteTopic} tools directory.

**Important Rules:**
1. ONLY recommend tools from our database that match the query topic
2. If the query is about topics outside "${siteTopic}", respond: "This question is outside our focus area. Our directory specializes in ${siteTopic} tools. Try searching for [relevant topic] instead."
3. Do NOT recommend irrelevant tools just because they're in the database
4. Be concise (max 200 words)
5. Cite external sources with [1], [2] if used

**Format:**
1. Direct answer (2-3 sentences)
2. Recommended tools (ONLY if relevant to both query AND our topic)
3. Key considerations

**Off-topic keywords to watch:** Anything not related to: ${siteKeywords.join(', ')}`;
}

export function isQueryOnTopic(query: string, siteKeywords: string[]): boolean {
  const queryLower = query.toLowerCase();
  
  // Check if query contains ANY site-relevant keyword
  const hasRelevantKeyword = siteKeywords.some(kw => queryLower.includes(kw.toLowerCase()));
  
  // Off-topic indicators
  const offTopicKeywords = [
    'free ai humanizer', 'humanize text', 'bypass ai',  // For non-humanizer sites
    'accounting', 'bookkeeping', 'invoice',  // For non-accounting sites
    'girlfriend', 'companion', 'chat',  // For non-companion sites
  ];
  
  const hasOffTopicKeyword = offTopicKeywords.some(kw => 
    queryLower.includes(kw) && !siteKeywords.some(sk => kw.includes(sk.toLowerCase()))
  );
  
  return hasRelevantKeyword || !hasOffTopicKeyword;
}
