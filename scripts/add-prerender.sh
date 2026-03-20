#!/bin/bash
# Add 'export const prerender = true;' to all pages using getStaticPaths
# This is required for hybrid mode to work correctly

set -e

echo "🔧 Phase 3: Adding prerender to static pages..."
echo ""

SITES=(
  "accountingai-directory"
  "aigirlfriend-directory"
  "aihumanizer-directory"
  "bestaidetector-directory"
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
  "realestateai-directory"
)

cd ~/.openclaw/workspace

for dir in "${SITES[@]}"; do
  if [ ! -d "$dir/src/pages" ]; then
    echo "⚠️  $dir: src/pages not found, skipping"
    continue
  fi
  
  echo "📝 Processing $dir..."
  
  # Find all .astro files with getStaticPaths
  files=$(grep -rl "getStaticPaths" "$dir/src/pages" --include="*.astro" 2>/dev/null || true)
  
  if [ -z "$files" ]; then
    echo "   ℹ️  No getStaticPaths files found"
    continue
  fi
  
  for file in $files; do
    # Check if prerender already exists
    if grep -q "export const prerender" "$file"; then
      echo "   ✓ $file (already has prerender)"
      continue
    fi
    
    # Add prerender after the --- block
    # Find the first line after frontmatter and add prerender
    awk '
      /^---$/ { 
        frontmatter++
        print
        if (frontmatter == 2) {
          print "export const prerender = true;"
          print ""
        }
        next
      }
      { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    
    echo "   ✅ $file"
  done
  
  echo ""
done

echo ""
echo "✅ Phase 3 Complete: All static pages now have prerender"
