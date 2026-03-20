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
)

echo "🚀 Committing AI Search prompt fixes..."
echo

for site in "${SITES[@]}"; do
  if [ -d "$HOME/.openclaw/workspace/$site" ]; then
    cd "$HOME/.openclaw/workspace/$site"
    
    # Check if there are changes
    if git diff --quiet src/pages/api/ai-search.ts; then
      echo "⏭️  $site - no changes"
    else
      git add src/pages/api/ai-search.ts
      git commit -m "fix: update AI search system prompt with site-specific context and off-topic handling"
      git push origin HEAD
      echo "✅ $site - committed & pushed"
    fi
  else
    echo "⚠️  $site - directory not found"
  fi
done

echo
echo "✅ All sites committed!"
echo "🔄 Vercel will auto-deploy in ~2 minutes"
