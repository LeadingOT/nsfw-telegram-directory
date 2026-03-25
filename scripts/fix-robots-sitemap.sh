#!/bin/bash
# Fix robots.txt sitemap URLs for all 14 Directory Factory sites

SITES=(
  "accountingai-directory"
  "aigirlfriend-directory"
  "hrai-directory"
  "legalai-directory"
  "realestateai-directory"
  "bestwriting-directory"
  "bestnootropics-directory"
  "bestonlyfans-directory"
  "bestanime-directory"
  "mattressrank-directory"
  "bestofpodcasts-directory"
  "nsfw-telegram-directory"
  "bestaidetector-directory"
  "aihumanizer-directory"
)

echo "🔧 Fixing robots.txt sitemap URLs..."
echo ""

for site in "${SITES[@]}"; do
  if [ -d "$site" ]; then
    cd "$site"
    
    # Check if public/robots.txt exists
    if [ -f "public/robots.txt" ]; then
      # Replace sitemap.xml with sitemap-index.xml
      sed -i 's|Sitemap: https://\(.*\)/sitemap\.xml|Sitemap: https://\1/sitemap-index.xml|g' public/robots.txt
      
      echo "✅ Fixed: $site"
      grep "Sitemap:" public/robots.txt | head -1
    else
      echo "⚠️  No robots.txt: $site"
    fi
    
    cd ..
  else
    echo "❌ Not found: $site"
  fi
done

echo ""
echo "🎯 All robots.txt files fixed!"
echo ""
echo "Next steps:"
echo "1. git add -A"
echo "2. git commit -m 'fix: robots.txt sitemap URL (sitemap-index.xml)'"
echo "3. git push (all sites will auto-deploy via Vercel)"
