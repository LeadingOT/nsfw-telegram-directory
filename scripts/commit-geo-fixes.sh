#!/bin/bash

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
  "realestateai-directory"
)

echo "🚀 Committing GEO optimization fixes..."
echo

for site in "${SITES[@]}"; do
  if [ -d "$HOME/.openclaw/workspace/$site" ]; then
    cd "$HOME/.openclaw/workspace/$site"
    
    # Check if there are changes
    if git diff --quiet; then
      echo "⏭️  $site - no changes"
    else
      git add -A
      git commit -m "feat(geo): add AI crawler rules + Organization/WebSite schema for GEO optimization"
      git push origin HEAD
      echo "✅ $site - committed & pushed"
    fi
  else
    echo "⚠️  $site - directory not found"
  fi
done

echo
echo "✅ All GEO fixes committed!"
echo "🔄 Vercel will auto-deploy in ~2 minutes"
