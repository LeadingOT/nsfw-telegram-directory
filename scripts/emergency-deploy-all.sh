#!/bin/bash
# Emergency deployment - commit and push all 14 directory sites

set -e

echo "🚨 Emergency Deployment - All Directory Sites"
echo "=============================================="
echo ""

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
  echo "📝 $dir"
  cd "$dir"
  
  git add -A
  git commit -m "🚨 CRITICAL FIX: Sitemap crisis resolution

- Fixed robots.txt sitemap URLs (sitemap-index.xml → sitemap.xml)
- Added @astrojs/sitemap integration
- Changed output from 'server' to 'hybrid'
- Added prerender to all getStaticPaths pages
- Fixes:
  * 404 sitemap errors
  * 500 errors on /alternatives and /compare pages
  * Missing ~9,000 pages from sitemap" || echo "   (no changes to commit)"
  
  # Get current branch
  branch=$(git rev-parse --abbrev-ref HEAD)
  echo "   Pushing to $branch..."
  git push origin "$branch"
  
  cd ~/.openclaw/workspace
  echo "   ✅ Deployed"
  echo ""
done

echo ""
echo "✅ All 14 sites deployed!"
echo ""
echo "⏳ Vercel will auto-deploy in ~3-5 minutes"
echo ""
echo "Next: Monitor deployments at https://vercel.com/leadingots-projects"
