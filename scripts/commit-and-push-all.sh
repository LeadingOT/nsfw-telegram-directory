#!/bin/bash
# Commit and push all 14 sites

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

echo "📦 Committing and pushing all sites..."
echo ""

for site in "${SITES[@]}"; do
  if [ -d "$site" ]; then
    echo "Processing: $site"
    cd "$site"
    
    # Check if there are changes
    if [[ -n $(git status -s) ]]; then
      git add -A
      git commit -m "fix: robots.txt sitemap URL (sitemap-index.xml) - critical SEO fix"
      
      # Push to appropriate branch
      if [ "$site" == "realestateai-directory" ]; then
        git push origin master
      else
        git push origin main
      fi
      
      echo "✅ Pushed: $site"
    else
      echo "⏭️  No changes: $site"
    fi
    
    cd ..
    echo ""
  else
    echo "❌ Not found: $site"
  fi
done

echo "🎉 All sites committed and pushed!"
echo ""
echo "Vercel will auto-deploy within 1-2 minutes."
echo "Google will re-crawl robots.txt within hours and start indexing."
