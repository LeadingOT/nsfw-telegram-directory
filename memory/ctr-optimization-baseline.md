# CTR优化效果监控 Baseline

## 部署时间
- **CTR优化部署日期**: 2026年3月2日
- **优化内容**: 动态title（贵→省钱，高分→星级） + BreadcrumbList + AggregateRating
- **预期效果**: CTR从0.29%提升至1.5%+（需4-8周）

---

## Baseline数据（3月3日）

### 前6站CTR现状（7天 2/24-3/1）

| 站点 | 点击 | 展示 | CTR | 平均排名 | 上线天数 |
|------|------|------|-----|----------|----------|
| **aigirlfriend.tools** | 29 | 6,534 | **0.44%** | 8.3 | 8天 |
| **accountingai.tools** | 3 | 3,391 | **0.09%** | 19.6 | 8天 |
| **hrai.tools** | 1 | 1,065 | **0.09%** | 13.9 | 8天 |
| **realestateai.tools** | 0 | 618 | **0.0%** | 15.6 | 8天 |
| **legalai.tools** | 1 | 370 | **0.27%** | 12.2 | 8天 |
| **bestnootropics.info** | 1 | 347 | **0.29%** | 10.6 | 8天 |

**整体CTR**: 0.28% (35点击/12,325展示)

### CTR趋势分析（aigirlfriend示例）
- 2/24: 0.0% (上线第1天)
- 2/25: 0.2%
- 2/26: **0.6%** (peak)
- 2/27-3/1: 0.4%-0.5% (稳定)

→ **自然增长已放缓，CTR优化可能带来新增长**

---

## 监控计划

### 第一次检查：3月17日（+2周）
**目标**: 检查Google是否重新抓取了新title

检查项：
1. GSC Performance数据（3/3-3/17）
2. Top queries的CTR变化
3. Impressions是否增长（新title可能提升相关性）

**成功标准**:
- CTR > 0.5%（整体）
- aigirlfriend CTR > 0.6%
- 至少3个站点CTR有明显提升

### 第二次检查：4月3日（+4周）
**目标**: 全面评估CTR优化效果

检查项：
1. 4周CTR趋势
2. 点击量是否达到预期（180+点击/周）
3. 不同类型title的表现（贵/高分/默认）

**成功标准**:
- 整体CTR > 1.0%
- aigirlfriend CTR > 1.5%
- 周点击量 > 100

---

## 数据收集命令

```bash
# 检查所有站点CTR
for domain in accountingai.tools aigirlfriend.tools hrai.tools realestateai.tools legalai.tools bestnootropics.info; do
  echo "=== $domain ===" 
  node scripts/gsc-traffic.mjs $domain 14
  echo ""
done
```

---

## 下次行动
- ⏰ **3月17日**: 运行监控脚本，更新此文件
- 📊 如果效果好：写一份"CTR优化成果报告"
- 🔄 如果效果不明显：分析原因，调整策略
