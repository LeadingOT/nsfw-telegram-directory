#!/bin/bash

# Move AI Search from index.astro to BaseLayout for all sites

SITES=(
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
  "realestate-ai-directory"
)

WORKSPACE="/home/bill/.openclaw/workspace"

echo "🔧 Moving AI Search to BaseLayout for all sites..."
echo ""

for SITE in "${SITES[@]}"; do
  echo "📝 Processing $SITE..."
  
  LAYOUT_FILE="$WORKSPACE/$SITE/src/layouts/BaseLayout.astro"
  INDEX_FILE="$WORKSPACE/$SITE/src/pages/index.astro"
  
  # Check if BaseLayout exists
  if [ ! -f "$LAYOUT_FILE" ]; then
    echo "  ⚠️  BaseLayout.astro not found, skipping..."
    continue
  fi
  
  # Add import to BaseLayout if not exists
  if ! grep -q "import AISearch" "$LAYOUT_FILE"; then
    sed -i "/import.*global\.css/a import AISearch from '../components/AISearch.astro';" "$LAYOUT_FILE"
    echo "  ✅ Added AISearch import to BaseLayout"
  fi
  
  # Add component to main if not exists
  if ! grep -q "<AISearch" "$LAYOUT_FILE"; then
    sed -i 's|<main class="mx-auto|<main class="mx-auto max-w-6xl px-4 py-8">\n      <AISearch />\n      <slot />|' "$LAYOUT_FILE"
    # Fix if it was already formatted
    sed -i '/<main.*>/,/<\/main>/ { s|<slot />|<AISearch />\n      <slot />| }' "$LAYOUT_FILE"
    echo "  ✅ Added AISearch to BaseLayout main"
  fi
  
  # Remove from index.astro if exists
  if [ -f "$INDEX_FILE" ]; then
    if grep -q "import AISearch" "$INDEX_FILE"; then
      sed -i "/import AISearch/d" "$INDEX_FILE"
      echo "  ✅ Removed AISearch import from index.astro"
    fi
    if grep -q "<AISearch" "$INDEX_FILE"; then
      sed -i "/<AISearch/d" "$INDEX_FILE"
      # Also remove the comment line
      sed -i "/<!-- AI Search -->/d" "$INDEX_FILE"
      echo "  ✅ Removed AISearch component from index.astro"
    fi
  fi
  
  echo ""
done

echo "✅ Update complete!"
