#!/bin/bash

# Import RoleOffer compensation data to Supabase
# Uses REST API directly (no client library needed)

set -e

# Credentials
SUPABASE_URL="https://nzlzknqmdvclgqdernkw.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bHprbnFtZHZjbGdxZGVybmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzExODEsImV4cCI6MjA0ODE0NzE4MX0.rQ9aSxjLGP7NHPsgAbguVA_FLg-RgwX4F_9ijm9PZNE"

# Check if table exists first
echo "📊 Checking Supabase connection..."
curl -s -X GET "$SUPABASE_URL/rest/v1/comp_data?limit=1" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Connected to Supabase"
else
  echo "❌ Cannot connect to Supabase - check credentials"
  exit 1
fi

# Count existing records
EXISTING=$(curl -s -X GET "$SUPABASE_URL/rest/v1/comp_data?select=count" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')

echo "📈 Current records in comp_data: $EXISTING"

if [ "$EXISTING" -gt 0 ]; then
  echo "⚠️  Table already has data. Do you want to delete and re-import? (yes/no)"
  read -r response
  if [ "$response" != "yes" ]; then
    echo "❌ Import cancelled"
    exit 0
  fi
  
  echo "🗑️  Deleting existing data..."
  curl -X DELETE "$SUPABASE_URL/rest/v1/comp_data?id=neq.00000000-0000-0000-0000-000000000000" \
    -H "apikey: $SUPABASE_KEY" \
    -H "Authorization: Bearer $SUPABASE_KEY"
  echo "✅ Existing data deleted"
fi

echo ""
echo "📦 Starting import of 58,752 records..."
echo "⏰ This will take ~10-15 minutes (batch uploads)"
echo ""

# Use Python to read CSV and batch insert via REST API
python3 << 'PYTHON'
import csv
import json
import subprocess
import sys

SUPABASE_URL = "https://nzlzknqmdvclgqdernkw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bHprbnFtZHZjbGdxZGVybmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NzExODEsImV4cCI6MjA0ODE0NzE4MX0.rQ9aSxjLGP7NHPsgAbguVA_FLg-RgwX4F_9ijm9PZNE"

CSV_FILE = "/home/bill/.openclaw/workspace/roleoffer-data/generated/roleoffer_extended_dataset.csv"
BATCH_SIZE = 500  # Supabase recommends 500-1000 rows per request

def insert_batch(batch):
    """Insert a batch of records via REST API"""
    # Convert batch to JSON array format
    json_data = json.dumps(batch)
    
    # Use curl to POST
    cmd = [
        'curl', '-X', 'POST',
        f'{SUPABASE_URL}/rest/v1/comp_data',
        '-H', f'apikey: {SUPABASE_KEY}',
        '-H', f'Authorization: Bearer {SUPABASE_KEY}',
        '-H', 'Content-Type: application/json',
        '-H', 'Prefer: return=minimal',
        '-d', json_data
    ]
    
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        print(f"❌ Error inserting batch: {result.stderr.decode()}", file=sys.stderr)
        return False
    return True

# Read CSV and batch insert
batch = []
total_inserted = 0
total_rows = 0

print("📖 Reading CSV file...")

with open(CSV_FILE, 'r') as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        total_rows += 1
        
        # Convert CSV row to Supabase format
        # Note: This is simplified - we're storing everything in comp_data
        # In production, you'd normalize into roles/locations/stages first
        record = {
            'stage': row['stage'],
            'stage_label': row['stage_label'],
            'location': row['location'],
            'location_label': row['location_label'],
            'role': row['role'],
            'role_label': row['role_label'],
            'level': row['level'],
            'level_label': row['level_label'],
            'level_name': row['level_name'],
            'percentile': row['percentile'],
            'salary': int(float(row['salary'])),
            'total_cash': int(float(row['total_cash'])),
            'equity_pct': float(row['equity_pct'])
        }
        
        batch.append(record)
        
        # Insert when batch is full
        if len(batch) >= BATCH_SIZE:
            if not insert_batch(batch):
                print(f"❌ Failed at row {total_rows}", file=sys.stderr)
                sys.exit(1)
            
            total_inserted += len(batch)
            print(f"✅ Inserted {total_inserted}/{total_rows} rows ({int(total_inserted/total_rows*100)}%)")
            batch = []

# Insert remaining rows
if batch:
    if insert_batch(batch):
        total_inserted += len(batch)
        print(f"✅ Final batch inserted: {total_inserted}/{total_rows}")
    else:
        print(f"❌ Failed on final batch", file=sys.stderr)
        sys.exit(1)

print(f"\n🎉 Import complete! {total_inserted} records imported.")
PYTHON

echo ""
echo "🎉 Import completed!"
echo ""
echo "📊 Verifying..."
FINAL_COUNT=$(curl -s -X GET "$SUPABASE_URL/rest/v1/comp_data?select=count" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')

echo "✅ Total records in database: $FINAL_COUNT"
