# 🧪 Quick Test - Outbound Tracking

## ✅ 自动报告已设置

**Cron Job创建成功：**
- **名称:** weekly-outbound-report
- **频率:** 每周一早上9点（America/Los_Angeles）
- **下次运行:** 2026-03-10 09:00 AM PST
- **输出:** 自动发送到Telegram（中文）

---

## 📊 手动运行报告（随时）

```bash
# 查看7天数据
node scripts/weekly-outbound-report.mjs 7

# 查看30天数据
node scripts/weekly-outbound-report.mjs 30

# 单个站点详细报告
node scripts/ga4-outbound-report.mjs aigirlfriend.tools 7
```

---

## 🧪 立即测试（5分钟）

### 1. 等待Vercel部署完成

访问 https://vercel.com/leadingots-projects 查看所有站点是否部署完成（~5分钟）

或者检查一个站点：
```bash
curl -I https://aigirlfriend.tools | grep -i "x-vercel"
```

### 2. 测试Visit按钮

**打开任意listing页面：**
- https://aigirlfriend.tools/listing/replika
- https://accountingai.tools/listing/quickbooks
- https://legalai.tools/listing/lexis-nexis

**点击 "Visit XXX →" 按钮**

**预期：**
- ✅ 新窗口打开工具网站
- ✅ 没有JavaScript错误（F12 → Console检查）

### 3. 验证GA4事件发送（高级）

**Chrome DevTools方法：**
1. F12 → Network tab
2. 过滤：`collect`
3. 点击Visit按钮
4. 看到请求到 `google-analytics.com/g/collect`
5. 查看Payload（Preview tab）：
   ```
   en: outbound_click
   ep.listing_name: Replika
   ep.link_type: visit_button
   ep.destination_url: https://replika.com
   ```

**如果看到以上内容 = ✅ 成功！**

---

## 📅 Timeline

| 时间 | 检查项 | 状态 |
|------|--------|------|
| **今天（3/5）** | ✅ 代码部署 | Done |
| **明天（3/6）** | 🧪 测试点击 | 手动测试 |
| **后天（3/7）** | 📊 查看GA4数据 | 运行报告脚本 |
| **下周一（3/10）** | 📧 收到自动周报 | Cron自动发送 |

---

## 🔍 常见问题

### Q: 为什么现在运行报告显示0数据？

**A:** Tracking刚部署，需要：
1. Vercel部署完成（5分钟）
2. 用户点击Visit按钮
3. GA4处理数据（24小时）

**明天再运行就会有数据了。**

### Q: 如何知道tracking是否工作？

**A:** 三个方法：
1. **浏览器Console** - 看有无JS错误
2. **Chrome Network** - 看是否发送到GA4
3. **GA4 Realtime** - https://analytics.google.com/ → Realtime（立即看到）

### Q: Cron job什么时候运行？

**A:** 每周一早上9点（PST）
- 下次：3月10日（下周一）
- 之后：3月17日，3月24日...

### Q: 可以手动触发Cron吗？

**A:** 可以！
```bash
openclaw cron run weekly-outbound-report
```

### Q: 如何停止自动报告？

**A:** 
```bash
# 禁用
openclaw cron disable weekly-outbound-report

# 删除
openclaw cron rm weekly-outbound-report
```

---

## 💡 下一步（有数据后）

**1周后（3月12日）：**
- ✅ 有足够的数据
- 📊 分析Top 10被点击listings
- 🔍 研究这些工具的affiliate programs

**2周后（3月19日）：**
- 📝 申请加入affiliate programs
- 🔗 获取affiliate links

**3周后（3月26日）：**
- 💻 更新listings数据（添加affiliateUrl）
- 💰 开始产生收入

---

## 📞 需要帮助？

**查看cron状态：**
```bash
openclaw cron list
openclaw cron runs weekly-outbound-report
```

**修改cron设置：**
```bash
openclaw cron edit weekly-outbound-report --cron "0 10 * * 1"  # 改成10点
openclaw cron edit weekly-outbound-report --disabled true      # 临时禁用
```

---

**部署时间:** 2026-03-05  
**Cron Job ID:** e2f62ef4-1f00-4ab1-9b34-4d4cb49c3790
