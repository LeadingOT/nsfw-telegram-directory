# Data Quality Checklist for Programmatic SEO

## Purpose
Ensure each programmatic page provides unique value and avoids thin content penalties.

---

## Pre-Generation Validation

### Data Completeness
- [ ] Every page variable has real data (no placeholder text)
- [ ] Missing data handled gracefully (show "N/A" or hide section)
- [ ] Data freshness documented (last updated date)

### Data Accuracy
- [ ] Source data validated (no broken URLs, incorrect numbers)
- [ ] Currency/units consistent across pages
- [ ] Dates formatted correctly (YYYY-MM-DD)

### Data Uniqueness
- [ ] Each page has at least 3 unique data points
- [ ] Content varies based on conditional logic, not just variable swaps
- [ ] Original insights or analysis per page

---

## Content Uniqueness Score

Calculate uniqueness score for each page:

```
Uniqueness Score = (Unique Words / Total Words) × 100%

Target: >60% unique content per page
Warning: 40-60% - review for thin content
Reject: <40% - too similar to template
```

### How to Calculate
```bash
# Compare two pages
diff -u page1.html page2.html | grep "^+" | wc -l
```

---

## Page-Specific Value Test

Ask for each page:

1. **Could a human write this manually?**
   - If yes → Good (real insights)
   - If no → Bad (pure template)

2. **Would I share this page?**
   - If yes → Good (useful content)
   - If no → Bad (low value)

3. **Does this answer search intent?**
   - If yes → Good (matches query)
   - If no → Bad (SEO bait)

4. **Is this better than competitors?**
   - If yes → Good (differentiated)
   - If no → Bad (me-too content)

---

## Red Flags (Thin Content Indicators)

### 🚩 Template Leakage
- Variable names visible: `[CITY]`, `{location}`
- Placeholder text: "Lorem ipsum", "Coming soon"
- Generic statements: "This is one of the best..."

### 🚩 Duplicate Patterns
- Same intro across 100+ pages
- Only city/product name changes
- Identical CTAs on every page

### 🚩 Low Information Density
- Word count <300 words
- Fluff content ("As you know...", "In today's world...")
- No specific data points or examples

### 🚩 Poor User Experience
- Page feels machine-generated
- No visual breaks (walls of text)
- CTAs don't match page content

---

## Data Quality by Pattern

### Directory Pattern
**Required unique elements:**
- Tool description (not copied from website)
- Feature comparison (at least 5 features)
- Pricing data (specific numbers)
- User reviews (real quotes)
- Alternatives (at least 3 related tools)

**Example (aigirlfriend.tools):**
- ✅ Tool name, tagline, URL, pricing
- ✅ Features list (5-10 items)
- ✅ Alternatives (3-5 related tools)
- ✅ Comparison table (this vs alternatives)

### Curation Pattern ("Best X")
**Required unique elements:**
- Selection criteria (why these tools?)
- Ranking methodology (how did you score?)
- Use case matching (which is best for what?)
- Update timestamp (when was this reviewed?)

**Example (best free real estate AI tools):**
- ✅ "Best for" tags (budgeting, visualization, etc.)
- ✅ Pros/cons for each tool
- ✅ Pricing breakdown
- ✅ User ratings (if available)

### Comparison Pattern ("X vs Y")
**Required unique elements:**
- Side-by-side feature table
- Pricing comparison
- Use case recommendations ("Choose X if..., Choose Y if...")
- Expert opinion or user testimonials

### Personas Pattern ("X for Y")
**Required unique elements:**
- Persona-specific pain points
- Tailored feature highlights
- Industry-specific examples
- Testimonials from that persona

**Example (RoleOffer - senior engineer @ SF):**
- ✅ Role-specific salary data (IC4 benchmarks)
- ✅ Location adjustment (SF 1.00x multiplier)
- ✅ Stage-specific equity % (Series A vs B)
- ✅ Level comparison (IC4 vs IC5)

### Locations Pattern ("X in Y")
**Required unique elements:**
- Location-specific data (population, demographics)
- Local market insights (cost of living, job market)
- Geographic relevance (why this location matters)
- Map or local imagery

**Example (RoleOffer - compensation in SF):**
- ✅ SF cost of living context
- ✅ Comparison to other tech hubs (NYC, Austin)
- ✅ Local market trends (hiring activity)
- ✅ Negotiation tips for SF market

---

## Data Refresh Strategy

### Update Frequency by Pattern

| Pattern | Refresh Cadence | Why |
|---------|----------------|-----|
| Directory | Monthly | New tools launch |
| Curation ("Best") | Quarterly | Rankings change |
| Comparisons | Quarterly | Features/pricing change |
| Personas | Bi-annually | Market shifts slowly |
| Locations | Annually | Geo data stable |
| Glossary | As needed | Definitions stable |

### Automated vs Manual Updates

**Automated (API/scrape):**
- Pricing updates
- User ratings/reviews
- Feature availability
- Product status (active/inactive)

**Manual (human review):**
- Editorial rankings
- Expert opinions
- Use case recommendations
- Content quality

---

## Quality Assurance Process

### 1. Sample Review (10% of pages)
- Randomly select 10% of generated pages
- Manual review for quality
- Calculate average uniqueness score
- Identify common issues

### 2. Outlier Detection
- Find pages with <40% uniqueness
- Check for data quality issues
- Fix or noindex low-quality pages

### 3. User Testing
- Share 5 pages with real users
- Ask: "Would you share this?"
- Collect feedback on usefulness
- Iterate on template

### 4. Competitor Comparison
- Compare your page to #1 ranking competitor
- Identify gaps in your content
- Add missing elements
- Ensure parity or better

---

## Data Quality Tools

### Automated Checks
```bash
# Check for placeholder text
grep -r "\[CITY\]" dist/

# Find duplicate titles
grep -r "<title>" dist/ | sort | uniq -d

# Check word count distribution
find dist/ -name "*.html" -exec wc -w {} \; | sort -n
```

### Manual Spot Checks
1. Open 10 random pages
2. Read as a user (not SEO)
3. Ask: "Is this helpful?"
4. Document issues

### GSC Monitoring
- Check "Coverage" for thin content warnings
- Monitor "Manual Actions" tab
- Track "Enhancements" for issues

---

## Remediation Plan

If quality issues detected:

### Minor Issues (40-60% unique)
- Add conditional content sections
- Include more data-driven insights
- Expand with related topics

### Major Issues (<40% unique)
- Noindex until fixed
- Complete template rewrite
- Add substantial unique content

### Scale Issues (>1000 thin pages)
- Consolidate similar pages
- Increase data requirements per page
- Reduce total page count

---

## Success Metrics

### Data Quality KPIs
- **Uniqueness Score:** >60% average
- **Word Count:** >500 words average
- **Internal Links:** >5 per page
- **Data Points:** >10 unique per page

### Engagement Metrics (post-launch)
- **Bounce Rate:** <70%
- **Time on Page:** >1 minute
- **Pages per Session:** >1.5

### SEO Metrics
- **Indexation Rate:** >80%
- **No Manual Actions:** 0
- **Ranking Pages:** >50% in top 100

---

## Directory Factory Examples

### ✅ High Quality Example
**Page:** aigirlfriend.tools/alternatives/ourdream-ai/

**Why it works:**
- Unique tool description
- Real feature list (7 items)
- Pricing data ($9.99/mo)
- 4 alternatives with comparison
- User intent: "What is OurDream AI and what are alternatives?"

**Uniqueness score:** 78%

### ❌ Low Quality Example (hypothetical)
**Page:** aigirlfriend.tools/alternatives/[tool-123]/

**Why it fails:**
- Generic description: "This is an AI girlfriend tool"
- No specific features
- "Pricing: See website"
- No alternatives listed
- Placeholder text visible

**Uniqueness score:** 22%

---

## RoleOffer Examples

### ✅ High Quality Example
**Page:** /compensation/senior-software-engineer-series-a-san-francisco

**Why it works:**
- Specific salary data (P25: $136K, P50: $156K, P75: $188K)
- Equity % (P50: 0.0516%)
- Total cash comp breakdown
- Comparison to other stages/levels
- Negotiation tips for this specific combo

**Uniqueness score:** 85%

### ❌ Low Quality Example (hypothetical)
**Page:** /compensation/[role]-[stage]-[location]

**Why it fails:**
- Generic text: "Salaries vary by role and location"
- No specific numbers
- Same template across all pages
- No actionable insights

**Uniqueness score:** 15%

---

## Summary Checklist

Before launching programmatic pages:

- [ ] Every page has >60% unique content
- [ ] No placeholder text or template leakage
- [ ] Data freshness documented
- [ ] 10% sample review completed
- [ ] User testing feedback incorporated
- [ ] Competitor comparison done
- [ ] Automated quality checks passed
- [ ] GSC monitoring configured

**If all ✅ → Launch**  
**If any ❌ → Fix before indexing**
