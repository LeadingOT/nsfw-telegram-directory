#!/bin/bash
set -e

SITES=(
  "accountingai-directory" "aigirlfriend-directory" "aihumanizer-directory"
  "bestaidetector-directory" "bestanime-directory" "bestnootropics-directory"
  "bestofpodcasts-directory" "bestonlyfans-directory" "bestwriting-directory"
  "hrai-directory" "legalai-directory" "mattressrank-directory"
  "nsfw-telegram-directory" "realestate-ai-directory"
)

cd ~/.openclaw/workspace

for dir in "${SITES[@]}"; do
  echo "🚀 $dir"
  cd "$dir"
  git add -A
  git commit -m "fix: use output='server' instead of removed 'hybrid' option

Astro v4+ removed hybrid mode. Using server mode with prerender for static pages." || echo "   (no changes)"
  branch=$(git rev-parse --abbrev-ref HEAD)
  git push origin "$branch"
  cd ~/.openclaw/workspace
done

echo ""
echo "✅ All 14 sites deployed!"
echo "⏳ Vercel building... ETA 3-5 min"
