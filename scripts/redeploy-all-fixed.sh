#!/bin/bash
set -e

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
  echo "🚀 $dir"
  cd "$dir"
  git add -A
  git commit -m "fix: move prerender inside frontmatter (Astro requirement)" || echo "   (no changes)"
  branch=$(git rev-parse --abbrev-ref HEAD)
  git push origin "$branch"
  cd ~/.openclaw/workspace
  echo ""
done

echo "✅ All sites redeployed!"
