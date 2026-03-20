# [P0] 关键词研究完整流程

**更新时间：** 2026-02-24
**状态：** 生产流程，每次新批次使用

---

## Phase 1: 广撒网（不限领域）

### 1.1 AI工具类
```bash
dataforseo-cli volume "ai writing tools" "ai video editor" "ai music generator" "ai interior design" "ai marketing tools" "ai sales tools" "ai design tools" "ai photo editor" "ai chatbot" "ai code generator" --location us
```

### 1.2 传统Affiliate
```bash
dataforseo-cli volume "best vpn" "best web hosting" "best wordpress hosting" "best password manager" "best antivirus" "best cloud storage" --location us
```

### 1.3 补剂/健康
```bash
dataforseo-cli volume "best protein powder" "best creatine" "best pre workout" "best bcaa" "best multivitamin" "best nootropics" --location us
```

### 1.4 电商产品
```bash
dataforseo-cli volume "best mattress" "best pillow" "best air purifier" "best vacuum cleaner" "best coffee maker" "best standing desk" "best office chair" "best headphones" --location us
```

### 1.5 SaaS/在线工具
```bash
dataforseo-cli volume "best survey tool" "best form builder" "best landing page builder" "best grammar checker" "best plagiarism checker" "best invoicing software" --location us
```

### 1.6 NSFW/Entertainment
```bash
dataforseo-cli volume "best onlyfans" "top onlyfans creators" "best anime" "best podcasts" "best minecraft servers" "best discord bots" "best youtube channels" --location us
```

---

## Phase 2: 用 Related 发现隐藏金矿

对每个有潜力的seed keyword：
```bash
dataforseo-cli related "[keyword]" --location us --limit 20
```

**关键：** 查看是否有：
- 低KD变体（如 "best free [X]" KD更低）
- 意外高volume方向（如发现 "best onlyfans" KD 0）
- 相邻垂直（如 "ai seo tools" vs "ai marketing tools"）

---

## Phase 3: 查 "best/top" Modifiers

对directory站，必须查这些格式：
```bash
dataforseo-cli volume "best [X]" "top [X]" "[X] ranking" "[X] guide" "[X] directory" "best [X] for [audience]" --location us
```

---

## Phase 4: 获取 KD 数据

```bash
dataforseo-cli related "[target keyword]" --location us --limit 5
```

KD数据在 `difficulty` 列。

---

## Phase 5: 计算 Opportunity Score

```
Opportunity Score = Volume / KD
```

**过滤规则：**
- 新站（DA 0）：只选 KD < 50
- 理想：KD < 35
- 金矿：KD < 10

**排序：** Opportunity Score 从高到低

---

## Phase 6: 域名可用性检查

### 6.1 批量检查
```bash
for domain in [list]; do
  ns=$(dig +short NS "$domain" 2>/dev/null | head -1)
  if [ -z "$ns" ]; then
    echo "$domain → AVAILABLE"
  else
    echo "$domain → TAKEN"
  fi
done
```

### 6.2 尝试多个TLD
- .com — 通用，权威
- .info — 便宜（$3-5），适合NSFW/niche
- .tools — 品牌统一（$25-30），适合AI/tech
- .net — 备选

### 6.3 域名变体
如果 `best[X].com` 被占：
- `[X]ranking.com`
- `[X]directory.com`
- `[X]guide.com`
- `top[X].com`
- `best[X].info`
- `bestof[X].com`

---

## Phase 7: TLD 选择策略

| 类目 | 推荐TLD | 理由 |
|------|---------|------|
| AI工具 | .tools | 品牌统一，tech感 |
| NSFW | .info / .com | 成本低/.com通用 |
| Entertainment | .com | 权威，用户信任 |
| Ecommerce/Affiliate | .com | 信任度，转化率高 |
| Niche垂直 | .info / .net | 便宜，SEO效果相同 |

---

## Phase 8: 最终优先级排序

考虑因素（按权重）：
1. **Opportunity Score** (60%) — Volume / KD
2. **货币化潜力** (25%) — CPC, affiliate佣金, ads收入
3. **域名质量** (10%) — .com > .tools > .info
4. **内容可持续性** (5%) — evergreen vs 季节性

---

## 输出格式

| # | 垂直方向 | 月搜索量 | KD | Opp Score | 可用域名 | 货币化 | 推荐理由 |
|---|---------|---------|-----|-----------|----------|--------|----------|
| 1 | Best OnlyFans | 14,800 | 0 | ∞ | bestonlyfans.info | 🔥🔥🔥 | 零竞争NSFW金矿 |
| 2 | Best Podcasts | 60,500 | 1 | 60,500 | bestofpodcasts.com | 🔥 | 超低KD娱乐类 |

---

## 常见错误（避免）

❌ **只看AI tools** — 漏掉NSFW/entertainment低KD金矿
❌ **不用related** — 错过隐藏高value方向
❌ **不查"best"变体** — directory站核心关键词格式
❌ **忽略域名可用性** — 很多best[X].com已被占
❌ **过度在意成本** — $9 vs $27对ROI影响<5%

✅ **正确做法：**
- 跨所有类目撒网
- 每个seed用related深挖
- 查best/top modifiers
- 优先选KD<35的机会
- 域名不可用立即找替代

---

## 实战案例（2026-02-24）

**发现过程：**
1. 初始想法：AI Marketing Tools (KD 56) ❌
2. 用related发现：AI SEO Tools (KD 36) ✅
3. 扩展到NSFW：Best OnlyFans (KD 0) 🔥
4. 扩展到Entertainment：Best Anime (KD 8) 🔥
5. 最终选出5个，平均KD 13 vs 初始平均KD 50

**结果：** 竞争度降低 74%，volume增加 40%
