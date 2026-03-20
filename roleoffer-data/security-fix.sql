-- RoleOffer Security Fix
-- 修复Supabase安全警告（7个错误）

-- 1. 启用Row Level Security (RLS)
ALTER TABLE comp_data ENABLE ROW LEVEL SECURITY;

-- 2. 允许所有人读取数据（公开benchmark数据）
CREATE POLICY "Allow public read access"
ON comp_data
FOR SELECT
TO public
USING (true);

-- 3. 禁止匿名用户INSERT/UPDATE/DELETE（只有service role可以操作）
-- （默认策略：没有INSERT/UPDATE/DELETE policy = 禁止操作）

-- 验证RLS是否启用
SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'comp_data';

-- 验证policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'comp_data';

-- 预期结果:
-- RLS Enabled: true
-- 1 policy: "Allow public read access" (SELECT only)
