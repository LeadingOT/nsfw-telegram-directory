# Supabase Dashboard Import Guide

## Step 1: Login

1. Go to https://supabase.com/dashboard
2. Select project: **roleoffer-prod**

## Step 2: Create Schema

1. Click **SQL Editor** in left sidebar
2. Click **New query**
3. Open `schema.sql` file
4. Copy all content (Ctrl+A, Ctrl+C)
5. Paste into SQL Editor
6. Click **Run** (or Ctrl+Enter)

**Expected output:** "Success. No rows returned."

## Step 3: Verify Tables Created

1. Click **Table Editor** in left sidebar
2. You should see 6 tables:
   - roles
   - locations
   - stages
   - comp_data ← Main table
   - generated_offers
   - free_tool_usage

## Step 4: Import CSV to comp_data

### Option A: Via Table Editor (GUI)

1. Click on **comp_data** table
2. Click **Insert** dropdown → **Import data via spreadsheet**
3. Click **Upload CSV**
4. Select `data_full.csv` (or `data_sample.csv` for testing)
5. Wait for upload (may take 1-2 minutes for full file)
6. **Verify column mapping:**
   - CSV columns should auto-map to table columns
   - Ensure all 13 columns match
7. Click **Import**
8. Wait for import to complete

### Option B: Via SQL Editor

1. This doesn't work well for CSV
2. Use psql method instead (see README.md)

## Step 5: Verify Import

1. Go to **Table Editor** → **comp_data**
2. You should see 58,752 rows (or 1,000 for sample)
3. Click through a few rows to verify data looks correct

Or run this SQL query:

```sql
SELECT COUNT(*) as total_rows FROM comp_data;
```

Expected: 58752 (or 1000 for sample)

## Step 6: Check Data Distribution

```sql
-- By stage
SELECT stage_label, COUNT(*) 
FROM comp_data 
GROUP BY stage_label 
ORDER BY COUNT(*) DESC;

-- By location
SELECT location_label, COUNT(*) 
FROM comp_data 
GROUP BY location_label 
ORDER BY COUNT(*) DESC;

-- By role
SELECT role_label, COUNT(*) 
FROM comp_data 
GROUP BY role_label 
ORDER BY COUNT(*) DESC;
```

## Troubleshooting

### "Upload failed" or timeout
- File too large for browser upload
- **Solution:** Use psql method or split CSV into smaller files

### "Column mismatch"
- CSV headers don't match table columns
- **Solution:** Verify CSV has these exact columns:
  `stage,stage_label,location,location_label,role,role_label,level,level_label,level_name,percentile,salary,total_cash,equity_pct`

### "Permission denied"
- RLS policy blocking insert
- **Solution:** Temporarily disable RLS:
  ```sql
  ALTER TABLE comp_data DISABLE ROW LEVEL SECURITY;
  ```

---

**Done!** You now have 58,752 compensation benchmarks in Supabase 🎉
