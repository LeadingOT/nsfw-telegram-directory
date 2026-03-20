# RoleOffer Supabase 安全修复指南

## 🔴 问题

Supabase检测到7个安全漏洞，主要问题：
- **comp_data表没有启用RLS (Row Level Security)**
- 任何人都可以读取/修改/删除数据
- 这是严重的安全风险

---

## ✅ 解决方案（2分钟修复）

### 步骤1：打开Supabase SQL Editor

1. 访问: https://supabase.com/dashboard/project/nzlzknqmdvclgqdernkw/sql/new
2. 或者: Dashboard → SQL Editor → New Query

### 步骤2：执行修复SQL

复制粘贴以下SQL（或直接使用 `security-fix.sql`）：

```sql
-- 启用Row Level Security
ALTER TABLE comp_data ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取（公开数据）
CREATE POLICY "Allow public read access"
ON comp_data
FOR SELECT
TO public
USING (true);
```

点击 **Run** 按钮。

### 步骤3：验证修复

在同一个SQL Editor中运行：

```sql
-- 检查RLS是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'comp_data';
```

**预期结果**: `rowsecurity = true`

---

## 🔒 安全策略说明

修复后的安全模型：

| 操作 | 匿名用户 | 认证用户 | Service Role |
|------|----------|----------|--------------|
| **SELECT (读取)** | ✅ 允许 | ✅ 允许 | ✅ 允许 |
| **INSERT (插入)** | ❌ 禁止 | ❌ 禁止 | ✅ 允许 |
| **UPDATE (更新)** | ❌ 禁止 | ❌ 禁止 | ✅ 允许 |
| **DELETE (删除)** | ❌ 禁止 | ❌ 禁止 | ✅ 允许 |

**为什么这样设计？**
- comp_data是**公开的benchmark数据**，所有人都应该能读取
- 但只有**管理员**（通过service role）才能修改数据
- 这防止了恶意用户篡改我们的数据

---

## 🧪 测试修复是否生效

### Test 1: 公开读取（应该成功）

```bash
curl "https://nzlzknqmdvclgqdernkw.supabase.co/rest/v1/comp_data?select=*&limit=1" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bHprbnFtZHZjbGdxZGVybmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzgxNDQsImV4cCI6MjA4NzY1NDE0NH0.Zb3U1FNwddkb78gtCcsQ5p0gJrKUlq9WAXLbjVaWvXo" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bHprbnFtZHZjbGdxZGVybmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzgxNDQsImV4cCI6MjA4NzY1NDE0NH0.Zb3U1FNwddkb78gtCcsQ5p0gJrKUlq9WAXLbjVaWvXo"
```

**预期**: 返回1条数据 ✅

### Test 2: 匿名插入（应该被阻止）

```bash
curl -X POST "https://nzlzknqmdvclgqdernkw.supabase.co/rest/v1/comp_data" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bHprbnFtZHZjbGdxZGVybmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNzgxNDQsImV4cCI6MjA4NzY1NDE0NH0.Zb3U1FNwddkb78gtCcsQ5p0gJrKUlq9WAXLbjVaWvXo" \
  -H "Content-Type: application/json" \
  -d '{"stage":"seed","role":"engineering","salary":999999}'
```

**预期**: 返回错误 "new row violates row-level security policy" ✅

---

## 📊 预期修复后的Security Advisor报告

修复后，Security Advisor应该显示：
- ✅ **0 errors** (从7个减少到0)
- ✅ comp_data表RLS已启用
- ✅ 有1个SELECT policy

如果还有其他警告（如auth.users表），那是Supabase默认表，可以忽略。

---

## ⚠️ 重要：RoleOffer网站不受影响

**好消息**: 
- 我们的Next.js app使用的是**ANON key**进行读取
- 修复后依然可以正常读取数据
- **不需要重新部署网站**

修复只是加了安全防护，不影响现有功能。

---

## 🔄 如果需要未来更新数据

如果你需要从CSV重新导入数据（更新benchmark）：

### 方法1: 通过Dashboard（推荐）
1. Dashboard → Table Editor → comp_data
2. 右上角 "..." → Truncate table (清空)
3. Import CSV (重新导入)

### 方法2: 使用Service Role Key
在导入脚本中使用service_role key（不是anon key），它可以绕过RLS。

**Service Role Key位置**: Dashboard → Settings → API → service_role (secret)

---

## 📝 总结

**执行步骤:**
1. 打开Supabase SQL Editor
2. 复制粘贴 `security-fix.sql` 内容
3. 点击Run
4. 验证RLS已启用
5. （可选）测试读取/插入操作

**预计时间**: 2分钟

**影响**: 
- ✅ 修复安全漏洞
- ✅ 保护数据不被篡改
- ✅ 网站继续正常工作

完成后Security Advisor应该显示0 errors。
