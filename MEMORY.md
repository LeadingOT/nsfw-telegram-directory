# MEMORY.md — Long-term Memory

## [P0] About Bill
- Series B startup cofounder, Bay Area
- Prefers Chinese (中文) communication
- Direct, no-fluff, indie hacker mindset
- 多个side projects运行中（Directory Factory, RoleOffer等）
- Values full automation — hates manual steps

## [P0] 我的角色与职责
**我是谁：** Builder CEO — 建站和运营所有Bill的web products
**Agent ID:** main
**Workspace:** ~/.openclaw/workspace/

**我负责：**
1. Directory Factory — 12个SEO directory sites
2. RoleOffer.com — startup compensation tool

## [P0] Directory Factory - 12站域名（完整列表）
**⚠️ 重要：永远参考 DIRECTORY-SITES.md 文件，不要靠记忆！**

**AI垂直（.tools）：**
1. accountingai.tools
2. aigirlfriend.tools
3. hrai.tools
4. legalai.tools
5. realestateai.tools
6. bestwriting.tools ⚠️（是.tools不是.com）

**Entertainment/NSFW（.info）：**
7. bestnootropics.info
8. bestonlyfans.info
9. bestanime.info
10. mattressrank.info ⚠️（是.info不是.com）

**通用（.com）：**
11. bestofpodcasts.com
12. nsfwtelegrambot.com

**Clarity:** vp34qa3vrm（统一Project ID）
**详细信息：** 见 DIRECTORY-SITES.md

## [P0] Credentials & Infra
- Vercel token in ~/.bashrc (team: leadingots-projects)
- GitHub: LeadingOT, token in ~/.bashrc
- Cloudflare: FM8m59cNyAResuGg1NNi1nZkmaoH7LByujOdy8oU (account: 1276b83ae1c8fabc20d6581e430a9eb5)
- GSC service account: secrets/gsc-service-account.json
- DataForSEO CLI: configured (login: b**l@seel.com)
- IndexNow key: 43ed8b0d2d236763fcadada0c0b14948

## [P1] Key Scripts
- scripts/gsc-auto.mjs — GSC add/verify/sitemap
- scripts/gsc-traffic.mjs — traffic reports
- scripts/daily-report.mjs — daily summary

## [P1] SEO Skills Available
- dataforseo-cli, keyword-research, on-page-seo-auditor, seo-competitor-analysis, serp-analysis

## [P0] Lessons Learned
- Use DataForSEO for real keyword data, not guessing
- NSFW/companion verticals have 100-500x more volume than AI SaaS
- Restaurant AI (vol 40) and Construction AI (KD 57) not worth doing
- .tools TLD works fine for SEO, keep brand consistent
- Astro static sites: 0.13s load, perfect PageSpeed
- **关键词研究必须跨类目** — 不限AI，包括NSFW/entertainment/ecommerce
- **NSFW/Entertainment KD比AI低70%** — bestanime (KD 8) vs ai tools (KD 34-56)
- **用 related 发现隐藏金矿** — 找到 bestonlyfans (KD 0), bestpodcasts (KD 1)
- **域名可用性必须检查** — 很多 best[X].com 已被抢
- **TLD策略按类目** — AI用.tools统一，NSFW用.info省钱，Entertainment用.com权威
- **成本差异不重要** — $9 vs $27 对ROI影响小，KD才是关键
- **Vercel部署陷阱** — 同workspace多项目必须用API创建独立project，否则vercel CLI会link到第一个项目导致覆盖
- **Sub-agent timeout** — 建站任务需1800秒，600秒会在部署步骤timeout
- **Listing schema需灵活** — 不同垂直数据结构不同（播客无pricing，床垫rating是对象），template需要optional chaining和type checking
- **Template修复技巧** — 用 `listing.field?.subfield` 和 `typeof x === 'number' ? x : x.overall` 处理不同数据结构

## [P1] RoleOffer.com（我负责）

### 产品
- Startup compensation tool，对标Pave/Carta但价格低100倍
- 按offer收费$49-99，不需share数据
- 用户输入role/level/location/stage → 30秒生成完整package
- 输出：comp benchmark + offer letter PDF + equity projection + negotiation talk points

### Tech Stack
- Next.js 14 + Tailwind + shadcn/ui
- Supabase (database + auth + storage)
- GPT-4o-mini (content generation)
- React-PDF/Puppeteer (PDF generation)
- Airwallex (payment)
- Vercel部署

### 域名
- roleoffer.com (已注册，Bill搞定)
- 为什么选这个：pSEO完美匹配，"role"是20,000页面的核心维度

### pSEO策略
- 20,000+页面：50 roles × 5 levels × 4 stages × 20 cities
- URL: /compensation/{role}-{level}-{stage}-{location}
- 例如：/compensation/senior-software-engineer-series-a-san-francisco
- Phase 1: 先生成top 5,000页（高流量组合）

### 数据源（全免费）
- H1B Salary Data (h1bdata.info)
- Salary Transparency Job Postings (Indeed/LinkedIn scrape)
- levels.fyi公开数据
- BLS API (Bureau of Labor Statistics)
- Carta/SaaStr equity benchmarks (公开报告)

### 免费工具（引流）
1. Startup Offer Calculator - 免费模糊range，付费精确数据
2. "Is My Offer Fair?" - candidate用 → 病毒传播给hiring manager
3. Equity Value Calculator - 3 scenarios × 3 timeframes

### Revenue Target
- Month 1: $0-500 (validation)
- Month 2: $1K-2K (PMF)
- Month 3: $5K+ (scalable)
- Month 6: $15-20K MRR (考虑全职)

### RoleOffer数据文件
- `roleoffer-data/` — SQL schemas, scrapers, competitor analysis, landing page copy, pSEO strategy

### Timeline
- Week 1-2: Build MVP
- Week 3: Launch (Product Hunt + YC Launch + HN)
- Week 4+: Growth & iteration

### 文档
- ROLEOFFER.md - 完整roadmap和任务清单
- CREDENTIALS.md - 所有API keys汇总
- SOUL.md - 更新了CEO双角色定位
- IDENTITY.md - 更新了primary mission

