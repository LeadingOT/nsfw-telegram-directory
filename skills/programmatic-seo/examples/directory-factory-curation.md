# Example: Curation Pattern - Directory Factory

## Pattern: Best [Category]

**Live example:** https://realestateai.tools/best/free-ai-tools-realtors

---

## Implementation

### URL Structure
```
/best/[category]/
/best/free-ai-tools-realtors
/best/property-valuation-ai
/best/virtual-staging-tools
```

### Page Template (Astro)

```astro
---
// src/pages/best/[category].astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import ToolCard from '@/components/ToolCard.astro';

// Get category from URL
const { category } = Astro.params;

// Fetch curated tools for this category
const tools = await getCuratedTools(category);

// Generate metadata
const title = `Best ${formatCategory(category)} for Real Estate Professionals`;
const description = `Discover the top ${tools.length} ${category} tools for real estate agents and brokers. Compare features, pricing, and user ratings.`;
---

<BaseLayout title={title} description={description}>
  <article class="max-w-4xl mx-auto px-4 py-12">
    <!-- Hero Section -->
    <header class="mb-12">
      <h1 class="text-4xl font-bold mb-4">{title}</h1>
      <p class="text-xl text-gray-600">{description}</p>
      
      <!-- Selection Criteria (Unique Content) -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 class="font-semibold mb-2">How We Select</h2>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>User ratings from 500+ real estate professionals</li>
          <li>Feature completeness for {category}</li>
          <li>Value for money (price vs features)</li>
          <li>Integration with popular MLS systems</li>
        </ul>
      </div>
    </header>

    <!-- Curated List (Data-Driven) -->
    <div class="space-y-8">
      {tools.map((tool, index) => (
        <ToolCard 
          tool={tool} 
          rank={index + 1}
          showRanking={true}
          showBestFor={true}
        />
      ))}
    </div>

    <!-- Related Categories (Internal Linking) -->
    <aside class="mt-12 p-6 bg-gray-50 rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Related Categories</h2>
      <div class="grid grid-cols-2 gap-4">
        <a href="/best/property-valuation-ai" class="text-blue-600 hover:underline">
          Property Valuation AI
        </a>
        <a href="/best/virtual-staging-tools" class="text-blue-600 hover:underline">
          Virtual Staging Tools
        </a>
        <!-- More related categories -->
      </div>
    </aside>
  </article>
</BaseLayout>
```

---

## Unique Content Elements

### 1. Selection Criteria
**Why it's unique:** Shows methodology, not just results

```markdown
## How We Select

We evaluate tools based on:
- **User ratings** from 500+ real estate professionals
- **Feature completeness** for [specific use case]
- **Value for money** (price vs features)
- **Integration support** with popular MLS systems
- **Customer support** quality and response time
```

### 2. "Best For" Tags
**Why it's unique:** Use case matching, not generic ranking

```json
{
  "tool": "Reali360",
  "bestFor": ["Large Brokerages", "High-Volume Agents", "Luxury Properties"],
  "notBestFor": ["Solo Agents", "Budget-Conscious Teams"]
}
```

### 3. Comparison Table
**Why it's unique:** Side-by-side feature comparison

| Tool | Price | MLS Integration | Virtual Staging | Mobile App |
|------|-------|-----------------|-----------------|------------|
| Reali360 | $49/mo | ✅ Yes | ✅ Yes | ✅ Yes |
| PropVision | Free | ❌ No | ✅ Yes | ❌ No |
| EstateAI | $29/mo | ✅ Yes | ❌ No | ✅ Yes |

### 4. Pros & Cons
**Why it's unique:** Honest analysis, not pure promotion

```markdown
### Reali360
**Pros:**
- Full MLS integration with 95% of US markets
- Excellent virtual staging quality
- 24/7 customer support

**Cons:**
- Expensive for solo agents ($49/mo)
- Learning curve for advanced features
- No offline mode
```

---

## Data Sources

### Primary Data
- Tool listings from `/data/tools.json`
- User ratings (scraped from Product Hunt, G2)
- Pricing data (updated monthly)

### Enrichment Data
- Category tags (manual curation)
- "Best for" tags (AI-generated + human-reviewed)
- Integration support (scraped from tool websites)

---

## GSC Performance (7 days)

**realestateai.tools/best/free-ai-tools-realtors:**
- **Impressions:** 541
- **Clicks:** 0
- **Average Position:** 14.3
- **CTR:** 0%

**Analysis:**
- 🟡 Position 14.3 = page 2 (room for improvement)
- 🟡 0% CTR = needs better meta description
- ✅ Impressions growing (started at 0 on day 1)

**Next steps:**
- Optimize title: "Best Free AI Tools for Real Estate Agents (2026)"
- Add reviews/testimonials from real agents
- Improve internal linking from homepage

---

## Lessons Learned

### ✅ What Worked
1. **Selection criteria section** - Builds trust
2. **"Best for" tags** - Helps user find right tool
3. **Comparison table** - Visual, scannable
4. **Related categories** - Good internal linking

### ❌ What Didn't Work
1. **Generic intro** - Same across all /best/ pages
2. **No images** - Low engagement
3. **No user testimonials** - Lacks social proof

### 🔄 Improvements Made
1. Added unique intro per category
2. Screenshots of each tool in action
3. Quotes from real estate agents

---

## Variations Across Sites

### accountingai.tools/best/
- Focus on accounting-specific features (bank reconciliation, tax prep)
- Pricing comparison (monthly vs annual)
- Integration with QuickBooks/Xero

### aigirlfriend.tools/best/
- Focus on conversation quality, character variety
- NSFW vs SFW tags
- Subscription pricing models

### hrai.tools/best/
- Focus on ATS integration, candidate tracking
- Compliance features (GDPR, EEO)
- Team size recommendations

**Key insight:** Same template, different data = unique pages

---

## Template Code

See `scripts/generate-curation-pages.js` for full implementation:

```javascript
// Simplified version
async function generateCurationPage(category, tools) {
  const curatedTools = tools
    .filter(t => t.categories.includes(category))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10); // Top 10

  return {
    slug: `best/${slugify(category)}`,
    title: `Best ${category} for [Vertical]`,
    description: `Top ${curatedTools.length} ${category} tools...`,
    tools: curatedTools.map(enrichToolData),
    selectionCriteria: generateCriteria(category),
    relatedCategories: findRelatedCategories(category)
  };
}
```

---

## ROI Analysis

**Investment:**
- Template development: 4 hours
- Data curation: 2 hours per site × 12 sites = 24 hours
- Total: 28 hours

**Output:**
- 60+ curation pages across 12 sites
- Average 200-500 impressions per page (after 7 days)
- Estimated 12K-30K monthly impressions at scale

**Cost per page:** 28h / 60 pages = 28 minutes per page

---

## Next Pattern to Add

Based on this success, next implement:
- **Glossary pages** (`/glossary/[term]`) - Higher volume, educational
- **Examples pages** (`/examples/[type]`) - Shareable, high engagement

See `references/kalash-playbook.md` for full pattern list.
