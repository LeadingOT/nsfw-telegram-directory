# 获取Supabase API Keys

## 🔑 需要获取正确的API Keys才能自动导入

credentials.txt里的keys格式不对，需要完整的JWT格式。

---

## 📋 获取步骤

1. **登录Supabase Dashboard**
   - https://supabase.com/dashboard
   - 选择项目: **roleoffer-prod**

2. **进入Settings → API**
   - 左侧菜单 → **Settings** (齿轮图标)
   - 选择 **API**

3. **复制Keys**
   
   找到这两个keys（都是很长的JWT格式）：
   
   **anon / public key:** (以 `eyJ` 开头)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...很长...
   ```
   
   **service_role key:** (以 `eyJ` 开头，secret)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...很长...
   ```

4. **保存到文件**
   
   把keys填入这个文件：
   `/home/bill/.openclaw/workspace/roleoffer-data/API_KEYS.txt`
   
   格式：
   ```
   SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

---

## 🚀 然后我就能自动导入了

有了正确的keys后，我可以：
1. 测试连接
2. 创建schema (如果需要)
3. 批量导入58,752行数据
4. 显示实时进度
5. 验证导入成功

---

## 🔄 或者你自己用psql导入（不需要API keys）

如果你想立即导入，不等API keys：

```bash
cd /home/bill/.openclaw/workspace/roleoffer-data
tar -xzf roleoffer-supabase-import.tar.gz
cd roleoffer-supabase-package
./import_psql.sh
```

输入数据库密码: `LZsn@13471118`

这个方法30秒就完成，不需要API keys。

---

**你选哪个方法？**
1. 给我API keys，我自动导入
2. 你自己用psql导入包（最快）
