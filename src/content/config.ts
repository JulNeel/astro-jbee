
import { defineCollection, z } from 'astro:content';
import { createWordPressLoader } from './api/wordpress/loaders/wordpress.loader';

const wordpressLoader = createWordPressLoader();

const wpPosts = defineCollection({
  loader: wordpressLoader,
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    content: z.string(),
    publishedDate: z.date(),
    modifiedDate: z.date(),
    author: z.string(),
    featuredImage: z.object({
      url: z.string(),
      altText: z.string(),
    }).nullable(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    wpId: z.number(),
    link: z.string().url(),
  }),
});

export const collections = {
  wpPosts,
};