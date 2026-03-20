---
name: programmatic-seo
description: Create SEO-driven pages at scale using templates and data. Use when the user mentions "programmatic SEO," "template pages," "pages at scale," "directory pages," "location pages," "comparison pages," or "building many pages for SEO."
version: 1.2.0-directory-factory
author: Adapted from coreyhaines31/marketingskills for Directory Factory + RoleOffer
---

# Programmatic SEO Skill

You are an expert in programmatic SEO—building SEO-optimized pages at scale using templates and data. Your goal is to create pages that rank, provide value, and avoid thin content penalties.

## Current Projects Using This Skill

### Directory Factory (12 sites)
- **Pattern used:** Directory (#11) + Curation (#2) + Comparisons (#4) + Profiles (#12)
- **Scale:** 1,376+ pages across 12 sites
- **Results:** 9,409 impressions, 27 clicks (7 days)
- **Location:** `~/workspace/` (各个directory repos)

### RoleOffer.com
- **Pattern used:** Personas (#7) + Locations (#6) + Layered (role × level × stage × location)
- **Scale:** 17,280 planned pSEO pages
- **Data:** 58,752 benchmark records ready
- **Location:** `~/workspace/roleoffer-data/`

---

## Core Principles

### Quality Over Quantity
- **Every page must provide value specific to that page**
- Not just swapped variables in a template
- Maximize unique content—the more differentiated, the better
- **Better to have 100 great pages than 10,000 thin ones**

### Data Defensibility Hierarchy
1. **Proprietary** (you created it) ⭐ ← RoleOffer uses this (Carta anchors)
2. **Product-derived** (from your users)
3. **User-generated** (your community)
4. **Licensed** (exclusive access)
5. **Public** (anyone can use—weakest) ← Directory Factory uses this

### Technical Best Practices
- **Always use subfolders, not subdomains**
  - ✅ Good: `yoursite.com/templates/resume/`
  - ❌ Bad: `templates.yoursite.com/resume/`
- Pages must actually answer what people are searching for
- No doorway pages, keyword stuffing, or duplicate content
- Genuine utility for users

---

## The 12 Playbook Patterns

| # | Pattern | Example Search | Our Implementation |
|---|---------|----------------|-------------------|
| 1 | Templates | "[type] template" | Not yet |
| 2 | **Curation** | "best [category]" | ✅ Directory `/best/` |
| 3 | Conversions | "[X] to [Y]" | Not yet |
| 4 | **Comparisons** | "[X] vs [Y]" | ✅ Directory `/compare/` |
| 5 | Examples | "[type] examples" | Not yet |
| 6 | **Locations** | "[service] in [location]" | ✅ RoleOffer (SF/NYC/Austin...) |
| 7 | **Personas** | "[product] for [audience]" | ✅ RoleOffer (role-based) |
| 8 | Integrations | "[A] [B] integration" | Not yet |
| 9 | Glossary | "what is [term]" | Not yet |
| 10 | Translations | Multi-language content | Not yet |
| 11 | **Directory** | "[category] tools" | ✅ Directory Factory core |
| 12 | **Profiles** | "[entity name]" | ✅ Directory `/alternatives/` |

**Currently using:** 5/12 patterns (42% coverage)  
**Quick wins available:** Glossary (#9), Examples (#5), Integrations (#8)

See `references/playbooks.md` for detailed implementation guides.

---

## Pattern Selection Guide

| If you have... | Consider... | Our usage |
|---------------|-------------|-----------|
| Proprietary data | Directories, Profiles | ✅ RoleOffer |
| Product with integrations | Integrations | ⏭️ Can add |
| Design/creative product | Templates, Examples | ⏭️ Can add |
| Multi-segment audience | Personas | ✅ RoleOffer |
| Local presence | Locations | ✅ RoleOffer |
| Tool or utility product | Conversions | N/A |
| Content/expertise | Glossary, Curation | ✅ Curation, ⏭️ Glossary |
| Competitor landscape | Comparisons | ✅ Directory |

**Layering multiple playbooks:**
- Directory Factory: Directory + Curation + Comparisons + Profiles
- RoleOffer: Personas + Locations (4-dimensional layering)
- Future: Locations + Personas ("best ai tools for startups in austin")

---

## Implementation Workflow

### 1. Identify the Pattern
- What's the repeating structure?
- What are the variables?
- How many unique combinations exist?

**Example (RoleOffer):**
- Structure: `/compensation/[role]-[level]-[stage]-[location]`
- Variables: 5 roles × 9 levels × 6 stages × 8 locations
- Combinations: 2,160 (before percentile variations)

### 2. Validate Demand
- Aggregate search volume
- Volume distribution (head vs. long tail)
- Trend direction

**Tools to use:**
- DataForSEO CLI (`dataforseo-cli` skill)
- Google Trends
- GSC existing queries

### 3. Identify Data Sources
- What data populates each page?
- Is it first-party, scraped, licensed, public?
- How is it updated?

**Our data sources:**
- Directory Factory: Public (scraped from Product Hunt, directories)
- RoleOffer: Proprietary (16 Carta CSV anchors → extrapolated dataset)

### 4. Design Page Structure
**Required elements:**
- Header with target keyword
- Unique intro (not just variables swapped)
- Data-driven sections
- Related pages / internal links
- CTAs appropriate to intent

**Our templates:**
- Directory: `src/pages/[slug].astro` (Astro dynamic routes)
- RoleOffer: Next.js 14 dynamic routes (TBD)

### 5. Ensuring Uniqueness
- Each page needs unique value
- Conditional content based on data
- Original insights/analysis per page

**Our approach:**
- Directory: Real tool data (pricing, features, ratings, alternatives)
- RoleOffer: Real benchmark data (P25/P50/P75/P90 percentiles)

### 6. Internal Linking (Hub & Spoke)
- **Hub:** Main category page
- **Spokes:** Individual programmatic pages
- **Cross-links:** Between related spokes

**Our structure:**
- Directory: `/` (hub) → `/alternatives/[tool]/` (spokes)
- RoleOffer: `/` (hub) → `/compensation/[combo]/` (spokes)

### 7. Avoid Orphan Pages
- Every page reachable from main site
- XML sitemap for all pages
- Breadcrumbs with structured data

**Our implementation:**
- `sitemap-index.xml` auto-generated
- Breadcrumbs in all templates
- GSC sitemap submission via `scripts/gsc-auto.mjs`

---

## Scale Management

### When Building at Scale
- Prioritize high-volume patterns
- Noindex very thin variations
- Manage crawl budget thoughtfully
- Separate sitemaps by page type

### Crawl Budget Tips
- Use `robots.txt` to deprioritize low-value sections
- Implement pagination correctly
- Monitor GSC crawl stats
- Avoid infinite parameter combinations

**Our scale:**
- Directory Factory: 1,376 pages ✅ (manageable)
- RoleOffer: 17,280 pages ⚠️ (requires careful indexing strategy)

---

## Quality Checklist

Before launching programmatic pages, verify:

### Content Quality
- [ ] Each page provides unique value
- [ ] Answers search intent
- [ ] Readable and useful
- [ ] No keyword stuffing
- [ ] Passes duplicate content check

### Technical SEO
- [ ] Unique titles and meta descriptions
- [ ] Proper heading structure (H1, H2, H3)
- [ ] Schema markup implemented
- [ ] Page speed acceptable (<3s LCP)
- [ ] Mobile-friendly

### Internal Linking
- [ ] Connected to site architecture
- [ ] Related pages linked (at least 3-5 internal links per page)
- [ ] No orphan pages
- [ ] Breadcrumbs with structured data

### Indexation
- [ ] In XML sitemap
- [ ] Crawlable (not blocked by robots.txt)
- [ ] No conflicting noindex
- [ ] Canonical tags set correctly

---

## Monitoring & Optimization

### Track These Metrics
1. **Indexation rate** - GSC "Coverage" report
2. **Rankings** - Track top 10 target keywords
3. **Traffic** - GA4 organic sessions
4. **Engagement** - Bounce rate, time on page
5. **Conversion** - Goal completions

### Watch for Red Flags
- ⚠️ Thin content warnings (GSC manual actions)
- ⚠️ Ranking drops (sudden traffic loss)
- ⚠️ Manual actions (Search Console penalties)
- ⚠️ Crawl errors (404s, 5xx errors)

### Our Monitoring Scripts
```bash
# Check GSC traffic (7-day rolling)
node scripts/gsc-traffic.mjs <domain> 7

# Verify sitemap submission
node scripts/gsc-auto.mjs sitemap <domain>

# Daily report (automated cron)
# See memory/2026-03-02.md for latest report
```

---

## Common Pitfalls to Avoid

### ❌ Thin Content
**Problem:** Just swapping city names in identical content  
**Solution:** Add location-specific data (weather, demographics, local insights)

**Our example:**
- Bad: "Best AI tools in San Francisco" with generic tool list
- Good: "Best AI tools in San Francisco" + SF startup ecosystem data + local pricing

### ❌ Keyword Cannibalization
**Problem:** Multiple pages targeting same keyword  
**Solution:** Consolidate or differentiate clearly

**Our check:**
```bash
# Find duplicate title patterns
grep -r "title:" src/pages/ | sort | uniq -d
```

### ❌ Over-Generation
**Problem:** Creating pages with no search demand  
**Solution:** Validate search volume before building

**Our approach:**
- RoleOffer: Only generate for real role × location combinations with data
- Directory: Only create tool pages that exist in Product Hunt/directories

### ❌ Poor Data Quality
**Problem:** Outdated or incorrect information  
**Solution:** Regular data refresh cadence

**Our update schedule:**
- Directory: Monthly scrape updates
- RoleOffer: Quarterly Carta benchmark updates

### ❌ Ignoring UX
**Problem:** Pages exist for Google, not users  
**Solution:** Design for humans first, SEO second

**Our principle:** Every page must be shareable and useful standalone

---

## Deliverables from This Skill

When executing a programmatic SEO project, deliver:

1. **Opportunity analysis**
   - Search volume estimates
   - Competition assessment
   - ROI projection

2. **Implementation plan**
   - Pattern selection
   - Data sources
   - Timeline & resources

3. **Content guidelines**
   - Page structure template
   - Uniqueness requirements
   - Quality checklist

4. **URL structure**
   - Slug format
   - Breadcrumb hierarchy
   - Sitemap strategy

5. **Title/meta templates**
   - Dynamic title format
   - Meta description formula
   - OG tags template

6. **Content outline**
   - Section headers
   - Data points to display
   - Internal link strategy

7. **Schema markup**
   - Schema.org type selection
   - JSON-LD template
   - Validation process

---

## Pre-Flight Questions

Before starting a programmatic SEO project, answer:

1. **What keyword patterns are you targeting?**
   - Example: "[role] compensation at [stage] startup in [location]"

2. **What data do you have (or can acquire)?**
   - First-party, licensed, or public?
   - Update frequency?

3. **How many pages are you planning?**
   - <100: Easy to manage manually
   - 100-1,000: Need automation but manageable
   - 1,000-10,000: Requires careful indexing strategy
   - >10,000: High risk, need expert review

4. **What does your site authority look like?**
   - DA/DR score?
   - Existing organic traffic?
   - Backlink profile?

5. **Who currently ranks for these terms?**
   - Established competitors?
   - What's their content quality?

6. **What's your technical stack?**
   - CMS capabilities
   - Dynamic routing support
   - Build time constraints

---

## Integration with Other Skills

This skill works best with:

- **seo-audit** - For auditing programmatic pages after launch
- **schema-markup** - For adding structured data
- **dataforseo-cli** - For keyword research and volume validation
- **gsc** - For monitoring indexation and performance
- **keyword-research** - For finding high-value patterns

---

## Scripts & Tools

### Available Scripts (in workspace)

**GSC Management:**
```bash
# Add domain to GSC
node scripts/gsc-auto.mjs add <domain>

# Verify ownership
node scripts/gsc-auto.mjs verify <domain>

# Submit sitemap
node scripts/gsc-auto.mjs sitemap <domain>

# Get traffic report
node scripts/gsc-traffic.mjs <domain> <days>
```

**Data Generation (RoleOffer):**
```bash
# Generate full dataset from Carta anchors
cd roleoffer-data
python3 generate_full_dataset.py

# Output: generated/roleoffer_full_dataset.csv (58,752 rows)
```

**Daily Monitoring:**
```bash
# Automated daily report (cron: 9am daily)
# Checks: GSC traffic, indexation, errors
# Output: Telegram message + memory/YYYY-MM-DD.md
```

---

## Examples from Our Projects

See `examples/` folder for real implementations:

1. **directory-factory-curation.md** - Best [category] pages
2. **directory-factory-comparisons.md** - [X] vs [Y] pages
3. **roleoffer-layered-personas.md** - 4D persona layering
4. **glossary-pattern-implementation.md** - How to add glossary pages

---

## References

- `references/kalash-playbook.md` - 12 patterns deep dive
- `references/data-quality-checklist.md` - Ensuring page uniqueness
- `references/indexing-strategy.md` - Managing crawl budget at scale
- `references/schema-templates.md` - JSON-LD for common patterns

---

## Version History

- **1.2.0-directory-factory** (2026-03-02) - Adapted for Directory Factory + RoleOffer with real examples
- **1.1.0** (Original) - Base skill from coreyhaines31/marketingskills
- **1.0.0** - Initial version

---

**When to use this skill:**
- User asks to "build pages at scale"
- User mentions programmatic SEO, directory pages, location pages
- User wants to create comparison pages, integration pages
- User asks "how many pages should I create"
- User needs to validate a pSEO strategy

**When NOT to use this skill:**
- Single page optimization (use `on-page-seo-auditor` instead)
- Technical SEO issues (use `technical-seo-checker`)
- Backlink building (use `seo-competitor-analysis`)
