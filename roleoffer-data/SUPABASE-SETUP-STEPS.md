# Supabase Setup Steps

## Step 1: Execute Schema SQL

1. 在Supabase dashboard，点击左侧 **SQL Editor**
2. 点击 **+ New query**
3. 复制下面的文件内容粘贴进去：
   `~/.openclaw/workspace/roleoffer-data/supabase-schema.sql`
4. 点击 **Run** (或按 Cmd/Ctrl + Enter)
5. 看到 "Success. No rows returned" 就说明成功了

## Step 2: 验证表已创建

在SQL Editor执行：
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

应该看到这些表：
- comp_data
- free_tool_usage
- generated_offers
- locations
- roles
- stages

## Step 3: 告诉我完成了

执行完成后发消息说 "schema done"，我会继续下一步。
