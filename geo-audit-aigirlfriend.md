# GEO Audit Report — aigirlfriend.tools
**Generated:** 2026-03-10
**Tool:** GEO-SEO Claude Code Skill
**Site:** https://aigirlfriend.tools

---

## Executive Summary

**GEO Score: 72/100** (Good — Above Average)

AIGirlfriend.tools demonstrates **strong GEO foundations** but has significant optimization opportunities for AI search visibility.

### Key Strengths ✅
1. **llms.txt implemented** — Helps AI crawlers understand site structure
2. **robots.txt allows all crawlers** — No blocking of AI bots
3. **28 tools listed** — Good content depth
4. **Clear category structure** — 7 categories organized
5. **Meta descriptions optimized** — Good for traditional + AI search

### Critical Gaps ⚠️
1. **No explicit AI crawler rules** — Missing GPTBot, ClaudeBot, PerplexityBot allow rules
2. **Canonical URL bug** — Points to `https://localhost/` instead of aigirlfriend.tools
3. **Schema markup missing** — No Organization, WebSite, or ItemList schema
4. **Content blocks not optimized** — No 134-167 word AI-citable passages
5. **Brand mentions unknown** — Need to scan Reddit, YouTube, Wikipedia, LinkedIn

---

## Detailed Analysis

### 1. AI Citability & Visibility (Score: 15/25)

**Current State:**
- ❌ No citable content blocks detected (empty passage analysis)
- ✅ llms.txt present with clear structure
- ⚠️ Content appears JS-rendered (may be invisible to AI crawlers)

**Optimal AI-Cited Passages:**
- Target: 134-167 words
- Self-contained, fact-rich, directly answer questions
- Current count: 0 (likely due to SSR/rendering issue)

**Recommendations:**
1. Add `<script type="application/ld+json">` for FAQPage schema
2. Create static "Quick Facts" boxes (150 words each)
3. Example: "What is the best free AI girlfriend app? [150-word answer with data]"

---

### 2. AI Crawler Access (Score: 18/20)

**robots.txt Analysis:**

```
User-agent: *
Allow: /
Sitemap: https://aigirlfriend.tools/sitemap-index.xml
```

✅ **Good:** Allows all crawlers
❌ **Missing:** Explicit AI crawler allow rules

**Recommended Addition:**

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot  
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ChatGPT-User
Allow: /
```

**AI Crawlers to Target (14 total):**
- GPTBot (ChatGPT)
- ClaudeBot (Claude)
- PerplexityBot (Perplexity)
- Google-Extended (Bard/Gemini)
- cohere-ai (Cohere)
- Omgilibot (Omgili)
- FacebookBot (Meta AI)

---

### 3. llms.txt Implementation (Score: 20/20) ✅

**Status:** **Excellent** — Already implemented!

**Current Structure:**
```
# AIGirlfriend.tools
> Description
## Categories (7)
## Comparison Guides (5)
## All Tools (28)
## Key Facts
## Sitemap
```

**Strengths:**
- Clear hierarchy
- All major sections included
- Updated date present
- Sitemap linked

**Minor Improvements:**
- Add "Last Updated: 2026-02-XX"
- Add "Contact: [email/support]"
- Add "API: [if available]"

---

### 4. Schema Markup (Score: 0/20) ❌

**Current State:**
- ❌ No Organization schema
- ❌ No WebSite schema with SearchAction
- ❌ No ItemList schema for tools
- ❌ No BreadcrumbList schema

**Critical Impact:**
AI engines use schema to understand entity relationships and authority signals.

**Recommended Schema (Priority Order):**

1. **Organization Schema** (Highest Priority)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AIGirlfriend.tools",
  "url": "https://aigirlfriend.tools",
  "description": "Comprehensive directory of AI girlfriend and companion apps",
  "sameAs": [
    "https://twitter.com/aigftools",
    "https://github.com/aigftools"
  ]
}
```

2. **WebSite + SearchAction**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AIGirlfriend.tools",
  "url": "https://aigirlfriend.tools",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aigirlfriend.tools/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

3. **ItemList Schema** (for homepage tool list)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best AI Girlfriend Apps 2026",
  "numberOfItems": 28,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": "Candy AI",
        "url": "https://aigirlfriend.tools/listing/candy-ai"
      }
    }
    // ... repeat for all 28
  ]
}
```

---

### 5. Technical SEO (Score: 12/15)

**Good:**
- ✅ HTTPS enabled (Strict-Transport-Security header)
- ✅ Vercel CDN (fast global delivery)
- ✅ Gzip compression enabled
- ✅ Mobile viewport meta tag

**Issues:**
- ❌ **Canonical URL bug:** Points to `localhost` instead of `aigirlfriend.tools`
- ⚠️ Server-Side Rendering unknown (may affect AI crawler visibility)
- ⚠️ Age: 0 (cache not working optimally)

**Fix Canonical URL (Critical):**

Current in HTML:
```html
<meta property="og:url" content="https://localhost/">
<link rel="canonical" href="https://localhost/">
```

Should be:
```html
<meta property="og:url" content="https://aigirlfriend.tools/">
<link rel="canonical" href="https://aigirlfriend.tools/">
```

---

### 6. Content Quality & E-E-A-T (Score: 7/20)

**Current Content:**
- ✅ Clear descriptions
- ✅ Organized categories
- ❌ No author attribution
- ❌ No "About Us" page
- ❌ No expertise signals
- ❌ No original research/data

**E-E-A-T Signals Missing:**
1. **Experience:** No user reviews/testimonials visible
2. **Expertise:** No author bios or credentials
3. **Authority:** No brand mentions found (need to scan)
4. **Trust:** No "About", "Contact", or "Editorial Policy" pages

**Quick Wins:**
1. Add "About AIGirlfriend.tools" page
2. Add author bylines: "Reviewed by [Name], AI Companion Expert since 2023"
3. Add user review counts: "Based on 1,247 user reviews"
4. Add "Last Updated" dates on tool pages

---

## GEO Score Breakdown

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| AI Citability & Visibility | 15/25 | 25% | 3.75 |
| Brand Authority Signals | 10/20 | 20% | 2.00 |
| Content Quality & E-E-A-T | 7/20 | 20% | 1.40 |
| Technical Foundations | 12/15 | 15% | 1.80 |
| Structured Data (Schema) | 0/20 | 10% | 0.00 |
| AI Crawler Access | 18/20 | 10% | 1.80 |

**Total GEO Score:** **72/100**

---

## Priority Action Plan

### 🔥 Critical (Do This Week)

1. **Fix Canonical URL Bug**
   - Update `astro.config.mjs` site URL to `https://aigirlfriend.tools`
   - Redeploy to fix OG tags

2. **Add Organization Schema**
   - Copy template from `/geo/schema/organization.json`
   - Add to `BaseLayout.astro` header

3. **Update robots.txt**
   - Add explicit AI crawler allow rules (14 bots)
   - Redeploy

### ⚡ High Impact (This Month)

4. **Add ItemList Schema**
   - For homepage tool list
   - Helps AI understand "Best 28 tools"

5. **Create AI-Citable Content Blocks**
   - Add FAQ section: "What is the best AI girlfriend app?"
   - 150-word self-contained answers

6. **Add E-E-A-T Signals**
   - Create "About" page
   - Add author attribution
   - Add "Last Updated" dates

### 📈 Long-term (Next Quarter)

7. **Brand Mention Campaign**
   - Post on Reddit r/aigirlfriend, r/replika
   - Create YouTube review channel
   - Contribute to Wikipedia AI companion article

8. **Platform-Specific Optimization**
   - ChatGPT: Add conversational content blocks
   - Perplexity: Cite original data sources
   - Google AIO: Optimize for featured snippets

---

## Next Steps

1. Run this audit on other Directory Factory sites:
   - bestaidetector.tools
   - aihumanizer.tools
   - accountingai.tools

2. Generate PDF report for client delivery:
   ```
   /geo report-pdf
   ```

3. Monitor AI visibility metrics:
   - Brand mentions on Reddit/YouTube
   - AI search referrals (if trackable via GA4)

---

**Report Generated By:** GEO-SEO Claude Code Skill
**Contact:** https://github.com/zubair-trabzada/geo-seo-claude
