#!/bin/bash
# Deploy all 14 directory sites to Vercel

set -e

echo "🚀 Deploying all directory sites to Vercel..."
echo "=============================================="
echo ""

# Commit changes first
echo "📝 Committing changes..."
cd ~/.openclaw/workspace

git add -A
git commit -m "🚨 CRITICAL FIX: Sitemap crisis resolution

- Fixed robots.txt sitemap URLs (sitemap-index.xml → sitemap.xml)
- Fixed 5 sites with example.com references
- Fixed 2 sites with wrong domain references
- Added @astrojs/sitemap integration to all 14 sites
- Changed output from 'server' to 'hybrid'
- Added prerender to all getStaticPaths pages
- This fixes:
  * 404 sitemap errors (all 14 sites)
  * 500 errors on /alternatives and /compare pages (~1,100 pages)
  * Missing ~9,000 pages from sitemap

Expected impact: Full re-indexation within 1-2 weeks" || echo "Nothing to commit or already committed"

echo ""
echo "🔄 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code committed and pushed"
echo ""
echo "🚀 Triggering Vercel deployments..."
echo "   (Vercel auto-deploys on git push)"
echo ""
echo "⏳ Deployments will complete in ~3-5 minutes"
echo ""
echo "Next steps:"
echo "1. Wait for Vercel deployments to complete"
echo "2. Test sitemap URLs: curl https://[site]/sitemap.xml"
echo "3. Test pSEO pages: curl https://[site]/alternatives/[tool]"
echo "4. Submit sitemaps to GSC"
