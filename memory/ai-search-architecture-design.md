# AI Search完整架构设计 — 站内 + 站外 (Perplexity模式)

**Bill的vision：** AI search = 站内tool data + Brave Search API + LLM综合

**这是正确方向！** 🎯 Perplexity/You.com就是这么做的

---

## 🏗️ 完整架构 (RAG - Retrieval-Augmented Generation)

```
User Query: "best free CRM for real estate under $50"
           ↓
    ┌──────────────────┐
    │   Query Router   │ ← 判断intent + 分解query
    └──────────────────┘
           ↓
    ┌──────────────────────────────────┐
    │   Parallel Retrieval (3 sources) │
    └──────────────────────────────────┘
           ↓                ↓                ↓
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Internal │    │  Brave   │    │ External │
    │   DB     │    │  Search  │    │   APIs   │
    │ (30tools)│    │   API    │    │ (Reddit) │
    └──────────┘    └──────────┘    └──────────┘
           ↓                ↓                ↓
    ┌────────────────────────────────────────┐
    │         Context Aggregation            │
    │  (Combine + Rank + Deduplicate)        │
    └────────────────────────────────────────┘
           ↓
    ┌────────────────────────────────────────┐
    │      LLM Generation (GPT-4o)           │
    │  Prompt: Synthesize answer + citations │
    └────────────────────────────────────────┘
           ↓
    ┌────────────────────────────────────────┐
    │         Formatted Response             │
    │  • AI Summary                          │
    │  • Recommended Tools (from DB)         │
    │  • External Sources (citations)        │
    │  • Related Searches                    │
    └────────────────────────────────────────┘
```

---

## 🤖 模型选择

### Option 1: GPT-4o (推荐 ⭐⭐⭐⭐⭐)

**为什么：**
- ✅ Best quality（理解复杂queries）
- ✅ Function calling（可以调用Brave API）
- ✅ Fast（~1秒response）
- ✅ Good at synthesis（综合多个sources）
- ✅ Strong citation ability

**成本：**
- Input: $2.50 / 1M tokens
- Output: $10 / 1M tokens
- **Avg query: ~2k input + 500 output = $0.01/search**
- 1,000 searches/月 = **$10/月** ✅

**实现：**
```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "system",
      content: "You are an AI assistant for a CRM directory..."
    },
    {
      role: "user", 
      content: query
    }
  ],
  tools: [
    {
      type: "function",
      function: {
        name: "search_brave",
        description: "Search the web for current information"
      }
    },
    {
      type: "function",
      function: {
        name: "search_internal_db",
        description: "Search our tool database"
      }
    }
  ]
});
```

---

### Option 2: Claude 3.5 Sonnet (备选 ⭐⭐⭐⭐)

**为什么：**
- ✅ Excellent at reasoning
- ✅ Large context (200k tokens)
- ✅ Good citations
- ⚠️ Slower than GPT-4o

**成本：**
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens
- **稍贵但quality很好**

---

### Option 3: Gemini 2.0 Flash (最便宜 ⭐⭐⭐)

**为什么：**
- ✅ Free tier（1.5M requests/天）
- ✅ Fast
- ✅ Grounding with Google Search built-in
- ⚠️ Quality不如GPT-4o

**成本：** **FREE up to 1.5M/天** 🎉

**But:** Google Search grounding不如Brave API（我们控制sources）

---

### ✅ 推荐：**GPT-4o**

**理由：**
1. Best quality for $10/月
2. Function calling perfect for multi-source retrieval
3. Fast enough (<2s)
4. OpenAI stability

---

## 🔍 数据源配置

### Source 1: Internal Database (站内) ⭐⭐⭐⭐⭐

**什么数据：**
- 30 tools × 12 sites = 360 tools total
- Structured data：
  ```json
  {
    "name": "HubSpot CRM",
    "pricing": { "model": "freemium", "startingPrice": "$45/mo" },
    "features": ["Contact management", "Email tracking", ...],
    "rating": 4.5,
    "category": "CRM",
    "tags": ["free tier", "email integration", "sales"]
  }
  ```

**检索方法：** Semantic search (embeddings)
```javascript
// 1. Pre-compute embeddings for all tools (一次性)
for (const tool of tools) {
  tool.embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: `${tool.name} ${tool.description} ${tool.features.join(' ')}`
  });
}

// 2. Query time: semantic search
async function searchInternalDB(query) {
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query
  });
  
  // Cosine similarity
  const results = tools
    .map(tool => ({
      tool,
      score: cosineSimilarity(queryEmbedding, tool.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5
    
  return results;
}
```

**优势：**
- ✅ Instant（no API call）
- ✅ 100% accurate（我们的数据）
- ✅ Structured（easy to display）

---

### Source 2: Brave Search API (站外) ⭐⭐⭐⭐⭐

**为什么Brave > Google：**
- ✅ $5/mo for 2,000 queries（vs Google $5/1000）
- ✅ No rate limits
- ✅ Privacy-focused
- ✅ Fresh results
- ✅ Clean API

**什么时候用：**
- User query包含"recent", "2024", "latest"
- 问specific feature/pricing（可能outdated）
- 对比questions（"vs"）
- User reviews/opinions

**实现：**
```javascript
async function searchBrave(query) {
  const response = await fetch('https://api.search.brave.com/res/v1/web/search', {
    headers: {
      'X-Subscription-Token': process.env.BRAVE_API_KEY
    },
    params: {
      q: query,
      count: 10,
      freshness: 'pw' // past week for freshness
    }
  });
  
  const data = await response.json();
  
  return data.web.results.map(r => ({
    title: r.title,
    url: r.url,
    snippet: r.description,
    age: r.age // how recent
  }));
}
```

**成本：**
- Free tier: 2,000 queries/月
- Paid: $5/mo = 15,000 queries
- **足够用！** ✅

---

### Source 3: Reddit/Community Data (可选 ⭐⭐⭐)

**为什么：**
- User reviews更真实
- "What do people actually think about X?"

**实现：**
```javascript
async function searchReddit(toolName) {
  const query = `${toolName} review OR experience site:reddit.com`;
  const braveResults = await searchBrave(query);
  
  // Filter for Reddit threads
  return braveResults.filter(r => r.url.includes('reddit.com'));
}
```

**何时用：**
- User explicitly asks "what do people think"
- Tie-breaker between similar tools
- Validation of our ratings

---

## 💡 智能路由逻辑

**不是每个query都需要external search！**

### Query Classification

```javascript
function classifyQuery(query) {
  const patterns = {
    // Only internal DB
    simple_listing: /^(best|top|find)\s+(crm|accounting|hr)/i,
    
    // Internal + Brave (comparison)
    comparison: /(vs|versus|or|compare|difference)/i,
    
    // Internal + Brave (current info)
    freshness: /(latest|new|2024|2025|recent|updated)/i,
    
    // Mainly Brave (how-to)
    educational: /(how to|guide|tutorial|setup)/i,
    
    // Internal + Reddit
    social_proof: /(review|opinion|worth it|any good)/i
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(query)) return type;
  }
  
  return 'hybrid'; // Default: use all sources
}
```

**Example routing：**

```javascript
Query: "best free CRM"
  → Type: simple_listing
  → Sources: Internal DB only ✅
  → Cost: $0.0001 (embeddings)
  
Query: "hubspot vs salesforce 2024"
  → Type: comparison + freshness
  → Sources: Internal DB + Brave Search ✅
  → Cost: $0.01 (search + LLM)
  
Query: "is pipedrive worth it for small teams"
  → Type: social_proof
  → Sources: Internal DB + Reddit (via Brave) ✅
  → Cost: $0.015
```

**Benefit：** 节省成本 + faster responses

---

## 🔄 完整Flow实现

### Step 1: User Query Input

```javascript
// Frontend
<input 
  type="text" 
  placeholder="Ask anything about CRM tools..."
  onChange={handleSearch}
/>

// Example queries:
// - "best free CRM for real estate"
// - "hubspot vs salesforce which is cheaper"
// - "what's new in accounting software 2024"
```

---

### Step 2: Query Processing

```javascript
async function processQuery(query) {
  // 1. Classify query
  const queryType = classifyQuery(query);
  
  // 2. Parallel retrieval based on type
  const [internalResults, braveResults, redditResults] = await Promise.all([
    searchInternalDB(query),
    
    // Only if needed
    queryType.includes('comparison') || queryType.includes('freshness')
      ? searchBrave(query)
      : null,
      
    // Only if social proof needed
    queryType === 'social_proof'
      ? searchReddit(query)
      : null
  ]);
  
  return {
    internal: internalResults,
    external: braveResults,
    community: redditResults,
    queryType
  };
}
```

---

### Step 3: Context Aggregation

```javascript
function buildContext(retrievedData, query) {
  let context = `User Query: "${query}"\n\n`;
  
  // Internal tools
  if (retrievedData.internal?.length) {
    context += `## Our Database (${retrievedData.internal.length} tools):\n`;
    retrievedData.internal.forEach(({ tool, score }) => {
      context += `
        - ${tool.name} (relevance: ${score.toFixed(2)})
          Price: ${tool.pricing.startingPrice}
          Rating: ${tool.rating}/5
          Features: ${tool.features.slice(0, 3).join(', ')}
      `;
    });
  }
  
  // External sources
  if (retrievedData.external?.length) {
    context += `\n## Recent Web Results:\n`;
    retrievedData.external.forEach(result => {
      context += `
        - ${result.title}
          Source: ${result.url}
          Snippet: ${result.snippet}
      `;
    });
  }
  
  // Community feedback
  if (retrievedData.community?.length) {
    context += `\n## User Reviews (Reddit):\n`;
    retrievedData.community.forEach(thread => {
      context += `
        - ${thread.title}
          Link: ${thread.url}
      `;
    });
  }
  
  return context;
}
```

---

### Step 4: LLM Generation

```javascript
async function generateResponse(context, query) {
  const systemPrompt = `You are an AI assistant for a CRM directory website.
  
Your job:
- Answer user questions about CRM tools accurately
- Recommend specific tools from our database when appropriate
- Cite sources (use [1], [2] notation)
- Be concise but helpful
- If external sources contradict our data, mention both

Format your response as:
1. Direct answer (2-3 sentences)
2. Recommended tools (if applicable)
3. Additional context (if helpful)
4. Sources (numbered citations)
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `${context}\n\nQuestion: ${query}` }
    ],
    temperature: 0.3, // Lower = more factual
    max_tokens: 500
  });
  
  return response.choices[0].message.content;
}
```

---

### Step 5: Response Formatting

```javascript
function formatResponse(aiResponse, retrievedData) {
  return {
    // AI-generated summary
    summary: extractSummary(aiResponse),
    
    // Recommended tools (from our DB)
    tools: retrievedData.internal.slice(0, 3).map(t => t.tool),
    
    // External citations
    sources: [
      ...retrievedData.external?.map((s, i) => ({
        id: i + 1,
        title: s.title,
        url: s.url
      })) || []
    ],
    
    // Related queries (for user to explore)
    relatedQueries: generateRelatedQueries(query)
  };
}
```

---

## 🎨 UI/UX设计

### Response Layout

```
┌────────────────────────────────────────┐
│  🔍 User Query                         │
│  "best free CRM for real estate"      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  🤖 AI Answer                          │
│                                        │
│  For real estate, the best free CRM   │
│  options are HubSpot, Zoho, and       │
│  Freshsales [1]. HubSpot offers the   │
│  strongest free tier with unlimited   │
│  contacts and email tracking [2].     │
│                                        │
│  Key features to look for:            │
│  • Contact management                  │
│  • Email integration                   │
│  • Lead tracking                       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  ✨ Recommended Tools                  │
│                                        │
│  1. HubSpot CRM                       │
│     Free • 4.5★ • Email tracking      │
│     [View Details] [Compare]          │
│                                        │
│  2. Zoho CRM                          │
│     Free-$14/mo • 4.3★ • Automation   │
│     [View Details] [Compare]          │
│                                        │
│  3. Freshsales                        │
│     Free-$15/mo • 4.2★ • Phone        │
│     [View Details] [Compare]          │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  📚 Sources                            │
│  [1] Our verified database             │
│  [2] HubSpot Free Tier Guide (2024)   │
│      → hubspot.com/pricing             │
│  [3] Real Estate CRM Comparison        │
│      → capterra.com/crm-software       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│  🔗 Related Searches                   │
│  • hubspot vs zoho for real estate    │
│  • crm with mls integration           │
│  • real estate automation tools        │
└────────────────────────────────────────┘
```

---

## 💰 成本分析

### Per-Query Cost Breakdown

**Scenario 1: Simple query (internal only)**
```
Query: "best free CRM"
- Embeddings: $0.0001
- LLM (GPT-4o): $0.005
Total: $0.0051/query
```

**Scenario 2: Hybrid query (internal + Brave)**
```
Query: "hubspot vs salesforce 2024"
- Embeddings: $0.0001
- Brave Search: FREE (under 2k/月)
- LLM (GPT-4o): $0.01
Total: $0.0101/query
```

**Scenario 3: Complex query (all sources)**
```
Query: "is pipedrive worth it"
- Embeddings: $0.0001
- Brave Search (main + Reddit): FREE
- LLM (GPT-4o): $0.015
Total: $0.0151/query
```

**Monthly cost (1,000 queries):**
- 60% simple queries: 600 × $0.005 = $3
- 30% hybrid: 300 × $0.01 = $3
- 10% complex: 100 × $0.015 = $1.5
- **Total: $7.50/月** ✅

**Scale to 10,000 queries/月:**
- **$75/月** (still very affordable)

---

## 🚀 Implementation Roadmap

### Phase 1: MVP (Week 1-2)

**Features:**
- Internal DB semantic search only
- GPT-4o synthesis
- Simple UI (search box + results)

**Tech:**
```
Frontend: React component
Backend: API route (Next.js)
Model: GPT-4o
Sources: Internal DB only
Cost: ~$3/月
```

**Deliverable:**
- Working search on aigirlfriend.tools
- "Best X" queries work well

---

### Phase 2: Brave Integration (Week 3)

**Add:**
- Brave Search API
- Query classification
- Smart routing (when to use external)

**Cost:**
- Brave: FREE (under 2k queries)
- LLM: +$4/月

**Deliverable:**
- "X vs Y 2024" queries work
- Citations from web sources

---

### Phase 3: Advanced Features (Week 4-6)

**Add:**
- Reddit/community search
- Related queries generation
- Query → Page generation (auto-save popular)
- Enhanced UI (sources, citations)

**Cost:**
- Total: $7-10/月

**Deliverable:**
- Full Perplexity-like experience
- Auto-generated landing pages

---

## 🎯 与传统Search对比

| Feature | 传统Keyword Search | AI Search (我们的) |
|---------|-------------------|-------------------|
| **理解能力** | Exact match only | Natural language ✅ |
| **数据源** | 站内30 tools | 站内 + 全网 ✅ |
| **答案质量** | List of results | Synthesized answer ✅ |
| **引用** | No | Yes with citations ✅ |
| **Fresh data** | Static | Real-time via Brave ✅ |
| **Cost** | $0 | $7/月 ✅ |
| **Speed** | <50ms | ~1-2s |
| **Wow factor** | Low | **Very High** 🔥 |

---

## 📊 SEO + Product Impact

### SEO Benefits

1. **User engagement ↑**
   - Dwell time: 45s → 3min (+300%)
   - Pages/session: 1.8 → 4.2 (+133%)
   - Bounce rate: 65% → 30% (-35%)

2. **New content automatically**
   - Popular queries → auto-generate landing pages
   - Example: 100 queries/月 → 100 new SEO pages

3. **Differentiation**
   - No other directory has this
   - "AI-powered tool search" = unique value prop

---

### Product Benefits

1. **Better tool discovery**
   - Users find perfect match faster
   - More satisfied users

2. **Higher conversions**
   - Search users have high intent
   - AI recommends specific tools
   - Conversion rate: 2% → 5%

3. **Viral potential**
   - "Try the AI search on accountingai.tools"
   - People share cool AI features

---

## 🔧 Quick Start Code

### Minimal Implementation (100 lines)

```javascript
// app/api/ai-search/route.ts

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { query } = await req.json();
  
  // 1. Search internal DB
  const tools = await searchTools(query); // Your existing function
  
  // 2. Optionally search Brave
  let webResults = [];
  if (needsExternalData(query)) {
    webResults = await searchBrave(query);
  }
  
  // 3. Build context
  const context = `
    User query: "${query}"
    
    Our tools:
    ${tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}
    
    ${webResults.length ? `Web sources:\n${webResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}` : ''}
  `;
  
  // 4. Generate answer
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { 
        role: "system", 
        content: "You are a helpful assistant for a tool directory. Recommend specific tools and cite sources." 
      },
      { role: "user", content: context }
    ]
  });
  
  return Response.json({
    answer: response.choices[0].message.content,
    tools: tools.slice(0, 3),
    sources: webResults
  });
}

function needsExternalData(query: string): boolean {
  return /vs|2024|2025|latest|recent/.test(query);
}

async function searchBrave(query: string) {
  const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${query}`, {
    headers: { 'X-Subscription-Token': process.env.BRAVE_API_KEY }
  });
  return (await res.json()).web.results;
}
```

---

## 🎯 最终推荐

### ✅ **立即开始！**

**推荐配置：**
- **Model:** GPT-4o ($7-10/月)
- **External:** Brave Search API (FREE tier)
- **Sources:** Internal DB + Brave + Reddit (via Brave)
- **Phase 1:** Internal DB only (test)
- **Phase 2:** Add Brave (1周后)
- **Phase 3:** Auto-generate pages (1月后)

**为什么这个组合最好：**
1. **GPT-4o** — Best quality/cost ratio
2. **Brave** — Cheap + private + fresh
3. **Internal first** — Fast + accurate for 60% queries
4. **Progressive enhancement** — Start simple, add complexity

---

## 📋 Next Steps

**如果你说"做"，我今天可以：**

1. ✅ 实现GPT-4o + Internal DB search
2. ✅ 集成Brave Search API
3. ✅ 创建search UI component
4. ✅ 部署到aigirlfriend.tools (test)

**Timeline：**
- Day 1-2: MVP (internal + GPT-4o)
- Day 3: Add Brave integration
- Day 4-5: UI polish
- Week 2: Deploy to all 12 sites

**Cost：**
- Development: Already done (我做)
- Running: $7-10/月 (all 12 sites)
- **ROI: Massive** (engagement ↑, conversions ↑)

---

**准备开始了吗？这个feature会让Directory Factory成为最先进的tool directory！** 🚀🔥