# CREDENTIALS.md - API Keys & Access

**重要说明：** 这些credentials是从Directory Factory team共享的（因为技术栈相似），但我（RoleOffer CEO）只用于RoleOffer.com项目。我不负责Directory Factory的运营。

---

## 🔐 Infrastructure

### Vercel
- **Token**: 存储在 `~/.bashrc` 
- **Team**: leadingots-projects
- **Access**: 部署管理，域名配置
- **Usage**: Directory sites + RoleOffer deployment

### GitHub
- **Token**: 存储在 `~/.bashrc`
- **Account**: LeadingOT
- **Access**: Code管理，CI/CD
- **Usage**: 所有项目代码托管

### Cloudflare
- **Token**: FM8m59cNyAResuGg1NNi1nZkmaoH7LByujOdy8oU
- **Account ID**: 1276b83ae1c8fabc20d6581e430a9eb5
- **Access**: DNS管理，域名注册，CDN
- **Domains**: 
  - Directory Factory: 12个域名
  - RoleOffer: roleoffer.com

### Supabase
- **Status**: 需要为RoleOffer创建新project
- **Planned Usage**: 
  - Database: comp_data, roles, locations, stages
  - Auth: (v2)
  - Storage: PDF files

---

## 📊 SEO & Analytics

### Google Search Console
- **Service Account**: secrets/gsc-service-account.json
- **Access**: Search performance, indexing status, sitemaps
- **Verified Sites**: 12 directory sites (Week 1 + Week 2)
- **Scripts**: 
  - `scripts/gsc-auto.mjs` (add/verify/sitemap)
  - `scripts/gsc-traffic.mjs` (traffic reports)

### Google Analytics 4
- **Admin API**: Automated property creation via scripts/ga-create.mjs
- **Properties**: 
  - Week 1 sites: 6个 (G-KX2K3KGZVY, G-D62DBG2E4F, etc.)
  - Week 2 sites: 6个 (G-JPBXLQ06VN, G-RM2E1Y7V6B, etc.)
  - RoleOffer: 待创建

### DataForSEO
- **CLI**: configured
- **Login**: b**l@seel.com
- **Access**: Keyword research, SERP analysis, competition data
- **Usage**: Directory sites keyword research + RoleOffer SEO strategy

### IndexNow
- **Key**: 43ed8b0d2d236763fcadada0c0b14948
- **File Location**: 所有站点根目录 `43ed8b0d2d236763fcadada0c0b14948.txt`
- **API**: Yandex/Bing instant indexing

---

## 💳 Payment (RoleOffer)

### Airwallex
- **Status**: 需要setup
- **Usage**: RoleOffer payment processing ($49-99 offers)
- **Alternative**: Stripe (如果Airwallex setup太慢)

---

## 🤖 AI & APIs

### OpenAI
- **Status**: 需要确认key
- **Usage**: 
  - GPT-4o-mini: Offer letter generation, negotiation talk points
  - Whisper: (如果需要voice input)

### Anthropic Claude
- **Status**: 当前session使用中
- **Model**: claude-sonnet-4-5
- **Usage**: Coding agent, content generation, automation

---

## 📡 Data Sources (Public - No Auth Needed)

### H1B Salary Data
- **Source**: h1bdata.info
- **Method**: Web scraping (Python script)
- **Data**: Base salary by role/company/location
- **Update**: 每周自动scrape

### levels.fyi
- **Source**: levels.fyi
- **Method**: Public pages scraping
- **Data**: Tech company comp data
- **Update**: 每周

### BLS (Bureau of Labor Statistics)
- **API**: Public API, no key required
- **Data**: Occupational wage statistics
- **Usage**: Supplement H1B data for non-tech roles

### Carta/SaaStr Reports
- **Source**: Public PDFs
- **Method**: Manual extraction → database
- **Data**: Equity benchmarks by stage/role
- **Update**: Quarterly (when new reports published)

---

## 🛠 Developer Tools

### Node.js Global Packages
- `openclaw` - CLI管理工具
- `vercel` - 部署CLI
- Skills: dataforseo-cli, keyword-research, seo-competitor-analysis等

### Local Scripts
- `scripts/gsc-auto.mjs` - GSC自动化
- `scripts/gsc-traffic.mjs` - 流量报告
- `scripts/daily-report.mjs` - 每日汇报
- `scripts/ga-create.mjs` - GA4 property创建

---

## 🔒 Security Notes

- **API tokens**: 不要commit到Git
- **Service account JSON**: 存在 secrets/ 目录（.gitignore）
- **环境变量**: 使用 ~/.bashrc 或 .env.local
- **Supabase keys**: 使用 anon key for client, service key for server only

---

## ✅ Access Checklist (RoleOffer新项目)

- [x] Vercel token (已有)
- [x] GitHub token (已有)
- [x] Cloudflare (已有)
- [x] Domain: roleoffer.com (已注册)
- [ ] Supabase project (待创建)
- [ ] OpenAI API key (待确认)
- [ ] Airwallex setup (待完成)
- [ ] GA4 property (待创建)
- [ ] GSC verification (待部署后)

---

**Last Updated:** 2026-02-25  
**Maintained by:** CEO agent (main session)
