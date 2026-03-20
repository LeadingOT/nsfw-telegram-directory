#!/bin/bash
# Batch update all directory sites to generate cross-category compare pages

DIRS=(
  "accountingai-directory"
  "legalai-directory"
  "hrai-directory"
  "realestateai-directory"
  "bestnootropics-directory"
  "bestonlyfans-directory"
  "bestanime-directory"
  "bestwriting-directory"
  "bestofpodcasts-directory"
  "mattressrank-directory"
  "nsfwtelegrambot-directory"
)

cd ~/.openclaw/workspace

for dir in "${DIRS[@]}"; do
  echo "=== Processing $dir ==="
  
  COMPARE_FILE="$dir/src/pages/compare/[slug].astro"
  
  # Check if compare page exists
  if [ ! -f "$COMPARE_FILE" ]; then
    echo "  ⚠️  No compare page found, skipping"
    continue
  fi
  
  # Read current file to get domain name
  DOMAIN=$(grep -o 'https://[^/]*' "$COMPARE_FILE" | head -1 | sed 's/https:\/\///')
  
  if [ -z "$DOMAIN" ]; then
    echo "  ⚠️  Could not extract domain, skipping"
    continue
  fi
  
  # Use Python to update the getStaticPaths function
  python3 << EOF
import re

with open("$COMPARE_FILE", "r") as f:
    content = f.read()

# Find and replace the getStaticPaths function
old_pattern = r'export async function getStaticPaths\(\) \{[^}]*(?:\{[^}]*\}[^}]*)*\s+return paths;\s+\}'

new_code = '''export async function getStaticPaths() {
  const listings = await getCollection('listings');
  const paths: any[] = [];
  
  // Extract all listings data
  const tools = listings.map(l => l.data);
  
  // Generate one page per ordered pair (A vs B where A < B alphabetically)
  // Now cross-category comparisons are allowed
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const [a, b] = [tools[i], tools[j]].sort((x, y) => x.slug.localeCompare(y.slug));
      paths.push({
        params: { slug: \`\${a.slug}-vs-\${b.slug}\` },
        props: { toolA: a, toolB: b },
      });
    }
  }
  
  return paths;
}'''

content = re.sub(old_pattern, new_code, content, flags=re.DOTALL)

with open("$COMPARE_FILE", "w") as f:
    f.write(content)

print("  ✅ Updated getStaticPaths")
EOF
  
  # Git commit and push
  cd "$dir"
  git add src/pages/compare/[slug].astro
  git commit -m "Generate ALL compare pages (cross-category) - ${dir}"
  git push origin main
  cd ..
  
  echo "  ✅ Pushed to main"
done

echo ""
echo "🚀 All sites updated and deployed!"
