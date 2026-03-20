#!/bin/bash
# Fix astro.config.mjs for all directory sites
# Add sitemap integration + change output to 'hybrid'

set -e

echo "🔧 Phase 2: Fixing astro.config.mjs files..."
echo ""

SITES=(
  "accountingai-directory:accountingai.tools"
  "aigirlfriend-directory:aigirlfriend.tools"
  "aihumanizer-directory:aihumanizer.tools"
  "bestaidetector-directory:bestaidetector.tools"
  "bestanime-directory:bestanime.info"
  "bestnootropics-directory:bestnootropics.info"
  "bestofpodcasts-directory:bestofpodcasts.com"
  "bestonlyfans-directory:bestonlyfans.info"
  "bestwriting-directory:bestwriting.tools"
  "hrai-directory:hrai.tools"
  "legalai-directory:legalai.tools"
  "mattressrank-directory:mattressrank.info"
  "nsfw-telegram-directory:nsfwtelegrambot.com"
  "realestateai-directory:realestateai.tools"
)

cd ~/.openclaw/workspace

for entry in "${SITES[@]}"; do
  dir="${entry%%:*}"
  domain="${entry##*:}"
  config_file="$dir/astro.config.mjs"
  
  if [ ! -f "$config_file" ]; then
    echo "⚠️  $dir: astro.config.mjs not found, skipping"
    continue
  fi
  
  echo "📝 $dir ($domain)"
  
  # Create new config
  cat > "$config_file" << 'CONFIGEND'
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://DOMAIN_PLACEHOLDER',
  output: 'hybrid',
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
CONFIGEND
  
  # Replace domain placeholder
  sed -i "s|DOMAIN_PLACEHOLDER|$domain|g" "$config_file"
  
  echo "   ✅ Updated: hybrid mode + sitemap integration"
  echo ""
done

echo ""
echo "✅ Phase 2 Complete: All astro.config.mjs files updated"
echo ""
echo "Changes made:"
echo "  - output: 'server' → 'hybrid'"
echo "  - Added sitemap integration"
echo "  - Set correct site URL for each project"
