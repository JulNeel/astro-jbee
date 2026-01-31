import type { APIRoute } from "astro";

const robotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /
Sitemap: ${sitemapURL.href}
`;

const disallowAll = `User-agent: *
Disallow: /
`;

export const GET: APIRoute = ({ site }) => {
  const isProduction = import.meta.env.PUBLIC_SITE_ENV === "production";
  const body = isProduction ? robotsTxt(new URL("sitemap-index.xml", site)) : disallowAll;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
