#!/bin/bash

# Update index.astro for all sites to add AISearch component

set -e

SITES=(
  "accountingai-directory"
  "bestanime-directory"
  "bestnootropics-directory"
  "bestofpodcasts-directory"
  "bestonlyfans-directory"
  "bestwriting-directory"
  "hrai-directory"
  "legalai-directory"
  "mattressrank-directory"
  "nsfw-telegram-directory"
  "realestate-ai-directory"
)

WORKSPACE="/home/bill/.openclaw/workspace"

echo "🔧 Updating index.astro files..."
echo ""

for SITE in "${SITES[@]}"; do
  echo "📝 Processing $SITE..."
  
  SITE_DIR="$WORKSPACE/$SITE"
  INDEX_FILE="$SITE_DIR/src/pages/index.astro"
  
  if [ ! -f "$INDEX_FILE" ]; then
    echo "  ⚠️  index.astro not found, skipping..."
    continue
  fi
  
  # Check if already updated
  if grep -q "AISearch" "$INDEX_FILE"; then
    echo "  ⏩ Already has AISearch, skipping..."
    continue
  fi
  
  # Add import after other imports
  if grep -q "import ListingCard" "$INDEX_FILE"; then
    sed -i "/import ListingCard/a import AISearch from '../components/AISearch.astro';" "$INDEX_FILE"
    echo "  ✅ Added AISearch import"
  fi
  
  # Add component after Hero section (looking for </section> after text-center py-12)
  # This is a bit tricky, we'll add it before <!-- Categories --> or similar comment
  if grep -q "<!-- Categories -->" "$INDEX_FILE"; then
    sed -i "/<!-- Categories -->/i\  <!-- AI Search -->\n  <AISearch />\n" "$INDEX_FILE"
    echo "  ✅ Added AISearch component"
  elif grep -q "<!-- Listings" "$INDEX_FILE"; then
    sed -i "/<!-- Listings/i\  <!-- AI Search -->\n  <AISearch />\n" "$INDEX_FILE"
    echo "  ✅ Added AISearch component"
  else
    echo "  ⚠️  Could not find insertion point, needs manual update"
  fi
  
  echo ""
done

echo "✅ Update complete!"
