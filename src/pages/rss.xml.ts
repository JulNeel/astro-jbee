import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("posts");

  const items = posts
    .map((post) => {
      const image = post.data.coverImage
        ? `<img src="${new URL(post.data.coverImage.smallUrl, site).href}" alt="${post.data.coverImage.altText.replace(/"/g, "&quot;")}" />`
        : "";
      return {
        title: post.data.title,
        description: `${image}${post.data.excerpt}`,
        pubDate: post.data.publishedDate,
        link: `/${post.data.slug}`,
      };
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: "Julien Bruneel - Développeur web",
    description: "Articles et tutoriels sur le développement web.",
    site: site!,
    items,
    trailingSlash: false,
  });
};
