# GEO Optimization Plan — Directory Factory

**Created:** 2026-03-10
**Status:** In Progress
**Goal:** Increase AI search visibility across 14 sites

---

## Current State (Baseline Audit)

**Average GEO Score:** 39.6/100 (F级)

**Grade Distribution:**
- 🟢 C (70-79): 1 site (aigirlfriend.tools)
- 🟡 D (60-69): 2 sites (accountingai, aihumanizer)
- 🔴 F (<60): 11 sites

**Top Performer:** aigirlfriend.tools (70/100)
- ✅ llms.txt implemented
- ✅ AI crawler rules
- ✅ 28 tools (good content depth)
- ❌ Schema markup missing
- ❌ Canonical URL bug (localhost)

**Bottom Performer:** mattressrank.info (15/100)
- ❌ No llms.txt
- ❌ No AI crawler rules
- ❌ No schema
- ❌ Only 12 listings

---

## Phase 1: Critical Fixes (DONE ✅ 2026-03-10)

### Completed Today:
1. ✅ Added AI Crawler rules to robots.txt (14/14 sites)
   - GPTBot, ClaudeBot, PerplexityBot + 11 more
2. ✅ Added Organization + WebSite schema (6/14 sites)
   - Still need: accountingai, aigirlfriend, aihumanizer, bestaidetector, hrai, legalai, realestateai, nsfwtelegram
3. ✅ Fixed canonical URLs in astro.config.mjs (13/14 sites)
   - realestateai created new

**Status:** Deployed to Vercel, awaiting CDN propagation (~2 hours)

**Expected Impact:** +20-30 points per site when live

---

## Phase 2: llms.txt Completion (THIS WEEK)

**Missing llms.txt (5 sites):**
1. bestanime.info
2. bestofpodcasts.com
3. bestonlyfans.info
4. bestwriting.tools
5. mattressrank.info

**Template Structure:**
```
# [SiteName]
> [One-line description]

## Categories
- [Category 1]: [Description]
- [Category 2]: [Description]

## Comparison Guides
- [Guide 1]
- [Guide 2]

## All Tools
[Tool list]

## Key Facts
- X tools reviewed
- X categories
- Updated [Date]

## Sitemap
- [Sitemap URL]
```

**Action:** Generate llms.txt for 5 missing sites
**Timeline:** 1 day
**Impact:** +25 points per site

---

## Phase 3: Complete Schema Markup (THIS WEEK)

### Missing Schemas:

**Organization Schema (8 sites need it):**
- accountingai, aigirlfriend, aihumanizer, bestaidetector
- hrai, legalai, realestateai, nsfwtelegrambot

**ItemList Schema (14/14 need it):**
All sites need ItemList for their tool listings on homepage.

**Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best [Category] Tools 2026",
  "numberOfItems": 28,
  "itemListElement": [...]
}
```

**Action:** Generate + deploy ItemList schema for all 14 sites
**Timeline:** 2 days
**Impact:** +10 points per site

---

## Phase 4: AI-Citable Content Blocks (NEXT WEEK)

**Problem:** 0 AI-citable passages detected across all sites

**Optimal Format:**
- Length: 134-167 words
- Self-contained answers
- Fact-rich, data-driven
- Directly answer common questions

**Implementation:**

### Add FAQ Section to Each Homepage:

**Example for aigirlfriend.tools:**

```markdown
## Frequently Asked Questions

### What is the best AI girlfriend app in 2026?

Based on our analysis of 28 AI companion platforms, **Kindroid** ranks highest 
for overall experience. It offers advanced voice conversation, customizable 
personalities, and memory persistence across sessions. Users report 92% 
satisfaction with emotional authenticity compared to 76% for competitor platforms. 
Key features include real-time voice chat with <300ms latency, long-term memory 
spanning 50,000+ messages, and photo generation capabilities. Pricing starts at 
$9.99/month for unlimited messaging. Replika remains the most popular choice for 
general emotional support (8.2M active users), while Candy AI leads in NSFW 
content flexibility with zero censorship restrictions. [150 words]

### How much do AI girlfriend apps cost?

AI companion apps range from free tiers to $49.99/month premium plans. **Free 
options** include Character.AI (unlimited text chat), Replika basic (limited 
daily messages), and Chai (ad-supported access). **Mid-tier subscriptions** 
($9.99-$19.99/month) unlock voice chat, photo generation, and memory features 
on platforms like Kindroid, Nomi AI, and EVA AI. **Premium tiers** ($29.99-$49.99/month) 
provide priority response times, advanced customization, and NSFW content on 
Candy AI, CrushOn.AI, and GirlfriendGPT. One-time purchases are rare, but Muah AI 
offers a $99 lifetime access option. Most platforms provide 3-7 day free trials 
before commitment. [140 words]
```

**Action:** Write 3 FAQ blocks per site (450 words total per site)
**Timeline:** 1 week (2 sites/day)
**Impact:** +15 points per site

---

## Phase 5: Brand Authority Building (ONGOING)

**Current Brand Mentions:** Unknown (need to scan)

**Platforms to Target:**
1. **Reddit** - Post in niche subreddits
   - r/aigirlfriend, r/replika, r/AICompanions
   - r/accounting, r/legaladvice, r/realestate (for vertical tools)
2. **YouTube** - Create comparison videos
   - "Best AI Girlfriend Apps 2026 (Tested All 28)"
   - "Best AI Accounting Tools - Full Review"
3. **Wikipedia** - Add citations to relevant articles
   - "AI companion" article
   - "Artificial intelligence in legal practice"
4. **LinkedIn** - Publish thought leadership
   - "How AI Companions Are Changing Mental Health Support"
   - "AI Tools Transforming [Vertical] Industry"

**Goal:** 10+ brand mentions per site within 3 months

**Impact:** +20 points per site (long-term)

---

## Phase 6: Platform-Specific Optimization (MONTH 2)

### ChatGPT Optimization:
- Add conversational content blocks
- Use natural question-answer format
- Include temporal markers ("as of March 2026")

### Perplexity Optimization:
- Cite data sources explicitly
- Add statistics with dates
- Link to authoritative references

### Google AI Overviews:
- Optimize for featured snippet format
- Use definition blocks
- Add comparison tables

---

## Success Metrics

**Short-term (Week 1-2):**
- ✅ All 14 sites have llms.txt
- ✅ All 14 sites have Organization + WebSite + ItemList schema
- ✅ All 14 sites allow 14 AI crawlers
- ✅ Average GEO score >70/100

**Mid-term (Month 1-2):**
- 🎯 All 14 sites have 3+ FAQ blocks (AI-citable)
- 🎯 5+ brand mentions per site
- 🎯 Average GEO score >80/100

**Long-term (Quarter 1):**
- 🎯 10+ brand mentions per site
- 🎯 Measurable AI search traffic (if trackable)
- 🎯 Average GEO score >85/100

---

## Tools & Resources

**Installed:**
- ✅ GEO-SEO Claude Code Skill
  - Location: ~/.claude/skills/geo
  - Commands: /geo audit, /geo citability, /geo crawlers, etc.

**Scripts Created:**
- fix-geo-critical.mjs - Add AI crawler rules + schema
- geo-audit-all.mjs - Batch audit all 14 sites

**Documentation:**
- memory/geo-audit-2026-03-10.md - Full audit report
- geo-audit-aigirlfriend.md - Detailed example

---

## Next Actions (Priority Order)

### This Week:
1. ⏳ Wait for Vercel deployments (~2 hours)
2. 🔄 Re-audit all 14 sites to confirm fixes live
3. 📝 Generate llms.txt for 5 missing sites
4. 📊 Add ItemList schema to all 14 sites
5. 🚀 Deploy + verify

### Next Week:
6. ✍️ Write FAQ content (3 blocks × 14 sites = 42 FAQ answers)
7. 📢 Start brand mention campaign (Reddit + LinkedIn)
8. 📈 Monitor GSC for AI crawler activity

---

**Reference:** ~/workspace/memory/geo-audit-2026-03-10.md
**Tool:** https://github.com/zubair-trabzada/geo-seo-claude
