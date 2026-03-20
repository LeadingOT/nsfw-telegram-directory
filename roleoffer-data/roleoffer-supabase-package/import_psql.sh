#!/bin/bash

# RoleOffer Supabase Import via psql
# Fastest method - completes in ~30 seconds

set -e

# Configuration
DB_HOST="db.nzlzknqmdvclgqdernkw.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# Ask for password
echo "🔐 Enter Supabase database password:"
read -s DB_PASSWORD
export PGPASSWORD="$DB_PASSWORD"

echo ""
echo "📊 RoleOffer Supabase Import"
echo "============================"
echo ""

# Test connection
echo "🔍 Testing connection..."
psql "postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME" -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Connected to Supabase"
else
  echo "❌ Connection failed. Check password and network."
  exit 1
fi

# Step 1: Create schema
echo ""
echo "📋 Creating schema..."
psql "postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME" -f schema.sql

echo "✅ Schema created"

# Step 2: Import CSV
echo ""
echo "📦 Importing 58,752 rows..."
echo "   (This will take ~30 seconds)"

FULL_PATH="$(pwd)/data_full.csv"

psql "postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME" << SQL
\COPY comp_data(stage,stage_label,location,location_label,role,role_label,level,level_label,level_name,percentile,salary,total_cash,equity_pct) FROM '$FULL_PATH' WITH (FORMAT csv, HEADER true);
SQL

echo "✅ Import complete!"

# Step 3: Verify
echo ""
echo "🔍 Verifying import..."

ROW_COUNT=$(psql "postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME" -t -c "SELECT COUNT(*) FROM comp_data;")

echo "✅ Row count: $ROW_COUNT"

if [ "$ROW_COUNT" -eq 58752 ]; then
  echo "🎉 SUCCESS! All 58,752 rows imported."
else
  echo "⚠️  Expected 58,752 rows, got $ROW_COUNT"
fi

# Show sample data
echo ""
echo "📊 Sample data:"
psql "postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME" -c "SELECT * FROM comp_data LIMIT 5;"

echo ""
echo "🎉 Import complete!"
echo ""
echo "Next steps:"
echo "  1. Verify data in Supabase Dashboard"
echo "  2. Create indexes for performance"
echo "  3. Build Next.js API routes"
