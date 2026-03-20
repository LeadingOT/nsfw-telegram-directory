# Glossary Pattern推广追踪

## 当前状态（3月3日）

### ✅ 已部署：accountingai.tools
- **部署日期**: 2026年3月2日
- **术语数量**: 10个
- **总字数**: 18,200+
- **URL pattern**: /glossary/{term}/
- **质量标准**: 85%+独特内容，每页7-10个工具集成

#### 10个术语
1. accounts-payable（应付账款）
2. accounts-receivable（应收账款）
3. accrual-accounting（权责发生制）
4. bank-reconciliation（银行对账）
5. cash-flow-statement（现金流量表）
6. chart-of-accounts（会计科目表）
7. double-entry-bookkeeping（复式记账）
8. expense-categorization（费用分类）
9. general-ledger（总账）
10. tax-compliance（税务合规）

#### SEO潜力
- **目标搜索量**: 11,500次/月
- **预计流量**: 575点击/月（如达到平均#5排名）
- **Keyword Difficulty**: 未测量（需DataForSEO确认）

---

## 验证检查点

### ✅ 技术验证（3月3日完成）
- [x] 页面成功部署（https://accountingai.tools/glossary/accounts-payable/）
- [x] HTML质量优秀（proper schema, breadcrumb, meta tags）
- [x] 内容丰富（1800+字/页）
- [x] 工具集成正确（相关AI工具列表）

### ⏳ 索引验证（待3月17日检查）
- [ ] GSC是否显示glossary页面被索引
- [ ] 是否有impressions/clicks
- [ ] 排名位置如何

### ⏳ 流量验证（待4月3日检查）
- [ ] 是否产生实际流量
- [ ] CTR如何
- [ ] 哪些术语表现最好

---

## 推广决策矩阵

### 场景1: 效果优秀（4周后有明显流量）
**行动**:
1. 立即复制到其他5个AI站点：
   - hrai.tools (10-15个HR术语)
   - realestateai.tools (10-15个地产术语)
   - legalai.tools (10-15个法律术语)
   - aigirlfriend.tools (不适用，NSFW)
   - bestnootropics.info (10-15个健康术语)

2. 术语选择策略：
   - 用DataForSEO查询 "{vertical} glossary" 相关术语
   - 优先选择：vol > 100, KD < 30
   - 确保每个术语有5+相关工具可集成

### 场景2: 效果一般（有索引但流量少）
**行动**:
1. 分析原因：排名太低？KD太高？内容质量？
2. 优化accountingai现有术语（增加内链、外链、更新内容）
3. 等待2-4周再决定是否推广

### 场景3: 效果很差（未索引或无流量）
**行动**:
1. 检查技术问题（robots.txt, sitemap, 内链）
2. 暂停推广计划
3. 考虑替代pattern（如Examples, Integrations）

---

## 监控计划

### 第一次检查：3月17日（+2周）
**目标**: 确认是否被索引

```bash
# 检查GSC数据
node scripts/gsc-traffic.mjs accountingai.tools 14

# 手动检查site:命令
# site:accountingai.tools/glossary/
```

**成功标准**:
- 至少3个glossary页面被索引
- 有impressions（哪怕clicks=0）

### 第二次检查：4月3日（+4周）
**目标**: 评估流量效果

**成功标准**:
- glossary页面总impressions > 500
- 至少1个页面有clicks
- 至少1个术语排名 < 20

---

## 下次行动
- ⏰ **3月17日**: 检查索引状态
- ⏰ **4月3日**: 评估流量，决定是否推广
- 📝 如果推广：为其他5站准备术语列表
