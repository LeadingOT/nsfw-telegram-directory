# RoleOffer Supabase 导入指南

## 📦 文件清单

### 1. 数据文件
**路径:** `/home/bill/.openclaw/workspace/roleoffer-data/generated/roleoffer_extended_dataset.csv`
- **大小:** 6.7MB
- **行数:** 58,752 rows (包含header)
- **覆盖:** 6 stages × 8 locations × 5 roles × 9 levels × 4 percentiles

**字段:**
```
stage,stage_label,location,location_label,role,role_label,level,level_label,level_name,percentile,salary,total_cash,equity_pct
```

**示例行:**
```csv
seed,$1M-$10M,san_francisco,"San Francisco, CA",engineering,Engineering,ic1,IC 1,Entry,p25,70840,78200,0.0032
```

---

### 2. Schema文件
**路径:** `/home/bill/.openclaw/workspace/roleoffer-data/supabase-schema-clean.sql`

**表结构:**
- `roles` - 角色分类表
- `locations` - 地点表
- `stages` - 公司阶段表
- `comp_data` - **主表** (存放58,752条compensation数据)
- `generated_offers` - 用户生成的offer记录
- `free_tool_usage` - 免费工具使用记录

---

### 3. Credentials
**路径:** `/home/bill/.openclaw/workspace/roleoffer-data/credentials.txt`

```
SUPABASE_URL=https://nzlzknqmdvclgqdernkw.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bHprbnFtZHZjbGdxZGVybmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzExODEsImV4cCI6MjA0ODE0NzE4MX0.rQ9aSxjLGP7NHPsgAbguVA_FLg-RgwX4F_9ijm9PZNE
Database Password: LZsn@13471118
```

---

## 🚀 导入方法

### 方法1: Supabase Dashboard (推荐 - 最简单)

1. **登录 Supabase Dashboard**
   - https://supabase.com/dashboard
   - Project: roleoffer-prod

2. **执行Schema**
   - 左侧菜单 → SQL Editor
   - 复制 `supabase-schema-clean.sql` 内容
   - 点击 Run

3. **导入CSV**
   - 左侧菜单 → Table Editor → `comp_data`
   - 点击右上角 "Insert" → "Import data via spreadsheet"
   - 上传 `roleoffer_extended_dataset.csv`
   - 确认字段mapping
   - Import

**优点:**
- GUI界面，直观
- 无需命令行
- 自动字段mapping

**缺点:**
- 6.7MB文件可能需要几分钟上传
- 需要手动确认mapping

---

### 方法2: Supabase CLI

**前提:** 安装Supabase CLI
```bash
brew install supabase/tap/supabase
# or
npm install -g supabase
```

**步骤:**
```bash
cd /home/bill/.openclaw/workspace/roleoffer-data

# 1. Login
supabase login

# 2. Link to project
supabase link --project-ref nzlzknqmdvclgqdernkw

# 3. 执行schema
supabase db push

# 4. 导入CSV
psql "postgresql://postgres:LZsn@13471118@db.nzlzknqmdvclgqdernkw.supabase.co:5432/postgres" \
  -c "\COPY comp_data(stage,stage_label,location,location_label,role,role_label,level,level_label,level_name,percentile,salary,total_cash,equity_pct) FROM 'generated/roleoffer_extended_dataset.csv' WITH (FORMAT csv, HEADER true);"
```

**优点:**
- 快速 (直接数据库连接)
- 适合大文件
- 可重复执行

**缺点:**
- 需要安装CLI
- 需要配置数据库连接

---

### 方法3: Python Script (自动化)

**前提:** 安装依赖
```bash
pip install supabase pandas
```

**脚本:**
```python
import pandas as pd
from supabase import create_client

# Credentials
SUPABASE_URL = "https://nzlzknqmdvclgqdernkw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 初始化客户端
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 读取CSV
df = pd.read_csv('generated/roleoffer_extended_dataset.csv')

# 批量插入 (500行一批)
BATCH_SIZE = 500
for i in range(0, len(df), BATCH_SIZE):
    batch = df[i:i+BATCH_SIZE].to_dict('records')
    result = supabase.table('comp_data').insert(batch).execute()
    print(f"Inserted {i+len(batch)}/{len(df)} rows")
```

**优点:**
- 完全自动化
- 可以看到进度
- 处理错误容易

**缺点:**
- 需要写代码
- 较慢 (API限速)

---

## 🎯 推荐流程

**最简单:** Dashboard UI导入 (5分钟)
**最快:** psql COPY命令 (30秒)
**最可靠:** Python script with error handling

---

## ✅ 验证导入成功

### SQL查询
```sql
-- 检查总行数
SELECT COUNT(*) FROM comp_data;
-- 应该返回: 58752

-- 检查数据样本
SELECT * FROM comp_data LIMIT 10;

-- 按stage统计
SELECT stage_label, COUNT(*) FROM comp_data GROUP BY stage_label;

-- 按location统计
SELECT location_label, COUNT(*) FROM comp_data GROUP BY location_label;
```

### Expected结果
```
Total rows: 58,752
Stages: 6 ($1M-$10M, $10M-25M, $25M-50M, $50M-100M, $100M-200M, $200M+)
Locations: 8 (SF, NYC, Seattle, Austin, Boston, LA, Denver, Chicago)
Roles: 5 (Engineering, Product, Design, Sales, Marketing)
Levels: 9 (IC1-IC7, M1-M2)
Percentiles: 4 (p25, p50, p75, p90)
```

---

## 🔍 常见问题

### Q: CSV太大，Dashboard上传失败？
**A:** 使用psql COPY命令，或拆分成多个小文件

### Q: 字段mapping不对？
**A:** 确认CSV第一行是header，字段顺序和schema一致

### Q: 导入后数据为空？
**A:** 检查RLS (Row Level Security)策略，可能需要临时禁用

### Q: 性能慢？
**A:** 导入前先删除indexes，导入后再创建

---

## 📝 Schema注意事项

**当前Schema:**
- comp_data表是**非规范化**的 (denormalized)
- 所有数据都在一张表 (简化查询)
- 优点: 查询快，无需JOIN
- 缺点: 数据冗余 (58K rows)

**如需规范化:**
```sql
-- 可选: 将stage/location/role拆分到单独的表
-- 然后comp_data只存foreign keys
-- 优点: 数据更干净
-- 缺点: 查询需要JOIN，复杂度高
```

**推荐:** 先用denormalized版本，后期优化再考虑规范化

---

## 🎉 导入完成后

1. ✅ 验证数据量 (58,752 rows)
2. ✅ 测试查询性能
3. ✅ 配置RLS策略 (如果需要)
4. ✅ 创建indexes (提升查询速度)
5. ✅ 开始构建Next.js API routes

---

**准备好了吗？** 选一个方法开始导入！

**我的推荐:** 
1. 先用Dashboard试试 (熟悉数据结构)
2. 如果慢，用psql COPY (1分钟搞定)

**有问题随时问我！** 🚀
