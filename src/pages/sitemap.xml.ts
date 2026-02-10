import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('posts');

  // Sort posts by modification date (most recent first) for sitemap
  const sortedPosts = posts.sort((a, b) =>
    b.data.modifiedDate.getTime() - a.data.modifiedDate.getTime()
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${site}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>${site}a-propos</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${site}ressources</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Dynamic Posts -->
${sortedPosts.map(post => `  <url>
    <loc>${site}${post.data.slug}</loc>
    <lastmod>${post.data.modifiedDate.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
