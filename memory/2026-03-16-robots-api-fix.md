# GSC Indexing Issue Fix - 2026-03-16

## 问题

收到Google Search Console警报（legalai.tools）：
- **Server error (5xx)** - 部分页面
- **Soft 404** - 部分页面

## 根本原因

所有14个Directory站点的`/api/ai-search` endpoint暴露给Googlebot：
- Googlebot用GET方法抓取API endpoints
- API只支持POST，返回404/5xx
- 导致GSC报告indexing errors

## 解决方案

在所有14个站点的`robots.txt`添加：
```
User-agent: *
Allow: /
Disallow: /api/
```

这样阻止所有爬虫（包括Googlebot）抓取API endpoints。

## 执行结果

✅ **14/14站点修复完成**

### 修复的站点：
1. accountingai.tools ✅
2. aigirlfriend.tools ✅
3. hrai.tools ✅
4. legalai.tools ✅
5. realestateai.tools ✅
6. bestnootropics.info ✅
7. bestwriting.tools ✅
8. bestaidetector.tools ✅
9. aihumanizer.tools ✅
10. bestanime.info ✅
11. bestonlyfans.info ✅
12. bestofpodcasts.com ✅
13. mattressrank.info ✅
14. nsfwtelegrambot.com ✅

### Git提交：
- Commit message: "fix: block /api/ in robots.txt to prevent GSC indexing errors"
- 所有站点已push到GitHub
- Vercel自动部署完成（~3分钟）

### 验证：
```bash
# 线上验证（2026-03-16 11:08 AM）
curl -s https://legalai.tools/robots.txt | grep "Disallow: /api/"
# ✅ Disallow: /api/

curl -s https://accountingai.tools/robots.txt | grep "Disallow: /api/"
# ✅ Disallow: /api/

curl -s https://aigirlfriend.tools/robots.txt | grep "Disallow: /api/"
# ✅ Disallow: /api/

curl -s https://bestaidetector.tools/robots.txt | grep "Disallow: /api/"
# ✅ Disallow: /api/
```

## 后续步骤

1. **等待Google重新抓取**（24-48小时）
   - GSC会自动重新验证这些URL
   - Errors应该会消失

2. **监控GSC Coverage报告**
   - 检查"Server error (5xx)"和"Soft 404"是否减少
   - 如果问题持续，需要deep dive具体URL

3. **提交更新的sitemap**（可选）
   - Google会自动发现robots.txt变化
   - 但可以手动触发重新抓取加速

## 预防措施

**未来新站checklist添加：**
- [ ] 在robots.txt添加`Disallow: /api/`
- [ ] 验证API endpoints不会被搜索引擎索引

## 脚本创建

创建了自动化脚本：`/home/bill/.openclaw/workspace/scripts/fix-robots-api-block.sh`
- 批量修复所有站点robots.txt
- 自动commit和push
- 可用于未来新站点

## 教训

1. **API endpoints应该默认blocked** - 搜索引擎不需要索引它们
2. **robots.txt是first line of defense** - 比noindex meta tag更早生效
3. **批量操作需要careful testing** - 我们有realestate-ai-directory和realestateai-directory两个目录（命名不一致）

## 影响

- **SEO影响：** 无负面影响（API endpoints本来就不应该被索引）
- **性能影响：** 正面（减少无用的Googlebot请求）
- **GSC健康度：** 预期24-48小时内errors清零

## 完成时间

- 开始：2026-03-16 10:45 AM
- 完成：2026-03-16 11:10 AM
- **总耗时：25分钟**（包括诊断 + 修复 + 部署 + 验证）
