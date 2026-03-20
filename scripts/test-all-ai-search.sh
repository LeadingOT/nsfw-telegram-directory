#!/bin/bash

# Test AI Search API on all 12 Directory Factory sites

echo "🧪 Testing AI Search API on all 12 sites..."
echo ""

SITES=(
  "accountingai.tools:best free accounting software"
  "aigirlfriend.tools:best free AI girlfriend"
  "hrai.tools:best free HR software"
  "legalai.tools:best free legal AI tools"
  "realestateai.tools:best free real estate AI"
  "bestwriting.tools:best free AI writing tools"
  "bestnootropics.info:best nootropics"
  "bestonlyfans.info:best OnlyFans creators"
  "bestanime.info:best anime streaming sites"
  "mattressrank.info:best mattresses"
  "bestofpodcasts.com:best podcasts"
  "nsfwtelegrambot.com:NSFW Telegram bots"
)

SUCCESS=0
FAILED=0

for SITE_INFO in "${SITES[@]}"; do
  SITE="${SITE_INFO%%:*}"
  QUERY="${SITE_INFO##*:}"
  
  echo "📍 Testing $SITE..."
  
  RESPONSE=$(curl -s -X POST "https://$SITE/api/ai-search" \
    -H "Content-Type: application/json" \
    -d "{\"query\":\"$QUERY\"}" \
    --max-time 15)
  
  if echo "$RESPONSE" | grep -q '"answer"'; then
    echo "   ✅ SUCCESS - API working"
    SUCCESS=$((SUCCESS + 1))
  elif echo "$RESPONSE" | grep -q "NOT_FOUND"; then
    echo "   ❌ FAILED - 404 (still deploying?)"
    FAILED=$((FAILED + 1))
  else
    echo "   ⚠️  UNKNOWN - Response:"
    echo "   $RESPONSE" | head -100
    FAILED=$((FAILED + 1))
  fi
  
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTS:"
echo "   ✅ Success: $SUCCESS / 12"
echo "   ❌ Failed:  $FAILED / 12"
echo ""

if [ $SUCCESS -eq 12 ]; then
  echo "🎉 All sites working!"
  exit 0
elif [ $SUCCESS -gt 0 ]; then
  echo "⏳ Some sites still deploying. Check again in 5-10 minutes."
  exit 1
else
  echo "❌ All sites failing. Check Vercel deployment logs."
  exit 2
fi
