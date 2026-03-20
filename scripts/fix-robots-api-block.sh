#!/bin/bash
# Fix robots.txt to block /api/ paths on all 14 directory sites

set -e

SITES=(
  "accountingai-directory:accountingai.tools"
  "aigirlfriend-directory:aigirlfriend.tools"
  "hrai-directory:hrai.tools"
  "legalai-directory:legalai.tools"
  "realestateai-directory:realestateai.tools"
  "bestnootropics-directory:bestnootropics.info"
  "bestwriting-directory:bestwriting.tools"
  "bestaidetector-directory:bestaidetector.tools"
  "aihumanizer-directory:aihumanizer.tools"
  "bestanime-directory:bestanime.info"
  "bestonlyfans-directory:bestonlyfans.info"
  "bestofpodcasts-directory:bestofpodcasts.com"
  "mattressrank-directory:mattressrank.info"
  "nsfw-telegram-directory:nsfwtelegrambot.com"
)

WORKSPACE="/home/bill/.openclaw/workspace"
cd "$WORKSPACE"

echo "🔧 Fixing robots.txt for 14 sites..."
echo ""

for entry in "${SITES[@]}"; do
  IFS=':' read -r dir domain <<< "$entry"
  
  if [ ! -d "$dir" ]; then
    echo "⚠️  $dir not found, skipping..."
    continue
  fi
  
  ROBOTS_FILE="$dir/public/robots.txt"
  
  if [ ! -f "$ROBOTS_FILE" ]; then
    echo "⚠️  $ROBOTS_FILE not found, skipping..."
    continue
  fi
  
  # Check if already has Disallow: /api/
  if grep -q "Disallow: /api/" "$ROBOTS_FILE"; then
    echo "✅ $domain - already has /api/ block"
    continue
  fi
  
  # Add Disallow: /api/ after "User-agent: *" and "Allow: /"
  sed -i '/^Allow: \/$/a Disallow: /api/' "$ROBOTS_FILE"
  
  echo "✅ $domain - added Disallow: /api/"
done

echo ""
echo "🎯 Committing changes..."

for entry in "${SITES[@]}"; do
  IFS=':' read -r dir domain <<< "$entry"
  
  if [ ! -d "$dir" ]; then
    continue
  fi
  
  cd "$WORKSPACE/$dir"
  
  if git diff --quiet public/robots.txt 2>/dev/null; then
    continue
  fi
  
  git add public/robots.txt
  git commit -m "fix: block /api/ in robots.txt to prevent GSC indexing errors"
  
  # Get default branch
  BRANCH=$(git symbolic-ref --short HEAD)
  git push origin "$BRANCH"
  
  echo "✅ $domain - committed and pushed"
done

echo ""
echo "✅ All done! Vercel will auto-deploy."
