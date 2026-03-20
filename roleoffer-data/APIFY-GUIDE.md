# Apify 薪资数据采集攻略

## 为什么选Apify

**vs 自己写scraper:**
- ✅ 现成的scrapers（Glassdoor, LinkedIn, Indeed）
- ✅ 处理anti-bot，IP rotation，CAPTCHA
- ✅ 维护成本低（他们处理网站变化）
- ✅ 按需付费（用多少付多少）

**Cost:**
- $49/月 starter plan = $49 credit
- Glassdoor scraper: ~$0.50 per 100 listings
- 预算$49 = ~10,000条薪资数据

---

## Step 1: 注册 + 充值

1. **注册**: https://apify.com/sign-up
   - 用你的email（不要用temp email）
   - 免费tier有$5 credit可以测试

2. **充值$49**:
   - Account → Billing → Add credits
   - 选Starter plan ($49/月) 或 pay-as-you-go

---

## Step 2: 选择Scraper

### 推荐的Scrapers

#### 1. **Glassdoor Salary Scraper** (最推荐)
- URL: https://apify.com/trudax/glassdoor-scraper
- Cost: $0.50 per 100 salaries
- 数据质量：⭐⭐⭐⭐⭐（真实用户提交）
- 包含：Base salary, bonus, equity, location, company, role

**配置示例:**
```json
{
  "startUrls": [
    "https://www.glassdoor.com/Salaries/software-engineer-salary-SRCH_KO0,17.htm",
    "https://www.glassdoor.com/Salaries/san-francisco-software-engineer-salary-SRCH_IL.0,13_IM759_KO14,31.htm"
  ],
  "maxItems": 1000,
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

#### 2. **LinkedIn Jobs Scraper**
- URL: https://apify.com/bebity/linkedin-jobs-scraper
- Cost: $1 per 1000 jobs
- 数据：Job postings with salary ranges (CA/CO/NY/WA必须公开)

**配置示例:**
```json
{
  "queries": [
    "Software Engineer San Francisco",
    "Senior Software Engineer New York"
  ],
  "filters": {
    "salaryFrom": 50000
  },
  "maxResults": 1000
}
```

#### 3. **Indeed Salary Scraper**
- URL: https://apify.com/misceres/indeed-scraper
- Cost: $0.30 per 100 jobs
- 数据：Job listings + salary estimates

---

## Step 3: 运行Scraper

### 方式1: Web UI (最简单)

1. 打开scraper页面（例如Glassdoor scraper）
2. 点击 **"Try for free"**
3. 配置输入:
   ```json
   {
     "startUrls": [
       "https://www.glassdoor.com/Salaries/software-engineer-san-francisco-salary-SRCH_KO0,17_IL.0,13_IM759.htm"
     ],
     "maxItems": 500
   }
   ```
4. 点击 **"Start"**
5. 等待完成（5-30分钟，取决于数量）
6. 下载结果：JSON/CSV/Excel

### 方式2: API (自动化)

**获取API token:**
- Account → Integrations → API token → Copy

**用curl运行:**
```bash
# 创建scraper run
curl -X POST https://api.apify.com/v2/acts/trudax~glassdoor-scraper/runs \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startUrls": [
      "https://www.glassdoor.com/Salaries/software-engineer-salary-SRCH_KO0,17.htm"
    ],
    "maxItems": 1000
  }'

# 返回run ID，例如：{"data": {"id": "abc123"}}

# 下载结果（等10-30分钟后）
curl "https://api.apify.com/v2/acts/trudax~glassdoor-scraper/runs/abc123/dataset/items?format=json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  > glassdoor_salaries.json
```

### 方式3: Python SDK (最灵活)

```python
from apify_client import ApifyClient

# Initialize client
client = ApifyClient("YOUR_API_TOKEN")

# Run Glassdoor scraper
run_input = {
    "startUrls": [
        "https://www.glassdoor.com/Salaries/software-engineer-salary-SRCH_KO0,17.htm"
    ],
    "maxItems": 1000,
    "proxy": {"useApifyProxy": True}
}

run = client.actor("trudax/glassdoor-scraper").call(run_input=run_input)

# Get results
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f"{item['jobTitle']} @ {item['location']}: ${item['baseSalary']}")
```

---

## Step 4: 数据清洗 + 导入Supabase

### 下载的数据格式（Glassdoor example）

```json
[
  {
    "jobTitle": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "company": "Google",
    "baseSalary": 180000,
    "bonus": 30000,
    "equity": 50000,
    "totalComp": 260000,
    "yearsOfExperience": "5-7",
    "source": "Glassdoor"
  },
  ...
]
```

### 清洗脚本（我给你写好）

```python
import json

# Load Apify results
with open('glassdoor_salaries.json') as f:
    raw_data = json.load(f)

# Clean and group by role + location
from collections import defaultdict
grouped = defaultdict(list)

for item in raw_data:
    role = normalize_role(item['jobTitle'])  # Map to canonical role
    location = normalize_location(item['location'])  # Extract city
    salary = item['baseSalary']
    
    if role and location and salary:
        grouped[(role, location)].append(salary)

# Calculate percentiles
results = []
for (role, location), salaries in grouped.items():
    if len(salaries) < 5:  # Skip if too few samples
        continue
    
    salaries.sort()
    n = len(salaries)
    
    results.append({
        'role': role,
        'location': location,
        'p25': salaries[int(n * 0.25)],
        'p50': salaries[int(n * 0.50)],
        'p75': salaries[int(n * 0.75)],
        'p90': salaries[int(n * 0.90)],
        'sample_size': n,
        'source': 'Glassdoor via Apify'
    })

# Save for Supabase import
with open('cleaned_benchmarks.json', 'w') as f:
    json.dump(results, f, indent=2)
```

### 导入Supabase

```sql
-- 在Supabase SQL Editor运行

INSERT INTO comp_data (
  role_id, 
  level, 
  location_id, 
  stage_id,
  base_salary_p25,
  base_salary_p50,
  base_salary_p75,
  base_salary_p90,
  data_source,
  sample_size
)
SELECT 
  r.id,
  'IC3',  -- 根据title判断level
  l.id,
  s.id,
  cd.p25,
  cd.p50,
  cd.p75,
  cd.p90,
  'Glassdoor',
  cd.sample_size
FROM 
  cleaned_data cd
  JOIN roles r ON r.title = cd.role
  JOIN locations l ON l.city = cd.location
  JOIN stages s ON s.name = 'Series A';  -- 根据公司判断stage
```

---

## 完整采集Plan（$49预算）

### Phase 1: Core Tech Roles (Budget: $20)
**Target: 10 roles × 10 cities = 100 queries**

Roles:
- Software Engineer
- Senior Software Engineer
- Staff Software Engineer
- Principal Engineer
- Engineering Manager
- Product Manager
- Senior PM
- Data Scientist
- Designer
- Marketing Manager

Cities:
- SF, NYC, Seattle, Boston, Austin, LA, Chicago, Denver, San Jose, Palo Alto

**Scraper:** Glassdoor  
**Cost:** ~$20 (4,000 salary data points)

### Phase 2: Equity Data (Budget: $15)
**Target: Equity benchmarks from levels.fyi**

**Scraper:** levels.fyi scraper (if exists) or custom  
**Cost:** ~$15

### Phase 3: Validation (Budget: $10)
**Cross-check with Indeed/LinkedIn**

**Scraper:** Indeed  
**Cost:** ~$10 (3,000 listings)

### Reserve: $4 for re-runs

---

## 时间估算

**Setup:** 30分钟
- 注册账号
- 充值
- 测试第一个scraper

**运行:** 2-3小时
- Glassdoor: 100 queries → 1-2小时
- levels.fyi: 30分钟
- Indeed: 30分钟

**清洗 + 导入:** 1-2小时
- 我给你写好脚本
- 你运行 → 生成clean JSON
- 我导入Supabase

**总计:** 半天可以完成全部真实数据采集

---

## Pro Tips

### 1. 测试先跑小batch
```json
{
  "maxItems": 50  // 先跑50条测试
}
```
看结果质量OK再scale up

### 2. 用Residential proxy
```json
{
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]  // 更贵但更稳
  }
}
```

### 3. 分批运行
不要一次跑10,000条，分10个runs × 1,000条
- 更容易debug
- 可以并行跑

### 4. 保存raw data
下载所有JSON备份，万一要重新清洗

---

## Alternatives to Apify

### 1. **BrightData** ($500/月起)
- 更enterprise，但太贵

### 2. **ScraperAPI** ($49/月)
- 只提供proxy，还得自己写scraper
- 适合你已经有scraper代码

### 3. **Oxylabs** ($99/月)
- 类似BrightData

**结论：Apify最适合你的需求（现成scraper + 合理价格）**

---

## 立即行动清单

- [ ] 注册Apify账号
- [ ] 充值$49（或先用$5免费credit测试）
- [ ] 测试Glassdoor scraper（50条数据）
- [ ] 确认数据质量OK
- [ ] 运行完整采集（100 queries）
- [ ] 下载JSON结果
- [ ] 发给我 → 我清洗 + 导入Supabase
- [ ] 更新roleoffer.com标注"Real salary data"

**Estimated time to real data: 4-6小时**

---

## Questions?

如果遇到问题：
- Apify文档：https://docs.apify.com
- 社区forum：https://community.apify.com
- 或者直接问我，我帮你debug

**Ready to go?** 注册链接：https://apify.com/sign-up
