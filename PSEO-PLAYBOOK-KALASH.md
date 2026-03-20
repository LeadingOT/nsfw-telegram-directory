# Programmatic SEO Playbook - Kalash的12个Pattern

**来源:** Kalash (@kalashvasaniya) - seoitis.com (2026-01-30)  
**原推:** 用Claude Opus 4.6 Max花22M tokens做pSEO → 100K页面ranking on Google  
**收录时间:** 2026-03-02

---

## 核心理念

**Programmatic SEO的本质：**
> Building scalable page systems that solve real user problems, NOT mass-producing low-value pages.

---

## 12个pSEO Patterns

### 1. Templates Pattern 📄
**搜索模式:** `[type] template`, `free [type] template`  
**例子:** resume template, invoice template, pitch deck template

**本质:** 可下载或交互式模板，用户可立即使用

**为什么有效:**
- 高意图
- 可分享资产
- 适合product-led growth

**价值要求:**
- 可用的模板
- 多种变体
- 付费级别质量
- 无摩擦使用

**URL结构:** `/templates/[type]/`, `/templates/[category]/[type]/`

---

### 2. Curation Pattern ⭐ (我们在用)
**搜索模式:** `best [category]`, `top [number] [things]`  
**例子:** best website builders, top 10 crm software, best free design tools

**本质:** 精选列表，ranking或推荐产品/服务

**为什么有效:**
- 高商业意图
- 决策阶段流量
- 持续更新的evergreen内容

**价值要求:**
- 明确标准
- 真实测试
- 可见更新
- 非affiliate偏见

**URL结构:** `/best/[category]/`, `/[category]/best/`

**我们的实现:** Directory Factory的 `/best/` pages

---

### 3. Conversions Pattern 🔄
**搜索模式:** `[x] to [y]`, `[amount] [unit] in [unit]`  
**例子:** 10 usd to gbp, 100 kg to lbs, pdf to word

**本质:** 转换格式、单位或值的工具/页面

**为什么有效:**
- 即时效用
- 海量volume
- 重复使用

**价值要求:**
- 准确数据
- 快速工具
- 相关转换推荐
- 移动优先

**URL结构:** `/convert/[from]-to-[to]/`, `/[from]-to-[to]-converter/`

---

### 4. Comparisons Pattern ⚖️ (我们在用)
**搜索模式:** `[x] vs [y]`, `[x] alternative`  
**例子:** webflow vs wordpress, notion vs coda, figma alternatives

**本质:** 产品或解决方案的对比

**为什么有效:**
- 高购买意图
- 清晰的搜索行为
- 可扩展

**价值要求:**
- 诚实分析
- 真实功能数据
- 用例推荐
- 频繁更新

**URL结构:** `/compare/[x]-vs-[y]/`, `/[x]-vs-[y]/`

**我们的实现:** Directory Factory的 `/compare/` pages

---

### 5. Examples Pattern 🎨
**搜索模式:** `[type] examples`, `[category] inspiration`  
**例子:** saas landing page examples, email subject line examples, portfolio website examples

**本质:** 真实案例集合，用于灵感或研究

**为什么有效:**
- 研究阶段流量
- 高度可分享
- 强创意吸引力

**价值要求:**
- 真实案例
- 截图或嵌入
- 筛选器
- 解释

**URL结构:** `/examples/[type]/`, `/[type]-examples/`

---

### 6. Locations Pattern 📍
**搜索模式:** `[service] in [location]`  
**例子:** coworking spaces in san diego, dentists in austin, best restaurants in brooklyn

**本质:** 服务或业务的地理位置特定页面

**为什么有效:**
- 海量本地意图
- 地理可扩展性

**价值要求:**
- 真实本地数据
- 实际listings
- 位置洞察
- 地图

**URL结构:** `/[service]/[city]/`, `/locations/[city]/[service]/`

**潜在应用:** RoleOffer未来可以扩展 "software engineer jobs in san francisco"

---

### 7. Personas Pattern 👥 (RoleOffer在用)
**搜索模式:** `[product] for [audience]`, `[solution] for [role or industry]`  
**例子:** payroll software for agencies, crm for real estate, project management for freelancers

**本质:** 针对特定受众的landing pages

**为什么有效:**
- 更高相关性
- 更好转化
- 按受众可扩展

**价值要求:**
- 定制化messaging
- 相关功能
- persona testimonials
- 真实用例

**URL结构:** `/for/[persona]/`, `/solutions/[industry]/`

**我们的实现:** RoleOffer的 `/compensation/[role]-[level]-[stage]-[location]` 本质是persona (role) + location + stage的组合

---

### 8. Integrations Pattern 🔗
**搜索模式:** `[product] [product] integration`, `[product] + [product]`  
**例子:** slack asana integration, zapier airtable, hubspot salesforce sync

**本质:** 解释工具如何协同工作的页面

**为什么有效:**
- 捕获其他工具的用户
- 非常高意图

**价值要求:**
- 真实integrations
- 设置步骤
- 用例
- 视觉化

**URL结构:** `/integrations/[product]/`, `/connect/[product]/`

---

### 9. Glossary Pattern 📚
**搜索模式:** `what is [term]`, `[term] definition`  
**例子:** what is pseo, api definition, what does crm stand for

**本质:** 解释行业术语的教育页面

**为什么有效:**
- 漏斗顶部流量
- 建立权威
- 内部链接

**价值要求:**
- 清晰定义
- 例子
- 相关术语
- 深度

**URL结构:** `/glossary/[term]/`, `/learn/[term]/`

---

### 10. Translations Pattern 🌍
**搜索模式:** 本地化版本的现有查询  
**例子:** qué es pseo, was ist seo, マーケティング とは

**本质:** 为新市场翻译和本地化的内容

**为什么有效:**
- 新需求
- 更低竞争
- 倍增覆盖

**价值要求:**
- 高质量翻译
- 本地化
- hreflang
- 母语审核

**URL结构:** `/[language]/[page]/`, `/es/`, `/de/`, `/fr/`

**推荐工具:** @lingodotdev

---

### 11. Directory Pattern 🗂️ (我们在用)
**搜索模式:** `[category] tools`, `[category] software`  
**例子:** ai copywriting tools, email marketing software, crm companies

**本质:** 结构化目录，列出工具或公司

**为什么有效:**
- 研究流量
- 外链磁铁
- Evergreen

**价值要求:**
- 全面覆盖
- 筛选器
- 详细listings
- 更新

**URL结构:** `/directory/[category]/`, `/[category]-directory/`

**我们的实现:** Directory Factory的整个模式就是这个pattern！

---

### 12. Profiles Pattern 👤
**搜索模式:** `[name]`, `[entity] + [attribute]`  
**例子:** stripe ceo, airbnb founding story, elon musk companies

**本质:** 人物、公司或实体的档案页面

**为什么有效:**
- 信息性需求
- 主题权威
- 长尾覆盖

**价值要求:**
- 准确数据
- 来源
- 独特洞察
- 新鲜度

**URL结构:** `/people/[name]/`, `/companies/[name]/`

---

## 🎯 Layering Multiple Playbooks (组合策略)

**核心策略：叠加多个patterns获得更精准流量**

### 实际例子：

1. **Locations + Personas**
   - Query: "marketing agencies for startups in austin"
   - Pattern: #6 Locations + #7 Personas

2. **Curation + Locations**
   - Query: "best coworking spaces in san diego"
   - Pattern: #2 Curation + #6 Locations

3. **Comparisons + Personas** (潜在)
   - Query: "notion vs coda for developers"
   - Pattern: #4 Comparisons + #7 Personas

4. **Directory + Locations** (潜在)
   - Query: "ai tools in europe"
   - Pattern: #11 Directory + #6 Locations

---

## 💡 对我们项目的应用

### Directory Factory (现在)
**当前使用的patterns:**
- ✅ #11 Directory (核心)
- ✅ #2 Curation (`/best/` pages)
- ✅ #4 Comparisons (`/compare/` pages)
- ✅ #12 Profiles (每个tool的 `/alternatives/[tool]/` 页面)

**可以叠加:**
- 🔄 #6 Locations - "best ai tools for real estate in california"
- 🔄 #7 Personas - "ai writing tools for bloggers"
- 🔄 #5 Examples - "ai girlfriend conversation examples"

### RoleOffer (现在)
**当前使用的patterns:**
- ✅ #7 Personas (role)
- ✅ #6 Locations (location)
- ✅ Layered: role + level + stage + location

**URL:** `/compensation/senior-software-engineer-series-a-san-francisco`
**实际是:** Personas (senior software engineer) + Locations (san francisco) + 2个属性 (series-a, level)

**可以叠加:**
- 🔄 #9 Glossary - "what is IC4 level"
- 🔄 #4 Comparisons - "series a vs series b compensation"
- 🔄 #5 Examples - "real offer letter examples for senior engineers"

---

## 📊 Kalash的成果数据

- **投入:** 22M tokens (Claude Opus 4.6 Max)
- **产出:** 100K pages ranking on Google
- **成本估算:** ~$660 (按Claude Opus 4.6 pricing: $30/M tokens)

**ROI分析:**
- 如果100K页面每页带来1次/月organic click
- = 100K monthly clicks
- 如果CPC $1，等价价值 = $100K/月
- **投资回报:** $660 → $100K/月 = 151x ROI

---

## 🎯 关键Takeaways

1. **质量 > 数量**
   - "solve real user problems" NOT "mass-producing low-value pages"
   - 每个page必须有真实价值

2. **Layering = 更精准流量**
   - 单一pattern = 广泛流量
   - 组合2-3个patterns = 高意图长尾流量

3. **Value Requirements是关键**
   - 每个pattern都有明确的价值门槛
   - 达不到门槛 = Google不会rank

4. **URL Structure很重要**
   - 清晰的URL hierarchy
   - 便于用户理解和搜索引擎抓取

5. **Claude可以scale**
   - 22M tokens = 可行
   - 但需要好的prompts和数据结构

---

## 📁 相关文档

- **我们的pSEO策略:** `pseo-strategy.md`
- **Directory Factory状态:** `DIRECTORY-SITES.md`
- **RoleOffer数据:** `roleoffer-data/`

---

**保存时间:** 2026-03-02  
**来源:** COS agent转发  
**状态:** 已学习并应用到策略中
