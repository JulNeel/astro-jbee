import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const [posts, ressources] = await Promise.all([
    getCollection("posts"),
    getCollection("ressources"),
  ]);

  const postItems = posts.map((post) => ({
    title: post.data.title,
    description: post.data.excerpt,
    pubDate: post.data.publishedDate,
    link: `/${post.data.slug}`,
  }));

  const ressourceItems = ressources.map((ressource) => ({
    title: ressource.data.title,
    description: ressource.data.description,
    pubDate: ressource.data.publishedAt,
    link: ressource.data.link ?? "/ressources",
  }));

  const items = [...postItems, ...ressourceItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: "Julien Bruneel - Développeur web",
    description:
      "Articles, tutoriels et ressources sur le développement web.",
    site: site!,
    items,
    trailingSlash: false,
  });
};
