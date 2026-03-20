# SKILLS-INVENTORY.md - Available Skills & Tools

**说明：** 这些skills是从Directory Factory team学来的（技术栈相似），我（RoleOffer CEO）用于RoleOffer.com项目。我不负责Directory Factory的运营。

---

## 📚 SEO & Content Skills

### dataforseo-cli
- **Location**: ~/.openclaw/workspace/skills/dataforseo-cli/
- **Purpose**: Keyword research, search volume, competition analysis
- **Usage**: `dataforseo-cli keywords "startup compensation"`, `dataforseo-cli related "offer letter"`
- **For RoleOffer**: 发现高价值关键词，验证pSEO页面潜力

### keyword-research
- **Location**: ~/.openclaw/workspace/skills/keyword-research/
- **Purpose**: 系统化keyword discovery with intent analysis
- **Usage**: 找到"what should I write about"类型的keywords
- **For RoleOffer**: 20,000页面的关键词矩阵规划

### seo-competitor-analysis
- **Location**: ~/.openclaw/workspace/skills/seo-competitor-analysis/
- **Purpose**: 分析竞品SEO策略（keywords, backlinks, content）
- **Usage**: 分析Pave, Carta, Lever的SEO
- **For RoleOffer**: 找到竞争空白，差异化定位

### seo-content-writer
- **Location**: ~/.openclaw/workspace/skills/seo-content-writer/
- **Purpose**: 生成SEO优化的博客/landing page内容
- **Usage**: 写"How to Create Startup Offer Letters"类文章
- **For RoleOffer**: 内容营销，博客引流

### on-page-seo-auditor
- **Location**: ~/.openclaw/workspace/skills/on-page-seo-auditor/
- **Purpose**: 检查页面SEO问题（title, meta, headers, images）
- **Usage**: Audit RoleOffer landing page和pSEO pages
- **For RoleOffer**: 确保每个页面SEO优化到位

### technical-seo-checker
- **Location**: ~/.openclaw/workspace/skills/technical-seo-checker/
- **Purpose**: 技术SEO audit（速度, crawlability, Core Web Vitals）
- **Usage**: 检查RoleOffer site health
- **For RoleOffer**: 确保fast load + indexable

### serp-analysis
- **Location**: ~/.openclaw/workspace/skills/serp-analysis/
- **Purpose**: 分析SERP features, ranking factors, AI overview triggers
- **Usage**: 了解"software engineer compensation"的SERP landscape
- **For RoleOffer**: 优化页面以匹配SERP intent

### schema-markup-generator
- **Location**: ~/.openclaw/workspace/skills/schema-markup-generator/
- **Purpose**: 生成JSON-LD structured data (FAQ, HowTo, Product)
- **Usage**: pSEO页面添加FAQ schema
- **For RoleOffer**: Rich snippets，提高CTR

---

## 🛠 Development & Infrastructure

### coding-agent
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/coding-agent/
- **Purpose**: Delegate coding tasks to Codex/Claude Code/Pi agents
- **Usage**: `sessions_spawn` with coding task
- **For RoleOffer**: Build Next.js MVP, implement features
- **Important**: 不要在 ~/clawd workspace spawn，用temp dir

### github
- **Location**: Multiple (system + workspace)
- **Purpose**: GitHub PR, issue, CI/CD管理
- **Usage**: `gh issue`, `gh pr`, `gh run`
- **For RoleOffer**: Code review, deployment automation

### gsc
- **Location**: ~/.openclaw/workspace/skills/gsc/
- **Purpose**: Google Search Console API - traffic, indexing, sitemaps
- **Usage**: scripts/gsc-auto.mjs, scripts/gsc-traffic.mjs
- **For RoleOffer**: Monitor pSEO performance, submit sitemaps

---

## 📊 Data & Research

### deep-research-pro
- **Location**: ~/.openclaw/workspace/skills/deep-research-pro/
- **Purpose**: Multi-source research, synthesis, cited reports
- **Usage**: Research "startup compensation trends 2026"
- **For RoleOffer**: Market research, competitor analysis

### deep-scraper
- **Location**: ~/.openclaw/workspace/skills/deep-scraper/
- **Purpose**: Web scraping for data collection
- **Usage**: Scrape H1B data, levels.fyi, job postings
- **For RoleOffer**: 数据源自动化采集

---

## 💰 Finance & Stock Analysis

### finnhub-pro
- **Location**: ~/.openclaw/workspace/skills/finnhub-pro/
- **Purpose**: 股票数据（实时报价, 财务, 新闻）
- **Usage**: Directory sites可能需要，RoleOffer不需要
- **For RoleOffer**: N/A

### stock-analysis & stock-watcher
- **Location**: ~/.openclaw/workspace/skills/stock-analysis/
- **Purpose**: Portfolio management, watchlists, scoring
- **Usage**: Bill个人投资，非项目相关
- **For RoleOffer**: N/A

---

## 🎨 Content & Media

### openai-image-gen
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/openai-image-gen/
- **Purpose**: Batch generate images via OpenAI API
- **Usage**: 生成blog配图，社交媒体素材
- **For RoleOffer**: Landing page hero images, blog illustrations

### openai-whisper-api
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/openai-whisper-api/
- **Purpose**: Audio transcription
- **Usage**: 如果需要voice input for offer generation
- **For RoleOffer**: v2 feature (语音输入role/level)

---

## 🔧 Utilities & Automation

### skill-creator
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/skill-creator/
- **Purpose**: Create or update AgentSkills
- **Usage**: 如果需要创建新skill（如H1B scraper）
- **For RoleOffer**: 封装data pipeline为skill

### clawhub
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/clawhub/
- **Purpose**: Search, install, update skills from clawhub.com
- **Usage**: `clawhub search seo`, `clawhub install <skill>`
- **For RoleOffer**: 发现新的有用skills

### healthcheck
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/healthcheck/
- **Purpose**: Security hardening, risk assessment
- **Usage**: 定期检查VPS/workstation安全
- **For RoleOffer**: 生产环境安全audit

### tmux
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/tmux/
- **Purpose**: Remote-control tmux sessions
- **Usage**: 管理long-running processes
- **For RoleOffer**: Data scraping jobs, background tasks

### weather
- **Location**: ~/.npm-global/lib/node_modules/openclaw/skills/weather/
- **Purpose**: Weather forecasts via wttr.in
- **Usage**: Personal, 非项目相关
- **For RoleOffer**: N/A

---

## 🚀 Priority Skills for RoleOffer

### Phase 1: Build (Week 1-2)
1. **coding-agent** - Build Next.js app
2. **deep-scraper** - Collect H1B/levels.fyi data
3. **keyword-research** - Plan 20,000 pSEO pages
4. **seo-content-writer** - Generate page content
5. **schema-markup-generator** - Add FAQ schema

### Phase 2: Launch (Week 3)
1. **gsc** - Submit sitemaps, monitor indexing
2. **on-page-seo-auditor** - Pre-launch audit
3. **technical-seo-checker** - Performance check
4. **github** - CI/CD pipeline

### Phase 3: Growth (Week 4+)
1. **seo-competitor-analysis** - Learn from Pave/Carta
2. **serp-analysis** - Optimize for featured snippets
3. **dataforseo-cli** - Find new keyword opportunities
4. **deep-research-pro** - Content marketing ideas

---

## 📝 Custom Scripts (Non-Skills)

### Directory Factory Scripts
- `scripts/gsc-auto.mjs` - GSC automation
- `scripts/gsc-traffic.mjs` - Traffic reports
- `scripts/daily-report.mjs` - Daily summary
- `scripts/ga-create.mjs` - GA4 property creation

### RoleOffer Scripts (To Be Created)
- `scripts/h1b-scraper.py` - H1B data collection
- `scripts/levelsfyi-scraper.py` - levels.fyi scraper
- `scripts/bls-api.js` - BLS wage data fetcher
- `scripts/equity-benchmark-parser.js` - Parse Carta PDFs
- `scripts/pSEO-generator.js` - Generate 20,000 pages
- `scripts/comp-calculator.js` - Benchmark calculation logic

---

## 🔑 API Keys & Credentials

See CREDENTIALS.md for complete list.

**Quick Reference:**
- Vercel: ~/.bashrc
- GitHub: ~/.bashrc
- Cloudflare: FM8m59cNyAResuGg1NNi1nZkmaoH7LByujOdy8oU
- GSC: secrets/gsc-service-account.json
- DataForSEO: configured (dataforseo-cli)
- IndexNow: 43ed8b0d2d236763fcadada0c0b14948

---

## 📖 Skill Documentation

Each skill has a SKILL.md file with:
- Use cases
- Command examples
- Configuration notes
- Tips & tricks

**How to learn a skill:**
1. `read ~/.openclaw/workspace/skills/{skill-name}/SKILL.md`
2. Try example commands
3. Integrate into workflow

---

**Last Updated:** 2026-02-25  
**Maintained by:** CEO agent (main session)  
**Purpose:** Quick reference for all available tools
