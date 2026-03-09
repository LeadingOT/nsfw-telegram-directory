import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://nsfwtelegrambot.com';

export const GET: APIRoute = async () => {
  // Read listings from JSON file
  const listingsPath = path.join(process.cwd(), 'src/data/listings.json');
  const listingsData = JSON.parse(fs.readFileSync(listingsPath, 'utf-8'));
  const listings = listingsData.listings || [];
  
  const urls = [
    // Homepage
    { loc: SITE_URL, priority: '1.0', changefreq: 'daily' },
    
    // Static pages
    { loc: `${SITE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/submit`, priority: '0.8', changefreq: 'monthly' },
    
    // Category pages
    { loc: `${SITE_URL}/free`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/paid`, priority: '0.9', changefreq: 'weekly' },
    
    // Individual listings
    ...listings.map((tool: any) => ({
      loc: `${SITE_URL}/tools/${tool.slug}`,
      priority: '0.7',
      changefreq: 'weekly'
    })),
    
    // Alternatives pages
    ...listings.map((tool: any) => ({
      loc: `${SITE_URL}/alternatives/${tool.slug}`,
      priority: '0.6',
      changefreq: 'weekly'
    })),
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
