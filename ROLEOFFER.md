# ROLEOFFER.md - Project Roadmap

## 项目概况

**域名:** roleoffer.com (已注册)  
**定位:** Lightweight startup compensation tool - 对标Pave/Carta，价格低100倍  
**商业模式:** 按offer收费 $49-99/份，不需用户share数据  
**Tech Stack:** Next.js 14 + Supabase + GPT-4o-mini + Airwallex  
**pSEO规模:** 20,000+页面 (50 roles × 5 levels × 4 stages × 20 cities)

---

## Phase 1: Build MVP (Week 1-2)

### 🔨 Core Features

#### 1. Comp Benchmark Report
- [ ] 输入表单：Role, Level (IC1-IC6/M1-M3), Location, Stage, Industry
- [ ] 数据查询逻辑：从Supabase查P25/P50/P75
- [ ] UI组件：Salary range chart (Recharts)
- [ ] Equity range计算 + vesting建议
- [ ] Total comp估算公式
- [ ] 数据来源标注（transparency badge）

#### 2. Offer Letter PDF Generator
- [ ] 预设模板：Engineering, Product, Design, Sales, Marketing, Ops
- [ ] PDF生成引擎：React-PDF or Puppeteer
- [ ] 动态字段填充：base, equity grant, vesting (4yr/1yr cliff), benefits
- [ ] "Powered by RoleOffer" watermark
- [ ] Download + email功能

#### 3. Equity Value Projection
- [ ] 输入：company valuation, equity %, expected growth
- [ ] 3 scenario计算：conservative/base/optimistic
- [ ] 1yr/2yr/4yr equity价值timeline
- [ ] Shareable独立页面（带RoleOffer品牌）
- [ ] Chart可视化

#### 4. Negotiation Talk Points (AI)
- [ ] GPT-4o-mini prompt engineering
- [ ] 输入：benchmark data + candidate profile
- [ ] 输出：percentile对比 + equity pitch script + FAQ answers
- [ ] Markdown格式，可复制

---

### 📊 Data Layer

#### Data Sources (免费)
- [ ] **H1B Salary Data** — scrape h1bdata.info (Python script)
- [ ] **Salary Transparency Job Postings** — scrape Indeed/LinkedIn (CA/CO/NY/WA)
- [ ] **levels.fyi** — 公开数据API/scrape
- [ ] **BLS API** — Bureau of Labor Statistics
- [ ] **Equity Benchmarks** — SaaStr/Kruze公开报告 + Carta State of Comp PDFs

#### Data Processing Pipeline
- [ ] 统一role taxonomy (mapping titles → standard levels)
- [ ] 多源加权平均 → P25/P50/P75 percentile
- [ ] Supabase schema设计：
  ```sql
  -- roles: id, title, category, level
  -- locations: id, city, state, country
  -- stages: id, name (Seed/A/B/C)
  -- comp_data: role_id, level, location_id, stage_id, p25, p50, p75, equity_pct, updated_at
  ```
- [ ] ETL脚本：scrape → clean → transform → load
- [ ] Cron job：每周自动更新

#### Initial Data Import
- [ ] 下载H1B dataset (2023-2024)
- [ ] Scrape levels.fyi top 500 companies
- [ ] 导入BLS occupational wage data
- [ ] 手动整理equity benchmark (50 role/stage组合)
- [ ] 验证数据质量（至少1000个role × location × stage组合有数据）

---

### 🌐 pSEO Engine

#### URL Structure
```
/compensation/{role}-{level}-{stage}-{location}
例如：/compensation/senior-software-engineer-series-a-san-francisco
```

#### Auto-Generated Pages
每页包含：
- [ ] **H1**: "{Role} Compensation at {Stage} Startups in {Location} (2026)"
- [ ] Salary range chart (P25/P50/P75 bar chart)
- [ ] Equity range + typical vesting
- [ ] Total comp估算表格
- [ ] vs FAANG对比 (if applicable)
- [ ] CTA: "Generate a complete offer package → $49"
- [ ] FAQ section (3-5 questions, schema markup)
- [ ] Breadcrumb navigation
- [ ] Related pages (same role different locations, etc.)

#### Page Generation Strategy
- [ ] **Phase 1**: Top 5,000页（高流量组合）
  - 20 top roles × 5 levels × 4 stages × 10 top cities = 4,000
  - + 1,000手动挑选的长尾组合
- [ ] **Phase 2**: 扩展到20,000页（全覆盖）
- [ ] 使用Next.js ISR (Incremental Static Regeneration)
- [ ] Sitemap generation + IndexNow auto-submit

#### SEO Optimization
- [ ] Title template: "{Role} {Level} Compensation - {Stage} Startup - {Location} | RoleOffer"
- [ ] Meta description template (155 chars)
- [ ] JSON-LD schema: FAQPage + Article
- [ ] Internal linking: 每页link到相关5-10页
- [ ] Image optimization: chart → WebP, lazy load
- [ ] Core Web Vitals优化：LCP <2.5s, CLS <0.1

---

### 🎁 Free Tools (Lead Gen)

#### Tool 1: Startup Offer Calculator
- [ ] 简化表单：role + location + stage (不需level)
- [ ] 输出：模糊salary range (不显示P25/P50/P75)
- [ ] CTA: "Get precise data + offer letter → $49"
- [ ] 无需注册，立即可用

#### Tool 2: "Is My Offer Fair?" (Candidate-facing)
- [ ] 输入：offer details (base + equity + title + location)
- [ ] 输出：percentile ranking ("Your offer is better than 68% of similar roles")
- [ ] 病毒传播：candidate → hiring manager
- [ ] CTA: "Hiring managers: Get data-backed offers → $49"

#### Tool 3: Equity Value Calculator
- [ ] 输入：equity shares, strike price, current valuation, expected growth
- [ ] 输出：3 scenarios (conservative/base/optimistic) × 3 timeframes (1/2/4yr)
- [ ] Chart可视化
- [ ] Shareable link

---

### 💳 Payment Integration

- [ ] Airwallex payment link setup (不是Stripe)
- [ ] Pricing: $49 (basic) / $79 (premium with scenarios) / $99 (bulk 3-pack)
- [ ] Payment flow: Select package → Airwallex → Email PDF + access link
- [ ] No user account needed (v1)
- [ ] Receipt auto-email

---

### 🎨 Landing Page

#### Sections
- [ ] **Hero**: "Draft startup offers in 30 seconds. $49 per offer. No data sharing required."
- [ ] **Problem**: Pave/Carta太贵 + 需要share数据 + setup复杂
- [ ] **Solution**: RoleOffer = instant + affordable + private
- [ ] **Comparison Table**: RoleOffer vs Pave vs Carta
  - Price: $49 vs $10K+ vs $25K+
  - Setup time: 30 sec vs 2 weeks vs 1 month
  - Data sharing: No vs Yes vs Yes
- [ ] **Demo**: GIF/video showing 30-second workflow
- [ ] **Free Tools**: 3个calculator的入口
- [ ] **Testimonials**: (等有客户后补充)
- [ ] **FAQ**: 8-10个问题
- [ ] **CTA**: "Try Free Calculator" + "Generate Offer $49"

#### Design
- [ ] Clean, minimal, fast
- [ ] shadcn/ui components
- [ ] Tailwind CSS
- [ ] Mobile-first responsive
- [ ] Dark mode support

---

## Phase 2: Launch (Week 3)

### 🚀 Deployment
- [ ] Deploy到Vercel (roleoffer.com)
- [ ] 配置custom domain + SSL
- [ ] GA4 setup (创建property)
- [ ] GSC验证 + sitemap提交
- [ ] IndexNow推送前5,000页
- [ ] robots.txt + sitemap.xml
- [ ] 404/500 error pages

### 📢 Launch Channels
- [ ] **Product Hunt**: 准备assets (logo, screenshots, demo video)
- [ ] **YC Launch**: submit到YC Launch
- [ ] **Indie Hackers**: post到IH community
- [ ] **Hacker News**: Show HN post
- [ ] **Twitter/X**: Bill发布 + tag相关founder accounts
- [ ] **LinkedIn**: Bill个人post
- [ ] **Slack/Discord**: 相关founder/HR communities (SaaStr, OnDeck, etc.)

### 🎯 Initial Marketing
- [ ] 写3篇SEO博客：
  - "How to Create a Startup Offer Letter in 2026"
  - "Startup Compensation Benchmarks: Complete Guide"
  - "Equity vs Salary: What Should Startups Offer?"
- [ ] Submit到startup directories (BetaList, Launching Next, etc.)
- [ ] Email 20-30个founder朋友要feedback

---

## Phase 3: Growth & Iteration (Week 4+)

### 📊 Metrics to Track
- [ ] **Revenue** (primary KPI): Daily/Weekly/Monthly
- [ ] **Conversion funnel**:
  - Free tool users
  - Paid conversions
  - Conversion rate
- [ ] **Traffic**:
  - GA4 sessions/users
  - pSEO页面 impressions (GSC)
  - Top landing pages
- [ ] **SEO**:
  - Page 1 rankings count
  - Average position for target keywords
  - Indexing rate (pages submitted vs indexed)

### 🔄 Iteration Loop
- [ ] A/B测试pricing: $49 vs $79 vs $99
- [ ] 收集客户反馈：post-purchase survey
- [ ] 优化conversion rate：
  - Landing page CTA位置
  - Free tool → paid transition
  - Payment flow摩擦点
- [ ] 添加新功能（基于feedback）：
  - Multiple offer packages
  - Team access (v2)
  - Custom branding (remove watermark for $149)

### 📈 Growth Tactics
- [ ] **Content Marketing**:
  - 每周1篇SEO博客
  - Guest posts on founder blogs
  - 回答Quora/Reddit关于startup comp的问题
- [ ] **pSEO扩展**:
  - 每周生成500-1,000新页面
  - 监控哪些role/location组合流量高 → 优先生成相似页
- [ ] **Backlink建设**:
  - Submit到HR resource lists
  - Founder community directories
  - SaaS review sites
- [ ] **Partnership**:
  - 联系accelerators (YC, Techstars) → offer free tool
  - HR SaaS (Rippling, Gusto) → referral partnership
  - VC firms → recommend to portfolio companies

---

## Revenue Targets

### Month 1 (Launch)
- **Target**: $0-500
- **Goal**: Validation - 至少10个付费客户
- **Focus**: Product-market fit signals

### Month 2
- **Target**: $1,000-2,000
- **Goal**: Consistent conversion - 每周5-10个付费
- **Focus**: SEO开始见效，优化conversion funnel

### Month 3
- **Target**: $5,000+
- **Goal**: Scalable growth - 找到可重复的增长渠道
- **Focus**: 自动化内容生成，扩大pSEO覆盖

### Month 6
- **Target**: $15,000-20,000 MRR
- **Goal**: Sustainable business - 考虑是否全职投入
- **Focus**: 产品迭代（team features, API, integrations）

---

## Tech Debt & Future Features (Post-MVP)

### v2.0 Features (if revenue validates)
- [ ] User accounts + dashboard
- [ ] Save/manage multiple offer packages
- [ ] Team collaboration (share offers with co-founders)
- [ ] Custom comp bands (company-specific benchmarks)
- [ ] HRIS integrations (BambooHR, Gusto, Rippling)
- [ ] API access for programmatic offer generation
- [ ] White-label solution for VCs/accelerators

### Infrastructure Improvements
- [ ] Redis caching for benchmark queries
- [ ] CDN for static assets (Cloudflare)
- [ ] Database read replicas for scale
- [ ] Automated data refresh pipeline (Airflow/Prefect)
- [ ] Monitoring: Sentry + Datadog
- [ ] Rate limiting + abuse prevention

---

## Risks & Mitigation

### Risk 1: Data质量/准确性
- **Mitigation**: 多源验证，显示数据来源，定期人工review异常值
- **Disclaimer**: "Benchmarks are estimates based on public data"

### Risk 2: 法律问题（comp data可能敏感）
- **Mitigation**: 只用公开数据源，aggregate数据（不显示个别公司），咨询lawyer if revenue >$5K/mo

### Risk 3: 竞争（Pave/Carta可能推出low-cost版本）
- **Mitigation**: 速度优势（first mover in $49 segment），pSEO护城河，pivot to enterprise if needed

### Risk 4: SEO算法变化
- **Mitigation**: 20,000页提供redundancy，多渠道获客（不只依赖SEO），build email list

---

## Success Criteria

### Week 2 (MVP完成)
- ✅ 网站可访问，核心功能work
- ✅ 至少1,000页pSEO上线
- ✅ 3个免费工具可用
- ✅ Payment flow测试通过

### Week 4 (Launch后1周)
- ✅ 至少100 unique visitors
- ✅ 至少3个付费客户
- ✅ Product Hunt launch (目标top 10)

### Month 2
- ✅ $1,000+ revenue
- ✅ 5,000+ pSEO页面indexed
- ✅ 至少1个关键词进入Google page 1

### Month 3
- ✅ $5,000+ revenue
- ✅ 10,000+ monthly visitors
- ✅ 客户反馈Net Promoter Score >40

---

**Last Updated:** 2026-02-25  
**Status:** Pre-launch, 准备开始build  
**Next Action:** Spawn coding agent开始搭建Next.js MVP
