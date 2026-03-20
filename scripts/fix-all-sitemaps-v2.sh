#!/bin/bash
# Fix sitemap.xml for all 12 directory sites (v2 - using fs.readFileSync)

SITES=(
  "accountingai-directory:accountingai.tools"
  "aigirlfriend-directory:aigirlfriend.tools"
  "bestanime-directory:bestanime.info"
  "bestnootropics-directory:bestnootropics.info"
  "bestofpodcasts-directory:bestofpodcasts.com"
  "bestonlyfans-directory:bestonlyfans.info"
  "bestwriting-directory:bestwriting.tools"
  "hrai-directory:hrai.tools"
  "legalai-directory:legalai.tools"
  "mattressrank-directory:mattressrank.info"
  "nsfw-telegram-directory:nsfwtelegrambot.com"
  "realestate-ai-directory:realestateai.tools"
)

WORKSPACE="/home/bill/.openclaw/workspace"

for site in "${SITES[@]}"; do
  DIR="${site%:*}"
  DOMAIN="${site#*:}"
  
  echo "📝 Fixing $DIR ($DOMAIN)..."
  
  cd "$WORKSPACE/$DIR" || continue
  
  # Create sitemap.xml.ts with fs.readFileSync
  cat > src/pages/sitemap.xml.ts << SITEMAP_EOF
import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://$DOMAIN';

export const GET: APIRoute = async () => {
  // Read listings from JSON file
  const listingsPath = path.join(process.cwd(), 'src/data/listings.json');
  const listingsData = JSON.parse(fs.readFileSync(listingsPath, 'utf-8'));
  const listings = listingsData.listings || [];
  
  const urls = [
    // Homepage
    { loc: SITE_URL, priority: '1.0', changefreq: 'daily' },
    
    // Static pages
    { loc: \\\`\\\${SITE_URL}/about\\\`, priority: '0.8', changefreq: 'monthly' },
    { loc: \\\`\\\${SITE_URL}/submit\\\`, priority: '0.8', changefreq: 'monthly' },
    
    // Category pages
    { loc: \\\`\\\${SITE_URL}/free\\\`, priority: '0.9', changefreq: 'weekly' },
    { loc: \\\`\\\${SITE_URL}/paid\\\`, priority: '0.9', changefreq: 'weekly' },
    
    // Individual listings
    ...listings.map((tool: any) => ({
      loc: \\\`\\\${SITE_URL}/tools/\\\${tool.slug}\\\`,
      priority: '0.7',
      changefreq: 'weekly'
    })),
    
    // Alternatives pages
    ...listings.map((tool: any) => ({
      loc: \\\`\\\${SITE_URL}/alternatives/\\\${tool.slug}\\\`,
      priority: '0.6',
      changefreq: 'weekly'
    })),
  ];
  
  const sitemap = \\\`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\\\${urls.map(url => \\\`  <url>
    <loc>\\\${url.loc}</loc>
    <changefreq>\\\${url.changefreq}</changefreq>
    <priority>\\\${url.priority}</priority>
    <lastmod>\\\${new Date().toISOString()}</lastmod>
  </url>\\\`).join('\\n')}
</urlset>\\\`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
SITEMAP_EOF
  
  echo "  ✅ Created sitemap.xml.ts with fs.readFileSync"
  
  # Git commit and push
  git add src/pages/sitemap.xml.ts
  if git diff --staged --quiet; then
    echo "  ℹ️  No changes to commit"
  else
    git commit -m "Fix: Use fs.readFileSync for sitemap in server mode"
    git push origin main
    echo "  ✅ Committed and pushed"
  fi
  
  echo ""
done

echo "🎉 All sites fixed! Vercel will auto-deploy."
