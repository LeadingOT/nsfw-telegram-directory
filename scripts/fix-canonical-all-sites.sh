#!/bin/bash
# Fix canonical URL issue for all 14 sites

SITES=(
  "accountingai-directory:accountingai.tools"
  "aigirlfriend-directory:aigirlfriend.tools"
  "hrai-directory:hrai.tools"
  "legalai-directory:legalai.tools"
  "realestate-ai-directory:realestateai.tools"
  "bestwriting-directory:bestwriting.tools"
  "bestnootropics-directory:bestnootropics.info"
  "bestonlyfans-directory:bestonlyfans.info"
  "bestanime-directory:bestanime.info"
  "mattressrank-directory:mattressrank.info"
  "bestofpodcasts-directory:bestofpodcasts.com"
  "nsfw-telegram-directory:nsfwtelegrambot.com"
  "bestaidetector-directory:bestaidetector.tools"
  "aihumanizer-directory:aihumanizer.tools"
)

for entry in "${SITES[@]}"; do
  DIR="${entry%%:*}"
  DOMAIN="${entry##*:}"
  
  echo "=== Fixing $DOMAIN ($DIR) ==="
  
  LAYOUT_FILE="/home/bill/.openclaw/workspace/$DIR/src/layouts/BaseLayout.astro"
  
  if [ ! -f "$LAYOUT_FILE" ]; then
    echo "  ⚠️  Layout file not found, skipping"
    continue
  fi
  
  # Check if already fixed
  if grep -q "canonicalURL" "$LAYOUT_FILE"; then
    echo "  ✅ Already fixed"
    continue
  fi
  
  # Fix: Add canonicalURL variable
  sed -i "s|const siteUrl = import.meta.env.SITE.*|const siteUrl = import.meta.env.SITE \|\| 'https://$DOMAIN';\nconst canonicalURL = canonical \|\| new URL(Astro.url.pathname, siteUrl).href;|" "$LAYOUT_FILE"
  
  # Fix: Replace canonical || Astro.url.href with canonicalURL
  sed -i "s|canonical \|\| Astro.url.href|canonicalURL|g" "$LAYOUT_FILE"
  
  echo "  ✅ Fixed canonical URLs"
done

echo ""
echo "🎉 All sites fixed!"
