# Directory Factory - 所有14站URL列表

**更新时间：** 2026-03-20 11:24 AM

---

## AI垂直（.tools）- 6站

### 1. Accounting AI Tools
- **主站：** https://accountingai.tools
- **Sitemap：** https://accountingai.tools/sitemap-index.xml
- **Alternatives：** https://accountingai.tools/alternatives/quickbooks
- **Compare：** https://accountingai.tools/compare/
- **Category：** https://accountingai.tools/category/bookkeeping

### 2. AI Girlfriend Tools
- **主站：** https://aigirlfriend.tools
- **Sitemap：** https://aigirlfriend.tools/sitemap-index.xml
- **Alternatives：** https://aigirlfriend.tools/alternatives/candy-ai
- **Compare：** https://aigirlfriend.tools/compare/
- **Category：** https://aigirlfriend.tools/category/ai-girlfriend

### 3. HR AI Tools
- **主站：** https://hrai.tools
- **Sitemap：** https://hrai.tools/sitemap-index.xml
- **Alternatives：** https://hrai.tools/alternatives/bamboohr
- **Compare：** https://hrai.tools/compare/
- **Category：** https://hrai.tools/category/recruiting

### 4. Legal AI Tools
- **主站：** https://legalai.tools
- **Sitemap：** https://legalai.tools/sitemap-index.xml
- **Alternatives：** https://legalai.tools/alternatives/harvey-ai
- **Compare：** https://legalai.tools/compare/
- **Category：** https://legalai.tools/category/legal-research

### 5. Real Estate AI Tools
- **主站：** https://realestateai.tools
- **Sitemap：** https://realestateai.tools/sitemap-index.xml
- **Alternatives：** https://realestateai.tools/alternatives/
- **Compare：** https://realestateai.tools/compare/
- **Category：** https://realestateai.tools/category/property-management

### 6. Best Writing Tools
- **主站：** https://bestwriting.tools
- **Sitemap：** https://bestwriting.tools/sitemap-index.xml
- **Alternatives：** https://bestwriting.tools/alternatives/jasper
- **Compare：** https://bestwriting.tools/compare/
- **Category：** https://bestwriting.tools/category/ai-writing

---

## AI工具新站（.tools）- 2站

### 7. Best AI Detector Tools
- **主站：** https://bestaidetector.tools
- **Sitemap：** https://bestaidetector.tools/sitemap-index.xml
- **Alternatives：** https://bestaidetector.tools/alternatives/
- **Compare：** https://bestaidetector.tools/compare/
- **Status：** 新站（9天）⏳ GSC未配置

### 8. AI Humanizer Tools
- **主站：** https://aihumanizer.tools
- **Sitemap：** https://aihumanizer.tools/sitemap-index.xml
- **Alternatives：** https://aihumanizer.tools/alternatives/
- **Compare：** https://aihumanizer.tools/compare/
- **Status：** 新站（9天）⏳ GSC未配置

---

## Entertainment/NSFW（.info）- 4站

### 9. Best Nootropics
- **主站：** https://bestnootropics.info
- **Sitemap：** https://bestnootropics.info/sitemap-index.xml
- **Alternatives：** https://bestnootropics.info/alternatives/
- **Compare：** https://bestnootropics.info/compare/
- **Category：** https://bestnootropics.info/category/memory

### 10. Best OnlyFans
- **主站：** https://bestonlyfans.info
- **Sitemap：** https://bestonlyfans.info/sitemap-index.xml
- **Alternatives：** https://bestonlyfans.info/alternatives/
- **Compare：** https://bestonlyfans.info/compare/
- **Category：** https://bestonlyfans.info/category/top-creators

### 11. Best Anime
- **主站：** https://bestanime.info
- **Sitemap：** https://bestanime.info/sitemap-index.xml
- **Alternatives：** https://bestanime.info/alternatives/
- **Compare：** https://bestanime.info/compare/
- **Category：** https://bestanime.info/category/streaming

### 12. Mattress Rank
- **主站：** https://mattressrank.info
- **Sitemap：** https://mattressrank.info/sitemap-index.xml
- **Alternatives：** https://mattressrank.info/alternatives/
- **Compare：** https://mattressrank.info/compare/
- **Category：** https://mattressrank.info/category/memory-foam

---

## 通用（.com）- 2站

### 13. Best of Podcasts
- **主站：** https://bestofpodcasts.com
- **Sitemap：** https://bestofpodcasts.com/sitemap-index.xml
- **Alternatives：** https://bestofpodcasts.com/alternatives/
- **Compare：** https://bestofpodcasts.com/compare/
- **Category：** https://bestofpodcasts.com/category/business

### 14. NSFW Telegram Bot
- **主站：** https://nsfwtelegrambot.com
- **Sitemap：** https://nsfwtelegrambot.com/sitemap-index.xml
- **Alternatives：** https://nsfwtelegrambot.com/alternatives/
- **Compare：** https://nsfwtelegrambot.com/compare/
- **Category：** https://nsfwtelegrambot.com/category/adult-content

---

## 快速验证命令

```bash
# 测试所有sitemap
for site in accountingai.tools aigirlfriend.tools aihumanizer.tools bestaidetector.tools \
            hrai.tools legalai.tools realestateai.tools bestwriting.tools \
            bestnootropics.info bestonlyfans.info bestanime.info mattressrank.info \
            bestofpodcasts.com nsfwtelegrambot.com; do
  echo "$site: $(curl -s -o /dev/null -w '%{http_code}' https://$site/sitemap-index.xml)"
done

# 测试alternatives页面（已知存在的）
curl -I https://aigirlfriend.tools/alternatives/candy-ai
curl -I https://legalai.tools/alternatives/harvey-ai
curl -I https://accountingai.tools/alternatives/quickbooks
```

---

## 当前状态（2026-03-20 11:24 AM）

| 站点 | Sitemap | pSEO | Status |
|------|---------|------|--------|
| accountingai.tools | ✅ 200 | ✅ 200 | 正常 |
| aigirlfriend.tools | ✅ 200 | ✅ 200 | 正常 |
| aihumanizer.tools | ✅ 200 | ⏳ 待测 | 新站 |
| bestaidetector.tools | ✅ 200 | ⏳ 待测 | 新站 |
| hrai.tools | ✅ 200 | ⏳ 待测 | 正常 |
| legalai.tools | ✅ 200 | ✅ 200 | 正常 |
| realestateai.tools | ✅ 200 | ⏳ 待测 | 正常 |
| bestwriting.tools | ✅ 200 | ⏳ 待测 | 正常 |
| bestnootropics.info | ✅ 200 | ⏳ 待测 | 正常 |
| bestonlyfans.info | ✅ 200 | ⏳ 待测 | 正常 |
| bestanime.info | ✅ 200 | ⏳ 待测 | 正常 |
| mattressrank.info | ✅ 200 | ⏳ 待测 | 正常 |
| bestofpodcasts.com | ✅ 200 | ⏳ 待测 | 正常 |
| nsfwtelegrambot.com | ✅ 200 | ⏳ 待测 | 正常 |

**核心修复已完成：**
- ✅ Sitemap 404 → 200（14/14站）
- ✅ Alternatives 500 → 200（已测试站点）
- ⏳ Compare页面待验证（可能部分不存在）

---

## 下一步

1. **GSC重新提交sitemap**（优先）
2. 测试所有站点的alternatives/compare页面
3. 监控indexation恢复（1-2周）
4. 配置新站GSC权限（bestaidetector + aihumanizer）
