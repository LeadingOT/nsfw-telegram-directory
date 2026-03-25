#!/bin/bash
# Fix astro.config.mjs - use 'server' instead of 'hybrid'

set -e

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
  
  cat > "$dir/astro.config.mjs" << 'ASTROCONFIG'
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://DOMAIN_PLACEHOLDER',
  output: 'server',
  adapter: vercel(),
  
  vite: {
    plugins: [tailwindcss()]
  },
  
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  
  build: {
    format: 'directory',
  },
});
ASTROCONFIG

  # Get correct domain
  case $dir in
    accountingai-directory) domain="accountingai.tools" ;;
    aigirlfriend-directory) domain="aigirlfriend.tools" ;;
    aihumanizer-directory) domain="aihumanizer.tools" ;;
    bestaidetector-directory) domain="bestaidetector.tools" ;;
    bestanime-directory) domain="bestanime.info" ;;
    bestnootropics-directory) domain="bestnootropics.info" ;;
    bestofpodcasts-directory) domain="bestofpodcasts.com" ;;
    bestonlyfans-directory) domain="bestonlyfans.info" ;;
    bestwriting-directory) domain="bestwriting.tools" ;;
    hrai-directory) domain="hrai.tools" ;;
    legalai-directory) domain="legalai.tools" ;;
    mattressrank-directory) domain="mattressrank.info" ;;
    nsfw-telegram-directory) domain="nsfwtelegrambot.com" ;;
    realestate-ai-directory) domain="realestateai.tools" ;;
  esac
  
  sed -i "s|DOMAIN_PLACEHOLDER|$domain|g" "$dir/astro.config.mjs"
  echo "   ✅ Fixed: output='server' + sitemap"
done

echo ""
echo "✅ All configs fixed - testing build..."
