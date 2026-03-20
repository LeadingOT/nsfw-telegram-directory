#!/bin/bash
# Fix AI Search system prompts for all directory sites

SITES=(
  "accountingai-directory:accounting and finance automation"
  "aigirlfriend-directory:AI girlfriend and companion"
  "bestanime-directory:anime streaming and recommendations"
  "bestnootropics-directory:nootropics and cognitive enhancement"
  "bestofpodcasts-directory:podcast hosting and discovery"
  "bestonlyfans-directory:OnlyFans creators and content"
  "bestwriting-directory:AI writing and content creation"
  "hrai-directory:HR and people management"
  "legalai-directory:legal AI and law practice automation"
  "mattressrank-directory:mattress reviews and sleep products"
  "nsfw-telegram-directory:NSFW Telegram bots and channels"
  "realestate-ai-directory:real estate and property technology"
  "bestaidetector-directory:AI detection for text, images, and videos"
  "aihumanizer-directory:AI text humanization and content bypass"
)

WORKSPACE="/home/bill/.openclaw/workspace"

for site in "${SITES[@]}"; do
  DIR="${site%:*}"
  TOPIC="${site#*:}"
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📝 Fixing $DIR"
  echo "   Topic: $TOPIC"
  
  cd "$WORKSPACE/$DIR" || continue
  
  # Check if ai-search.ts exists
  if [ ! -f "src/pages/api/ai-search.ts" ]; then
    echo "   ⚠️  No AI Search file found, skipping"
    continue
  fi
  
  # Update the system prompt
  sed -i "s/You are an AI assistant for an AI girlfriend\/companion tools directory\./You are an AI assistant for a $TOPIC tools directory./g" src/pages/api/ai-search.ts
  
  # Also add off-topic detection
  # This is a more complex change, will do separately
  
  echo "   ✅ Updated system prompt"
  
  # Commit if changes
  if git diff --quiet src/pages/api/ai-search.ts; then
    echo "   ℹ️  No changes needed"
  else
    git add src/pages/api/ai-search.ts
    git commit -m "Fix: Update AI Search system prompt for $TOPIC"
    git push origin main
    echo "   ✅ Committed and pushed"
  fi
  
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All sites updated!"
