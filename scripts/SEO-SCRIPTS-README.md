# SEO自动化脚本使用指南

## 📊 可用脚本

### 1. GSC流量报告
**脚本：** `gsc-traffic.mjs`  
**功能：** 查询Google Search Console数据

**用法：**
```bash
# 查询某个站点（默认7天）
node scripts/gsc-traffic.mjs accountingai.tools

# 指定天数
node scripts/gsc-traffic.mjs accountingai.tools 28
```

**输出：**
- 总点击、展示、CTR、平均排名
- Top关键词列表
- Top页面列表

---

### 2. GA4数据报告
**脚本：** `ga4-report.mjs`  
**功能：** 查询Google Analytics 4数据

**用法：**
```bash
# 查询某个站点（默认7天）
node scripts/ga4-report.mjs accountingai.tools

# 指定天数
node scripts/ga4-report.mjs accountingai.tools 28
```

**输出：**
- 活跃用户、会话、页面浏览
- 流量来源分布
- Top页面
- Top国家

**注意：** GA4数据需要24-48小时才会出现。

---

### 3. 每周SEO报告（综合）
**脚本：** `seo-weekly-report.mjs`  
**功能：** 汇总GSC + GA4数据，自动对比上周

**用法：**
```bash
node scripts/seo-weekly-report.mjs accountingai.tools
```

**输出：**
- GSC数据 + 周环比变化
- Top查询关键词
- **自动找出优化机会**（高展示低CTR的关键词）
- GA4用户数据
- 流量来源分析

**推荐：** 每周一早上运行，了解上周表现。

---

### 4. 优化机会发现器
**脚本：** `seo-optimize-finder.mjs`  
**功能：** 自动找出低CTR高impression的关键词

**用法：**
```bash
# 分析单个站点
node scripts/seo-optimize-finder.mjs accountingai.tools

# 分析所有站点
node scripts/seo-optimize-finder.mjs --all
```

**输出：**
- 🎯 优化机会：高展示、低CTR、排名较差的关键词
- ✅ 成功案例：高CTR的关键词（学习参考）
- 💡 潜在收益估算

**推荐：** 每月运行一次，找出优化方向。

---

## 🎯 实际使用场景

### 场景1：每周检查流量
```bash
# AI Agent可以这样问
"帮我看看accountingai.tools本周的SEO表现"

# 内部调用
node scripts/seo-weekly-report.mjs accountingai.tools
```

### 场景2：找优化机会
```bash
# 问AI
"帮我找出所有站点的SEO优化机会"

# 内部调用
node scripts/seo-optimize-finder.mjs --all
```

### 场景3：对比两个站
```bash
# 问AI
"对比accountingai和aigirlfriend的流量表现"

# 内部调用（AI会运行两次并对比）
node scripts/gsc-traffic.mjs accountingai.tools
node scripts/gsc-traffic.mjs aigirlfriend.tools
```

---

## 📈 数据解读

### CTR基准
- **<1%** - 需要优化title/meta
- **1-3%** - 正常水平
- **>5%** - 优秀

### 优化优先级
1. **高展示(>50) + 低CTR(<2%) + 排名5-15** - 最值得优化
2. **高展示(>20) + 低CTR(<3%) + 排名10-20** - 次优先
3. **低展示(<10)** - 暂时忽略

### 成功指标
- CTR提升 >0.5%
- 平均排名上升 >2位
- 点击量增长 >20%

---

## 🔧 配置说明

### Service Account权限
已配置：
- ✅ Google Search Console API (只读)
- ✅ Google Analytics Data API (只读)
- ✅ 所有12个Directory站 + RoleOffer已授权

### GA4 Property ID映射
在 `ga4-report.mjs` 中维护：
```javascript
const PROPERTY_MAP = {
  'accountingai.tools': '526242077',
  'aigirlfriend.tools': '526242422',
  // ... etc
};
```

**注意：** 新增站点需要：
1. 创建GA4 property（使用`ga-create.mjs`）
2. 添加Service Account为Viewer
3. 更新PROPERTY_MAP

---

## 💡 AI Agent使用提示

当Bill问这些问题时，自动调用对应脚本：

**触发词 → 脚本：**
- "SEO表现" / "流量怎么样" → `seo-weekly-report.mjs`
- "优化机会" / "哪些词可以优化" → `seo-optimize-finder.mjs`
- "GA4数据" / "用户数据" → `ga4-report.mjs`
- "GSC数据" / "搜索数据" → `gsc-traffic.mjs`

**示例对话：**
```
Bill: "帮我找找aigirlfriend.tools的优化机会"

AI: [调用] node scripts/seo-optimize-finder.mjs aigirlfriend.tools

AI: "发现1个优化机会：'kindroid'有83次展示但0次点击，排名#9。
     建议优化title/meta，潜在+2 clicks/月。"
```

---

## 🚀 高级用法

### 定时报告（未配置）
可以在 `HEARTBEAT.md` 中添加：
```markdown
## 📊 Weekly Tasks

**每周一：**
- 运行 seo-weekly-report.mjs --all
- 找出top 3优化机会
- 更新Bill
```

### 自动化决策（未配置）
AI可以主动：
1. 发现CTR<1%的关键词
2. 自动生成优化建议
3. 提醒Bill review

---

## 🐛 常见问题

**Q: "No data available"**  
A: 站点太新（<3天）或GSC未验证。等待2-3天。

**Q: GA4没有数据**  
A: GA4数据延迟24-48小时。新安装的站点等2天。

**Q: "Permission denied"**  
A: Service Account未添加到GSC/GA4。检查权限设置。

**Q: Property ID错误**  
A: 更新 `PROPERTY_MAP`，确保是纯数字ID，不是数据流ID。

---

## 📝 总结

**日常使用：**
- 每周一：运行 `seo-weekly-report.mjs --all`
- 每月：运行 `seo-optimize-finder.mjs --all`
- 随时：问AI具体问题，让它调用脚本

**优化流程：**
1. 发现机会（optimize-finder）
2. 优化title/meta
3. 等待7天
4. 检查效果（weekly-report）
5. 重复

现在你有了完整的SEO自动化系统！🎉
