import { defineCollection } from "astro:content";
import { createPostsLoader } from "./api/strapi/loaders/posts.loader";
import { createRessourcesLoader } from "./api/strapi/loaders/ressources.loader";
import { createPagesLoader } from "./api/strapi/loaders/pages.loader";
import { postOutputSchema } from "./schemas/posts.schema";
import { ressourceOutputSchema } from "./schemas/ressources.schema";
import { pageOutputSchema } from "./schemas/pages.schema";

const posts = defineCollection({
  loader: createPostsLoader(),
  schema: postOutputSchema,
});

const ressources = defineCollection({
  loader: createRessourcesLoader(),
  schema: ressourceOutputSchema,
});

const pages = defineCollection({
  loader: createPagesLoader(),
  schema: pageOutputSchema,
});

export const collections = { posts, ressources, pages };
