#!/bin/bash
# Batch submit sitemap-index.xml to all GSC verified sites

set -e

echo "📋 GSC Sitemap Batch Submission"
echo "================================"
echo ""

# 12个已验证GSC的站点
SITES=(
  "accountingai.tools"
  "aigirlfriend.tools"
  "hrai.tools"
  "legalai.tools"
  "realestateai.tools"
  "bestwriting.tools"
  "bestnootropics.info"
  "bestonlyfans.info"
  "bestanime.info"
  "mattressrank.info"
  "bestofpodcasts.com"
  "nsfwtelegrambot.com"
)

cd ~/.openclaw/workspace

echo "Will submit sitemap-index.xml for ${#SITES[@]} sites"
echo ""

for site in "${SITES[@]}"; do
  echo "🔄 $site"
  node scripts/gsc-auto.mjs sitemap "$site"
  echo ""
  sleep 2  # 避免API rate limit
done

echo ""
echo "✅ All sitemaps submitted!"
echo ""
echo "Next steps:"
echo "1. Wait 24-48h for Google to re-crawl"
echo "2. Check GSC Coverage report"
echo "3. Monitor indexation progress"
