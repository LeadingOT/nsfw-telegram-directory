# Programmatic SEO Skill - Installation Report

**Date:** 2026-03-02  
**Status:** ✅ Complete  
**Location:** `~/.openclaw/workspace/skills/programmatic-seo/`

---

## What Was Created

### Core Files
- ✅ `SKILL.md` (13KB) - Main skill document, adapted for Directory Factory + RoleOffer
- ✅ `README.md` (7KB) - Usage guide and quick start
- ✅ `INSTALLATION-REPORT.md` (this file)

### References
- ✅ `references/kalash-playbook.md` (symlink) - 12 patterns deep dive
- ✅ `references/data-quality-checklist.md` (8.5KB) - Quality assurance guide

### Examples
- ✅ `examples/directory-factory-curation.md` (7KB) - Curation pattern implementation
- ✅ `examples/roleoffer-layered-personas.md` (17KB) - 4D layering example

### Scripts
- ✅ `scripts/gsc-auto.mjs` (symlink) → workspace scripts
- ✅ `scripts/gsc-traffic.mjs` (symlink) → workspace scripts
- ✅ `scripts/generate_full_dataset.py` (symlink) → roleoffer-data

**Total:** 8 files, ~53KB documentation

---

## Key Features

### 1. Adapted for Our Projects
Not just copied - customized with:
- Directory Factory examples (12 sites)
- RoleOffer 4D layering (17,280 pages)
- Real GSC performance data
- Actual implementation code (Astro + Next.js)

### 2. Integration with Existing Workflow
- Links to workspace scripts
- References to existing data
- Works with dataforseo-cli, gsc, keyword-research skills

### 3. Quality-First Approach
- Data quality checklist
- Uniqueness score calculation
- Common pitfalls guide
- Success metrics

---

## How to Use

### Quick Start
```bash
# Read the skill
cat ~/.openclaw/workspace/skills/programmatic-seo/SKILL.md

# Check examples
cat ~/.openclaw/workspace/skills/programmatic-seo/examples/directory-factory-curation.md
```

### In Conversation
```
"Use the programmatic-seo skill to add glossary pages to accountingai.tools"

"Use programmatic-seo to validate RoleOffer's page structure"

"Check programmatic-seo skill for best practices on location pages"
```

---

## Current State vs. Potential

### What We're Using Now (5/12 patterns)
- ✅ #2 Curation - Directory `/best/` pages
- ✅ #4 Comparisons - Directory `/compare/` pages
- ✅ #6 Locations - RoleOffer (8 cities)
- ✅ #7 Personas - RoleOffer (5 roles)
- ✅ #11 Directory - Directory Factory core
- ✅ #12 Profiles - Directory `/alternatives/`

**Coverage:** 42%

### Quick Wins We Can Add (3 patterns)
- 🎯 #9 Glossary - 120-240 pages (6 hours work)
- 🎯 #5 Examples - 60-120 pages (12 hours work)
- 🎯 #8 Integrations - 80 pages (4 hours work)

**Potential new coverage:** 67% (8/12 patterns)

### Future Expansions
- #1 Templates - If we build downloadable templates
- #3 Conversions - If we add calculators/converters
- #10 Translations - Multi-language support

---

## Success Metrics

### Directory Factory
**Before skill:**
- 1,376 pages
- 9,409 impressions (7 days)
- 27 clicks

**Potential with skill (adding 3 patterns):**
- +360 pages (Glossary + Examples + Integrations)
- +10K-20K impressions (estimated)
- +200-400 clicks (estimated)

### RoleOffer
**Current:**
- 17,280 planned pages
- Data ready (58,752 records)
- 0 impressions (not launched)

**Skill guidance will help:**
- Avoid thin content penalties
- Proper indexing strategy
- Quality-first approach
- Realistic expectations

---

## Integration Points

### With Other Skills
1. **dataforseo-cli** - Validate search volume before building
2. **gsc** - Monitor indexation and performance
3. **keyword-research** - Find high-value patterns
4. **on-page-seo-auditor** - Audit individual pages
5. **technical-seo-checker** - Check technical issues

### With Workspace Scripts
- `scripts/gsc-auto.mjs` - Add domain, verify, submit sitemap
- `scripts/gsc-traffic.mjs` - Get traffic reports
- `roleoffer-data/generate_full_dataset.py` - Generate pSEO data

### With Existing Docs
- `PSEO-PLAYBOOK-KALASH.md` - 12 patterns reference
- `PSEO-OPTIMIZATION-PLAN.md` - Implementation roadmap
- `DIRECTORY-SITES.md` - Current site status

---

## Quality Standards Established

From the skill:

### Content Quality
- **Uniqueness:** >60% unique content per page
- **Word count:** >500 words average
- **Data points:** >10 unique per page
- **Internal links:** >5 per page

### Technical Quality
- Unique titles and meta descriptions
- Proper heading structure
- Schema markup
- Page speed <3s LCP

### Indexation Quality
- In XML sitemap
- Crawlable
- No conflicting noindex
- Canonical tags set

---

## Next Actions

### Immediate (this week)
1. **Use skill to add Glossary pages**
   - accountingai.tools (10 terms)
   - legalai.tools (10 terms)
   - Test pattern, monitor results

2. **Use skill to validate RoleOffer structure**
   - Check 4D layering approach
   - Verify data uniqueness
   - Plan indexing strategy

### Short-term (next 2 weeks)
1. **Add Examples pattern** to top 3 Directory sites
2. **Add Integrations pattern** (auto-generate from listings)
3. **Monitor GSC performance** with skill guidelines

### Long-term (next month)
1. **Expand to all 12 patterns** (where relevant)
2. **Publish skill to ClawHub** (help other users)
3. **Build automation tools** for pattern implementation

---

## Files Created Summary

```
skills/programmatic-seo/
├── SKILL.md (13,363 bytes)
├── README.md (7,229 bytes)
├── INSTALLATION-REPORT.md (this file)
├── references/
│   ├── kalash-playbook.md → /workspace/PSEO-PLAYBOOK-KALASH.md
│   └── data-quality-checklist.md (8,560 bytes)
├── examples/
│   ├── directory-factory-curation.md (7,028 bytes)
│   └── roleoffer-layered-personas.md (16,820 bytes)
└── scripts/
    ├── gsc-auto.mjs → /workspace/scripts/gsc-auto.mjs
    ├── gsc-traffic.mjs → /workspace/scripts/gsc-traffic.mjs
    └── generate_full_dataset.py → /workspace/roleoffer-data/
```

**Total size:** ~53KB documentation  
**Time spent:** ~40 minutes  
**Status:** ✅ Ready to use

---

## Questions?

**To use the skill:**
```
"Use the programmatic-seo skill to [task]"
```

**To reference patterns:**
```
cat ~/.openclaw/workspace/skills/programmatic-seo/references/kalash-playbook.md
```

**To see examples:**
```
cat ~/.openclaw/workspace/skills/programmatic-seo/examples/directory-factory-curation.md
```

---

**Skill created successfully!** 🎉
