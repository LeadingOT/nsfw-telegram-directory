#!/bin/bash
# Emergency Sitemap Crisis Fix Script
# 2026-03-20

set -e

echo "🚨 Directory Factory Sitemap Crisis Fix"
echo "========================================"
echo ""

# Site mappings: directory-name → domain
declare -A SITES=(
  ["accountingai-directory"]="accountingai.tools"
  ["aigirlfriend-directory"]="aigirlfriend.tools"
  ["aihumanizer-directory"]="aihumanizer.tools"
  ["bestaidetector-directory"]="bestaidetector.tools"
  ["bestanime-directory"]="bestanime.info"
  ["bestnootropics-directory"]="bestnootropics.info"
  ["bestofpodcasts-directory"]="bestofpodcasts.com"
  ["bestonlyfans-directory"]="bestonlyfans.info"
  ["bestwriting-directory"]="bestwriting.tools"
  ["hrai-directory"]="hrai.tools"
  ["legalai-directory"]="legalai.tools"
  ["mattressrank-directory"]="mattressrank.info"
  ["nsfw-telegram-directory"]="nsfwtelegrambot.com"
  ["realestateai-directory"]="realestateai.tools"
)

cd ~/.openclaw/workspace

echo "📝 Phase 1: Fixing robots.txt sitemap URLs..."
echo ""

for dir in "${!SITES[@]}"; do
  domain="${SITES[$dir]}"
  robots_file="$dir/public/robots.txt"
  
  if [ ! -f "$robots_file" ]; then
    echo "⚠️  $dir: robots.txt not found, skipping"
    continue
  fi
  
  # Check current sitemap line
  current=$(grep "Sitemap:" "$robots_file" || echo "none")
  
  # Replace sitemap-index.xml with sitemap.xml AND fix domain
  sed -i "s|Sitemap: https://.*|Sitemap: https://$domain/sitemap.xml|g" "$robots_file"
  
  new=$(grep "Sitemap:" "$robots_file")
  echo "✅ $dir"
  echo "   Was: $current"
  echo "   Now: $new"
  echo ""
done

echo ""
echo "✅ Phase 1 Complete: All robots.txt files fixed"
echo ""
echo "Next steps:"
echo "1. Install @astrojs/sitemap in all projects"
echo "2. Update astro.config.mjs files"
echo "3. Deploy all sites"
