#!/bin/bash
# Wait 5 minutes then verify all 500 errors are fixed

echo "⏱️  Waiting 5 minutes for Vercel deployment..."
echo "Started at: $(date)"
echo ""

for i in {300..1}; do
  mins=$((i / 60))
  secs=$((i % 60))
  printf "\rTime remaining: %02d:%02d" $mins $secs
  sleep 1
done

echo ""
echo ""
echo "🔍 Verifying all previously broken pages..."
echo ""

ERRORS=0

# Test pages that were returning 500
PAGES=(
  "https://accountingai.tools/compare/digits-vs-numeric/"
  "https://accountingai.tools/alternatives/bill/"
  "https://aigirlfriend.tools/compare/candy-ai-vs-darlink-ai/"
  "https://aigirlfriend.tools/alternatives/sillytavern/"
  "https://hrai.tools/compare/lattice-vs-15five/"
  "https://legalai.tools/compare/harvey-ai-vs-casetext/"
  "https://bestwriting.tools/blog/best-free-ai-writing-tools/"
)

for url in "${PAGES[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$status" == "200" ]; then
    echo "✅ $url"
  else
    echo "❌ $url (HTTP $status)"
    ERRORS=$((ERRORS + 1))
  fi
  
  sleep 1
done

echo ""
echo "=================================================="
if [ $ERRORS -eq 0 ]; then
  echo "✅ SUCCESS: All pages fixed!"
  echo "All 7 previously broken pages now return 200 OK"
else
  echo "❌ FAILED: $ERRORS pages still broken"
  echo "Check Vercel deployment logs"
fi
echo "=================================================="

exit $ERRORS
