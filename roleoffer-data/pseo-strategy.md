# RoleOffer.com - pSEO Strategy

## Goal: 20,000+ Pages for Organic Traffic

---

## URL Structure

### Pattern
```
/compensation/{role-slug}-{level-slug}-{stage-slug}-{location-slug}
```

### Examples
```
/compensation/software-engineer-mid-series-a-san-francisco
/compensation/product-manager-senior-seed-new-york
/compensation/data-scientist-staff-series-b-austin
```

---

## Page Matrix

### Dimensions
- **Roles:** 50 (Engineering, Product, Design, Sales, Marketing, Ops, Data, etc.)
- **Levels:** 5 (Junior/IC1-IC2, Mid/IC3, Senior/IC4-IC5, Staff/IC6, Manager/M1-M2)
- **Stages:** 4 (Seed, Series A, Series B, Series C+)
- **Locations:** 20 (Top startup cities)

### Total Combinations
**50 × 5 × 4 × 20 = 20,000 pages**

---

## Phase 1: Top 5,000 Pages

### Priority Matrix (MVP Launch)
Focus on high-traffic role × location combinations:

**Top 10 Roles:**
1. Software Engineer
2. Senior Software Engineer
3. Product Manager
4. Senior Product Manager
5. Data Scientist
6. Engineering Manager
7. Full Stack Engineer
8. Frontend Engineer
9. Backend Engineer
10. DevOps Engineer

**Top 10 Locations:**
1. San Francisco, CA
2. New York, NY
3. Seattle, WA
4. Austin, TX
5. Boston, MA
6. Los Angeles, CA
7. Denver, CO
8. Chicago, IL
9. Portland, OR
10. San Diego, CA

**All 5 Levels × All 4 Stages**

**Phase 1 Total:** 10 roles × 5 levels × 4 stages × 10 cities = **2,000 pages**

**Add long-tail:** +3,000 pages (niche roles + tier-2 cities) = **5,000 total**

---

## Page Template

### Meta Data
```typescript
interface PageMeta {
  title: string; // "{Role} {Level} Compensation - {Stage} Startup - {Location} | RoleOffer"
  description: string; // 155 chars, includes CTA
  canonical: string;
  ogImage: string; // Generated chart image
  schema: {
    '@type': 'FAQPage' | 'Article';
    // ...
  };
}
```

### Example Meta
```
Title: "Senior Software Engineer Compensation - Series A Startup - San Francisco | RoleOffer"
Description: "Senior Software Engineer comp at Series A startups in San Francisco: $175K median base, 0.15% equity. Generate your offer package for $49."
```

### Content Structure
```markdown
# {Role} Compensation at {Stage} Startups in {Location} (2026)

## Salary Benchmarks
- **P25:** $XXX,XXX
- **P50 (Median):** $XXX,XXX  
- **P75:** $XXX,XXX

[Bar Chart: P25/P50/P75]

## Equity Ranges
- **P25:** 0.XX%
- **P50 (Median):** 0.XX%
- **P75:** 0.XX%

Typical vesting: 4 years with 1-year cliff

## Total Compensation
Based on median equity value at current stage valuation:
- **Year 1:** $XXX,XXX (base + equity vesting)
- **Year 2:** $XXX,XXX
- **Year 4:** $XXX,XXX

## vs FAANG Comparison (if applicable)
- FAANG {Role} total comp: $XXX,XXX
- Startup advantage: Higher equity upside
- Trade-off: Lower base, higher risk/reward

## How to Make This Offer
Generate a complete offer package in 30 seconds:
- Benchmark report (P25/P50/P75)
- Professional offer letter PDF
- Equity value projection
- Negotiation talk points

[CTA Button: Generate Offer → $49]

## Related Searches
- [{Adjacent Role} at {Stage} in {Location}]
- [{Role} at {Adjacent Stage} in {Location}]
- [{Role} at {Stage} in {Adjacent Location}]

## FAQ

### How accurate is this data?
Based on H1B filings, levels.fyi, BLS, and Carta equity benchmarks. Updated monthly.

### Should I offer P25, P50, or P75?
- P25: Budget-conscious, early-stage
- P50: Market rate, competitive
- P75: Top talent, urgent hire

### What about benefits?
Typical {Stage} startup benefits: Health insurance, 401k (no match), unlimited PTO, remote flexibility.

### How do I explain equity value to candidates?
Use our equity calculator to show 3 scenarios (conservative/base/optimistic) over 4 years.
```

---

## SEO Optimization

### On-Page Elements
- **H1:** Exact match for main keyword
- **H2s:** Variations (Salary Benchmarks, Equity, Total Comp, FAQ)
- **Internal Links:** 5-10 related pages (same role different location, etc.)
- **External Links:** 1-2 to authoritative sources (BLS, Carta public reports)
- **Images:** Chart images (salary bars, equity projection)
- **Alt Text:** Descriptive, keyword-rich

### Schema Markup
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is the average {Role} salary at {Stage} startups in {Location}?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "The median base salary is ${p50}, with P25 at ${p25} and P75 at ${p75}."
    }
  }]
}
```

### Technical SEO
- **Load Speed:** <2s (Next.js SSG, optimized images)
- **Mobile-First:** Responsive design
- **Core Web Vitals:** LCP <2.5s, CLS <0.1, FID <100ms
- **Canonical Tags:** Self-referencing
- **Sitemap:** Auto-generated, submitted to GSC
- **IndexNow:** Auto-submit on page generation

---

## Content Generation Strategy

### Automated (95%)
- Salary benchmarks (from database)
- Equity percentages (from database)
- Meta titles/descriptions (template + variables)
- FAQ content (template + role/location substitution)
- Related links (algorithmic)

### Manual/AI-Assisted (5%)
- "vs FAANG" comparisons (only for roles where data exists)
- Industry-specific insights (e.g., "San Francisco pays 25% more than Austin")
- Stage-specific notes (e.g., "Seed stage offers more equity, less base")

---

## Internal Linking Strategy

### Hub Pages (High Authority)
```
/compensation/software-engineer  (all levels, all stages, all cities)
/compensation/series-a           (all roles at Series A)
/compensation/san-francisco      (all roles in SF)
```

### Spoke Pages (Long Tail)
```
/compensation/software-engineer-mid-series-a-san-francisco
```

Each spoke page links to:
- Hub pages (3 links: role hub, stage hub, location hub)
- Related spokes (5-10 links: same role different location, etc.)

---

## Keyword Research

### Target Keywords (per page)
**Primary:**
- "{role} compensation {stage}"
- "{role} salary {location}"
- "{stage} startup {role} offer"

**Secondary:**
- "{role} equity {stage}"
- "how much to pay {role} {location}"
- "{role} total comp {stage} {location}"

**Long Tail:**
- "senior software engineer offer letter series a"
- "product manager equity percentage seed stage"
- "data scientist salary san francisco startup"

### Expected Search Volume
- **High-volume pages** (1K+ searches/month): ~100 pages
  - "Software Engineer Compensation San Francisco"
  - "Product Manager Salary New York"
- **Medium-volume** (100-1K searches/month): ~500 pages
- **Long-tail** (<100 searches/month): 19,400 pages

**Cumulative Traffic Potential:** 50,000-100,000 monthly visitors (6-12 months post-launch)

---

## Indexing Strategy

### Phase 1: Priority Pages (Week 1-2)
- Submit top 1,000 pages via GSC sitemap
- IndexNow push for top 500 pages
- Manual indexing request for top 50 (via GSC URL inspection)

### Phase 2: Bulk Generation (Week 3-4)
- Generate remaining 4,000 pages
- Auto-submit via sitemap
- Incremental indexing (Next.js ISR)

### Phase 3: Full Coverage (Month 2)
- Generate all 20,000 pages
- Monitor indexing rate (target: 80%+ indexed in 90 days)
- Re-submit non-indexed pages

### Phase 4: Refresh (Ongoing)
- Monthly data updates (new benchmarks)
- Regenerate pages with stale data (>3 months old)
- Add new roles/locations as needed

---

## Content Quality Signals

### User Engagement
- **Dwell Time:** Target 2+ minutes (quality content)
- **Bounce Rate:** <60% (if higher, improve content)
- **CTR to CTA:** 5-10% (benchmark → paid offer conversion)

### Technical Quality
- **Unique Content:** 90%+ (templates + dynamic data = unique)
- **Word Count:** 800-1,200 words per page
- **Readability:** Grade 8-10 (accessible to founders, not overly technical)

### E-A-T Signals
- **Expertise:** Cite data sources (H1B, BLS, Carta)
- **Authority:** Backlinks from founder communities
- **Trustworthiness:** Transparent methodology, no hidden data sources

---

## Backlink Strategy

### Target Sources
1. **Founder Communities**
   - YC Bookface (post about tool)
   - Indie Hackers (share in forums)
   - OnDeck Slack channels
   - SaaStr community

2. **HR/Recruiting Blogs**
   - Guest post: "How to Comp Your First 10 Hires"
   - Contribute to HR resource lists

3. **Startup Directories**
   - Product Hunt (launch post → permanent link)
   - BetaList
   - AlternativeTo (vs Pave/Carta)

4. **Industry Publications**
   - TechCrunch "Startup Tools" roundups
   - First Round Review resources
   - Andreessen Horowitz portfolio resources

### Link Building Tactics
- **Create shareable tools** (free equity calculator → founders link to it)
- **Original research** ("State of Startup Comp 2026" report)
- **Founder testimonials** (case studies → they link back)
- **SEO content** (blog posts that others cite)

---

## Monitoring & Optimization

### Track These Metrics
- **Indexing Rate:** % of pages indexed in GSC
- **Rankings:** Average position for target keywords
- **Traffic:** Organic sessions per page cluster
- **Conversions:** Free tool → paid offer (goal: 5-10%)

### A/B Tests (Post-Launch)
1. **Title Format:**
   - A: "{Role} Compensation - {Stage} - {Location}"
   - B: "How Much to Pay {Role} at {Stage} Startups ({Location})"

2. **CTA Placement:**
   - A: Above the fold + bottom
   - B: After salary chart + bottom

3. **Chart Style:**
   - A: Bar chart (P25/P50/P75)
   - B: Range chart (min-max with median)

---

## Risk Mitigation

### Duplicate Content
- **Risk:** 20,000 similar pages flagged as thin/duplicate
- **Mitigation:**
  - Unique data per page (different benchmarks)
  - Template variations (rotate intro paragraphs)
  - User-generated content (reviews/ratings in v2)

### Indexing Limits
- **Risk:** Google may not index all 20,000 pages
- **Mitigation:**
  - Prioritize high-value pages first
  - Gradual rollout (not 20K overnight)
  - Build domain authority before mass generation

### Algorithm Updates
- **Risk:** Google algo change penalizes pSEO
- **Mitigation:**
  - Multi-channel acquisition (not just SEO)
  - Email list building
  - Free tools for direct traffic

---

## Next Steps

### Week 1 (Preparation)
- [ ] Finalize role/location/stage taxonomies
- [ ] Create page generation script
- [ ] Design chart templates (salary bars, equity projection)
- [ ] Write FAQ variations (10-15 versions)

### Week 2 (Generate & Deploy)
- [ ] Generate top 1,000 pages
- [ ] Deploy to staging
- [ ] Test page speed, mobile, SEO
- [ ] Submit sitemap to GSC

### Week 3 (Scale)
- [ ] Generate remaining 4,000 pages (Phase 1 total: 5,000)
- [ ] IndexNow submission
- [ ] Monitor indexing rate
- [ ] Fix any crawl errors

### Month 2 (Full Coverage)
- [ ] Generate all 20,000 pages
- [ ] Track rankings for top 100 keywords
- [ ] Optimize low-performing pages
- [ ] A/B test CTAs

---

**Key Principle:** Quality over quantity. Better to have 1,000 well-optimized pages than 20,000 thin ones. Start with Phase 1 (5,000), validate traction, then scale.
