import type { APIRoute } from 'astro';

const SITE_URL = 'https://nsfwtelegrambot.com';

export const GET: APIRoute = async () => {
  const urls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/about`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/submit`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/free`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/paid`, priority: '0.9', changefreq: 'weekly' },
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
