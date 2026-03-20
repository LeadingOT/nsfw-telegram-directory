# HEARTBEAT.md

## 🎯 Builder CEO - Operations & Growth

**Current Phase:** Dual-product management  
**My Role:** Builder CEO（Directory Factory + RoleOffer.com）

---

## 📂 Directory Factory（14站）

### 每次heartbeat检查：

1. **Traffic状态**
   - GSC是否有新impressions/clicks
   - 是否有error spike (404, 500)
   - 是否需要重新提交sitemap

2. **Technical健康**
   - Vercel deployments是否正常
   - **AI Search API是否working（14/14站必须）**
   - GA4数据是否在采集
   - 是否有critical bugs

3. **Growth机会**
   - 是否需要增加listings（目标每站30+）
   - 是否有新外链机会

### 当前14站状态（2026-03-16）
- Total sites: 14 (新增: bestaidetector.tools, aihumanizer.tools)
- **Total pages: ~9,000+**
- Total listings: ~390+
- All sites: deployed ✅
- GSC: 12/14站已验证（bestaidetector + aihumanizer待授权）⏳
- GA4: 12/14站已配置 ✅
- Clarity: 14/14站已添加 ✅
- CTR优化: 14/14站已部署 ✅
- **AI Search: 14/14站已上线 ✅**
- **Outbound tracking: 11/14站已部署 ✅ (2026-03-15)**
- Traffic: 79 clicks/周, 14,674 impressions (7天, 老6站)

---

## 💰 RoleOffer.com

### 每次heartbeat检查：

1. **Build进度**
   - Apify数据抓取状态（if running）
   - Supabase数据质量
   - Vercel deployment状态

2. **数据层状态**
   - 真实benchmark数据条数
   - 覆盖率（roles × locations × stages）
   - 数据freshness

3. **pSEO进度**
   - 已生成页面数量（目标20,000）
   - GSC收录状态
   - Top performing pages

4. **下一步行动**
   - 当前blocked on什么
   - Milestone是否on track

### 当前状态（2026-03-02）
- MVP deployed: https://roleoffer.com ✅
- Database: Supabase 58,752 benchmarks ✅
- Phase 2: 数据扩展完成 ✅
- Phase 3: pSEO生成完成 - 14,692页 ✅
- Sitemap: https://roleoffer.com/sitemap.xml ✅
- GSC: 待Bill添加service account权限 ⏳

---

## 🔄 Cross-Agent Sync (每次heartbeat)

- Read `~/.openclaw/shared-memory/handoffs.md` — 检查是否有任务分配
- 如果完成了任务，标记 `status:done`
- 如果有新决策，append到 `decisions.md` with `[agent:main]` tag

---

## 📊 Weekly Tasks

**Directory Factory（每周）：**
- 检查GSC traffic report (scripts/gsc-traffic.mjs)
- Review top performing pages
- Add 10-20 new listings across sites
- Backlink audit

**RoleOffer（每周）：**
- Monitor benchmark data quality
- Check pSEO page rankings
- Review conversion metrics（launch后）

---

## Heartbeat Response模式

**如果一切正常：**
```
HEARTBEAT_OK
```

**如果有进展update：**
```
✅ 新增X个listings / RoleOffer Phase N完成
⏳ 正在处理Y
📊 [metrics/status]
```

**如果需要Bill介入：**
```
⚠️ Issue: [具体问题]
💡 建议方案: [options]
🤔 需要你决定: [decision needed]
```

---

**核心原则：专注两个产品，稳定增长，持续优化。**
