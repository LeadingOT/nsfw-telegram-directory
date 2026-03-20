#!/bin/bash

# Fix astro.config.mjs for all sites

cd ~/.openclaw/workspace

for dir in *-directory; do
  echo "Fixing $dir..."
  
  SITE=$(grep "site:" "$dir/astro.config.mjs" 2>/dev/null | grep -o "https://[^'\"]*" | head -1)
  
  if [ -z "$SITE" ]; then
    echo "  ⚠️ No site URL found, skipping"
    continue
  fi
  
  # Create new config file
  cat > "$dir/astro.config.mjs" << 'ENDCONFIG'
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'SITEURL',
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
ENDCONFIG
  
  # Replace SITEURL with actual site
  sed -i "s|SITEURL|$SITE|" "$dir/astro.config.mjs"
  
  echo "  ✅ Fixed"
done

echo ""
echo "All configs updated!"
