# RoleOffer Supabase Import Package

## 📁 Files

- `schema.sql` - Database schema (6 tables)
- `data_full.csv` - Complete dataset (58,752 rows, 6.7MB)
- `data_sample.csv` - Sample dataset (1,000 rows for testing)
- `import_dashboard.md` - Dashboard import guide
- `import_psql.sh` - psql import script

## 🚀 Quick Start (Dashboard UI - Easiest)

1. **Login to Supabase**
   - https://supabase.com/dashboard
   - Project: roleoffer-prod

2. **Create Schema**
   - SQL Editor → New query
   - Copy/paste content from `schema.sql`
   - Click Run

3. **Import Data**
   - Table Editor → comp_data
   - Insert → Import via spreadsheet
   - Upload `data_full.csv`
   - Map columns (auto-detected)
   - Import

## ⚡ Quick Start (psql - Fastest)

```bash
# Replace PASSWORD with your database password
export PGPASSWORD="YOUR_PASSWORD"

# 1. Create schema
psql "postgresql://postgres@db.nzlzknqmdvclgqdernkw.supabase.co:5432/postgres" \
  -f schema.sql

# 2. Import data
psql "postgresql://postgres@db.nzlzknqmdvclgqdernkw.supabase.co:5432/postgres" \
  -c "\COPY comp_data(stage,stage_label,location,location_label,role,role_label,level,level_label,level_name,percentile,salary,total_cash,equity_pct) FROM 'data_full.csv' WITH (FORMAT csv, HEADER true);"
```

## ✅ Verify Import

```sql
-- Check row count
SELECT COUNT(*) FROM comp_data;
-- Expected: 58752

-- Check stages
SELECT stage_label, COUNT(*) FROM comp_data GROUP BY stage_label;
-- Expected: 6 stages

-- Sample data
SELECT * FROM comp_data LIMIT 10;
```

## 📊 Data Structure

- **58,752 rows** total
- **6 funding stages** ($1M-$10M → $200M+)
- **8 locations** (SF, NYC, Seattle, Austin, Boston, LA, Denver, Chicago)
- **5 roles** (Engineering, Product, Design, Sales, Marketing)
- **9 levels** (IC1-IC7, M1-M2)
- **4 percentiles** (p25, p50, p75, p90)

## 🔍 Troubleshooting

**CSV upload fails?**
- Try `data_sample.csv` first (only 1,000 rows)
- Or use psql method (much faster)

**"Invalid API key"?**
- You don't need API keys for psql
- Use database password instead

**RLS errors?**
- Temporarily disable RLS on comp_data table
- SQL: `ALTER TABLE comp_data DISABLE ROW LEVEL SECURITY;`

## 📝 Next Steps After Import

1. ✅ Verify data (see queries above)
2. ✅ Create indexes for performance
3. ✅ Set up RLS policies (if needed)
4. ✅ Build Next.js API routes
5. ✅ Start generating pSEO pages

---

**Questions?** Check the main guide or ask for help!
