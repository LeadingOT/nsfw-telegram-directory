# New Directory Site Checklist

**⚠️ 每次创建新Directory站必须完成所有步骤！**

## Phase 1: 建站前准备

- [ ] Keyword research (DataForSEO CLI)
- [ ] Domain available check
- [ ] 确定TLD策略 (.tools/.info/.com)
- [ ] 准备20-30个listings数据
- [ ] 准备categories & tags

## Phase 2: 技术部署

### 基础设施
- [ ] 创建GitHub repo (LeadingOT org)
- [ ] 复制template from existing site
- [ ] 更新site URL in astro.config.mjs
- [ ] 更新brand name & colors

### 必备功能（100%必须）
- [ ] **AI Search (DeepSeek V3 + Brave)** ⚠️ 必须！
  - [ ] `src/pages/api/ai-search.ts`
  - [ ] `src/components/AISearch.astro`
  - [ ] BaseLayout integration
  - [ ] Site-specific placeholder
- [ ] Google Analytics (G-KX2K3KGZVY for all sites)
- [ ] Microsoft Clarity (vp34qa3vrm for all sites)
- [ ] Schema.org markup
- [ ] Sitemap generation
- [ ] RSS feed

### SEO优化
- [ ] CTR-optimized titles (数字 + 痛点 + 收益)
- [ ] Meta descriptions (<155字符)
- [ ] Canonical URLs
- [ ] Open Graph tags
- [ ] Twitter cards

### pSEO Pages
- [ ] Homepage (overview)
- [ ] /best/ pages (curation)
- [ ] /compare/ pages (comparisons)
- [ ] /alternatives/[tool] (profiles)
- [ ] /category/[cat] (filters)
- [ ] /listing/[slug] (detail pages)

## Phase 3: Vercel部署

- [ ] 创建Vercel project (via API or dashboard)
- [ ] 连接GitHub repo
- [ ] 配置domain (realtime DNS)
- [ ] 配置environment variables (if needed)
- [ ] 首次deployment测试
- [ ] **测试AI Search API endpoint** ⚠️
- [ ] 验证所有pages可访问

## Phase 4: GSC & Indexing

- [ ] Add site to GSC
- [ ] Verify ownership (service account)
- [ ] Submit sitemap
- [ ] Request indexing for top 10 pages
- [ ] Monitor crawl errors

## Phase 5: Quality Check

- [ ] Lighthouse score >90
- [ ] PageSpeed <1s load time
- [ ] Mobile-friendly test
- [ ] Schema markup validation
- [ ] **AI Search功能测试（3 queries）** ⚠️
  - [ ] "best free [category]"
  - [ ] "[tool A] vs [tool B]"
  - [ ] "is [tool] worth it"
- [ ] 所有internal links work
- [ ] No 404 errors

## Phase 6: Launch

- [ ] Update DIRECTORY-SITES.md
- [ ] Update MEMORY.md (add to site list)
- [ ] Monitor first 24h traffic
- [ ] Check GSC indexing progress
- [ ] 社交媒体announce (optional)

---

## AI Search Deployment Script

**Quick deploy (automated):**
```bash
bash scripts/deploy-ai-search-to-new-site.sh <site-directory-name>
```

**Manual deploy:**
1. Copy files from accountingai-directory:
   - `src/pages/api/ai-search.ts`
   - `src/components/AISearch.astro`
2. Update placeholder in AISearch.astro
3. Add `<AISearch />` to BaseLayout.astro
4. Verify astro.config.mjs has `output: 'server'`
5. Build test: `npm run build`
6. Git commit & push

---

## Common Mistakes to Avoid

❌ **忘记部署AI Search** - 这是核心differentiator！  
❌ **使用static mode** - API routes需要`output: 'server'`  
❌ **Schema markup语法错误** - 会显示在页面上  
❌ **Vercel未连接GitHub** - push不会触发deployment  
❌ **GSC service account权限** - 需要Bill添加  
❌ **Placeholder generic** - 要site-specific  

---

## Success Metrics (30天内)

- [ ] GSC impressions >1000/周
- [ ] GSC clicks >10/周
- [ ] AI Search usage >50 queries/周
- [ ] PageSpeed score >90
- [ ] Zero critical errors in GSC

---

**记住：AI Search不是optional，是every single site的standard feature！**
