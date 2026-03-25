#!/bin/bash
# Fix prerender position - must be inside frontmatter

set -e

echo "🔧 Fixing prerender position in all sites..."
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
)

cd ~/.openclaw/workspace

for dir in "${SITES[@]}"; do
  echo "📝 $dir"
  
  # Find all .astro files with misplaced prerender
  files=$(find "$dir/src/pages" -name "*.astro" -type f 2>/dev/null || true)
  
  for file in $files; do
    # Check if file has prerender outside frontmatter
    if grep -q "^export const prerender = true;" "$file" 2>/dev/null; then
      # Remove the misplaced line
      sed -i '/^export const prerender = true;$/d' "$file"
      
      # Add it inside frontmatter (after imports, before getStaticPaths)
      awk '
        /^export async function getStaticPaths/ {
          print "export const prerender = true;"
          print ""
        }
        {print}
      ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
      
      echo "   ✅ Fixed: $file"
    fi
  done
  
  echo ""
done

echo "✅ All prerender statements fixed!"
