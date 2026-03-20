#!/bin/bash

# Deploy AI Search to all 12 Directory Factory sites

set -e

SITES=(
  "accountingai-directory"
  "aigirlfriend-directory"
  "bestanime-directory"
  "bestnootropics-directory"
  "bestofpodcasts-directory"
  "bestonlyfans-directory"
  "bestwriting-directory"
  "hrai-directory"
  "legalai-directory"
  "mattressrank-directory"
  "nsfw-telegram-directory"
  "realestateai-directory"
)

WORKSPACE="/home/bill/.openclaw/workspace"

echo "🚀 Deploying AI Search to all 12 sites..."
echo ""

for SITE in "${SITES[@]}"; do
  echo "📦 Processing $SITE..."
  
  SITE_DIR="$WORKSPACE/$SITE"
  
  if [ ! -d "$SITE_DIR" ]; then
    echo "  ⚠️  Directory not found, skipping..."
    continue
  fi
  
  # Create api directory if it doesn't exist
  mkdir -p "$SITE_DIR/src/pages/api"
  
  # Copy API route
  if [ ! -f "$SITE_DIR/src/pages/api/ai-search.ts" ]; then
    cp "$WORKSPACE/aigirlfriend-directory/src/pages/api/ai-search.ts" "$SITE_DIR/src/pages/api/ai-search.ts"
    echo "  ✅ API route copied"
  else
    echo "  ⏩ API route already exists"
  fi
  
  # Create components directory if it doesn't exist
  mkdir -p "$SITE_DIR/src/components"
  
  # Copy AISearch component
  if [ ! -f "$SITE_DIR/src/components/AISearch.astro" ]; then
    cp "$WORKSPACE/aigirlfriend-directory/src/components/AISearch.astro" "$SITE_DIR/src/components/AISearch.astro"
    echo "  ✅ AISearch component copied"
  else
    echo "  ⏩ AISearch component already exists"
  fi
  
  # Check if index.astro needs updating
  if ! grep -q "AISearch" "$SITE_DIR/src/pages/index.astro" 2>/dev/null; then
    echo "  ⚠️  index.astro needs manual update (adding import and component)"
  else
    echo "  ✅ index.astro already has AISearch"
  fi
  
  echo ""
done

echo "✅ Deployment complete!"
echo ""
echo "📝 Note: Some sites may need manual updates to index.astro to add:"
echo "   1. Import: import AISearch from '../components/AISearch.astro';"
echo "   2. Component: <AISearch /> (add after Hero section)"
