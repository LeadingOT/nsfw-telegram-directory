#!/bin/bash
# Wait 10 minutes for Vercel deployment, then verify canonical URLs

echo "⏱️  Waiting 10 minutes for Vercel deployment to complete..."
echo "Started at: $(date)"
echo ""

# Countdown timer
for i in {600..1}; do
  mins=$((i / 60))
  secs=$((i % 60))
  printf "\rTime remaining: %02d:%02d" $mins $secs
  sleep 1
done

echo ""
echo ""
echo "🚀 Vercel deployment should be complete. Running verification..."
echo ""

cd /home/bill/.openclaw/workspace
node scripts/verify-canonical-urls.mjs

exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo ""
  echo "✅ All canonical URLs verified successfully!"
  echo "📝 Next step: Request re-indexing in GSC"
else
  echo ""
  echo "❌ Some issues found. Check output above."
  echo "💡 Try running again in 5 minutes if Vercel is still deploying."
fi

exit $exit_code
