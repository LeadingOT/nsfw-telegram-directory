# Programmatic SEO Skill

**Version:** 1.2.0-directory-factory  
**Status:** Active (used in Directory Factory + RoleOffer)  
**Trigger:** User mentions "programmatic SEO," "build pages at scale," "directory pages"

---

## What This Skill Does

Guides you through creating SEO-optimized pages at scale using templates and data, while avoiding thin content penalties.

**Use cases:**
- Building directory sites (✅ Directory Factory - 12 sites)
- Creating location-specific pages (✅ RoleOffer - 8 locations)
- Generating comparison pages (✅ Directory `/compare/` pages)
- Scaling persona-targeted content (✅ RoleOffer - 5 roles)

---

## Quick Start

### 1. Read the Skill
```bash
cat ~/.openclaw/workspace/skills/programmatic-seo/SKILL.md
```

### 2. Check Current Implementations
```bash
# Directory Factory examples
cat ~/.openclaw/workspace/skills/programmatic-seo/examples/directory-factory-curation.md

# RoleOffer layered approach
cat ~/.openclaw/workspace/skills/programmatic-seo/examples/roleoffer-layered-personas.md
```

### 3. Reference the Playbook
```bash
# Kalash's 12 patterns
cat ~/.openclaw/workspace/skills/programmatic-seo/references/kalash-playbook.md

# Data quality checklist
cat ~/.openclaw/workspace/skills/programmatic-seo/references/data-quality-checklist.md
```

---

## File Structure

```
programmatic-seo/
├── SKILL.md                    # Main skill document
├── README.md                   # This file
├── references/
│   ├── kalash-playbook.md      # 12 pSEO patterns (symlink)
│   └── data-quality-checklist.md
├── examples/
│   ├── directory-factory-curation.md
│   └── roleoffer-layered-personas.md
└── scripts/                    # Workspace scripts (symlinks)
    ├── gsc-auto.mjs           → ~/workspace/scripts/gsc-auto.mjs
    ├── gsc-traffic.mjs        → ~/workspace/scripts/gsc-traffic.mjs
    └── generate_full_dataset.py → ~/workspace/roleoffer-data/
```

---

## How to Use This Skill

### When Working on Directory Factory

**Ask:**
"Use the programmatic-seo skill to add glossary pages to accountingai.tools"

**The skill will:**
1. Check current patterns (Directory, Curation, Comparisons, Profiles)
2. Recommend Glossary pattern (#9)
3. Provide template and data requirements
4. Guide quality checks
5. Monitor indexation via GSC

### When Working on RoleOffer

**Ask:**
"Use the programmatic-seo skill to generate comparison pages for RoleOffer"

**The skill will:**
1. Identify Comparisons pattern (#4)
2. Reference layered-personas example
3. Show how to compare stages/locations/levels
4. Provide Next.js template
5. Validate data uniqueness

---

## Integration with Other Skills

### dataforseo-cli
```bash
# Validate search volume before building pages
dataforseo search-volume "senior software engineer salary series a"
```

### gsc
```bash
# Monitor programmatic pages
node scripts/gsc-traffic.mjs roleoffer.com 7
```

### keyword-research
```bash
# Find patterns worth building
# Example: "best [X] for [Y]" has 10K monthly volume
```

---

## Current Projects Using This Skill

### Directory Factory (12 sites)
- **Patterns:** Directory + Curation + Comparisons + Profiles
- **Scale:** 1,376 pages
- **Status:** ✅ Live, ranking, getting traffic
- **Next:** Add Glossary + Examples patterns

### RoleOffer
- **Patterns:** Personas + Locations (4D layered)
- **Scale:** 17,280 pages (data ready)
- **Status:** ⏳ Data layer complete, building UI
- **Next:** Import to Supabase, generate pages

---

## Key Metrics to Track

### Per Pattern
- Indexation rate (target: >80%)
- Average position (target: <30)
- CTR (target: >2%)
- Engagement (target: >1 min time on page)

### Overall Site
- Total indexed pages
- Organic traffic growth
- Conversion rate from pSEO pages
- Manual actions (target: 0)

---

## Common Workflows

### Adding a New Pattern to Directory Factory

1. **Choose pattern** from 12 options
   ```bash
   cat references/kalash-playbook.md
   ```

2. **Estimate scale**
   - How many pages?
   - What's the data source?
   - What's search volume?

3. **Create template**
   - See `examples/directory-factory-curation.md`
   - Ensure >60% unique content per page

4. **Generate pages**
   - Use existing Astro setup
   - Test 10 pages manually

5. **Submit to GSC**
   ```bash
   node scripts/gsc-auto.mjs sitemap <domain>
   ```

6. **Monitor performance**
   ```bash
   node scripts/gsc-traffic.mjs <domain> 7
   ```

### Expanding RoleOffer Coverage

1. **Add new dimension** (e.g., company size)
   - Update data schema
   - Regenerate dataset
   - Test URL structure

2. **Import to Supabase**
   ```sql
   COPY compensation FROM 'roleoffer_full_dataset.csv' CSV HEADER;
   ```

3. **Build dynamic routes**
   - Next.js 14 `[slug]/page.tsx`
   - SSG for top 1,000 pages
   - ISR for rest

4. **Phased indexing**
   - Week 1: Top 100 pages
   - Week 2: Next 400 pages
   - Week 3: Next 500 pages
   - Monitor crawl budget

---

## Quality Checklist (Before Launch)

From `references/data-quality-checklist.md`:

- [ ] Every page has >60% unique content
- [ ] No placeholder text (`[CITY]`, `{variable}`)
- [ ] Data freshness documented
- [ ] 10% sample review completed
- [ ] User testing feedback incorporated
- [ ] Competitor comparison done
- [ ] Automated quality checks passed
- [ ] GSC monitoring configured

**If all ✅ → Launch**  
**If any ❌ → Fix before indexing**

---

## Troubleshooting

### Problem: Pages not indexing
**Check:**
1. In sitemap? (`curl https://site.com/sitemap.xml`)
2. Crawlable? (`robots.txt` not blocking)
3. Canonical set? (Check `<link rel="canonical">`)
4. Noindex tag? (Search for `noindex` in HTML)

**Solution:**
```bash
node scripts/gsc-auto.mjs sitemap <domain>
```

### Problem: Thin content warning
**Check:**
1. Uniqueness score (<60%?)
2. Word count (<300 words?)
3. Template leakage (placeholder text?)

**Solution:**
- Add more conditional content
- Increase data requirements
- Noindex low-quality pages

### Problem: Keyword cannibalization
**Check:**
1. Multiple pages targeting same keyword
2. Duplicate titles in GSC

**Solution:**
- Consolidate similar pages
- Differentiate more clearly
- Add `noindex` to duplicates

---

## Version History

### 1.2.0-directory-factory (2026-03-02)
- Adapted from coreyhaines31/marketingskills
- Added Directory Factory examples
- Added RoleOffer 4D layering example
- Integrated with workspace scripts
- Added data quality checklist

### 1.1.0 (Original)
- Base skill from GitHub
- 12 pattern playbook
- Quality guidelines

---

## Credits

**Original skill:** coreyhaines31/marketingskills  
**Adapted by:** Builder CEO for Directory Factory + RoleOffer  
**Kalash playbook:** @kalashvasaniya (seoitis.com)  

---

## Next Steps

1. **Add this skill to your workflow:**
   ```
   "Use programmatic-seo skill to..."
   ```

2. **Reference examples when building:**
   - Curation pattern → `examples/directory-factory-curation.md`
   - Layered personas → `examples/roleoffer-layered-personas.md`

3. **Check quality before launch:**
   - `references/data-quality-checklist.md`

4. **Monitor with GSC:**
   ```bash
   node scripts/gsc-traffic.mjs <domain> 7
   ```

---

**Questions? Check `SKILL.md` or ask:**  
"How do I use the programmatic-seo skill for [X]?"
