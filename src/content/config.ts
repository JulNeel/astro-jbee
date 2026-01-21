import { defineCollection } from "astro:content";
import { createPostsLoader } from "./api/strapi/loaders/posts.loader";
import { createRessourcesLoader } from "./api/strapi/loaders/ressources.loader";
import { postOutputSchema } from "./schemas/posts.schema";
import { ressourceOutputSchema } from "./schemas/ressources.schema";

const posts = defineCollection({
  loader: createPostsLoader(),
  schema: postOutputSchema,
});

const ressources = defineCollection({
  loader: createRessourcesLoader(),
  schema: ressourceOutputSchema,
});

export const collections = { posts, ressources };
