import { defineCollection, z } from "astro:content";
import { createStrapiLoader } from "./api/strapi/loaders/strapi.loader";

const strapiLoader = createStrapiLoader();

const posts = defineCollection({
  loader: strapiLoader,
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    content: z.string(),
    publishedDate: z.date(),
    modifiedDate: z.date(),
    author: z.string(),
    coverImage: z
      .object({
        url: z.string(),
        smallUrl: z.string(),
        altText: z.string(),
      })
      .nullable(),
    tags: z.array(z.string()),
    categories: z.array(z.string()),
  }),
});

export const collections = {
  posts,
};
