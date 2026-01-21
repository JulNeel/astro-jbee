import { z } from "astro:content";
import { strapiMediaSchema, transformImage } from "./shared";

// Posts schema with transform (validates raw Strapi data, outputs app format)
export const postSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().nullable(),
    content: z.string().nullable(),
    coverImage: strapiMediaSchema,
    author: z.object({ username: z.string() }).nullish(),
    tags: z.array(z.object({ name: z.string() })).nullish(),
    categories: z.array(z.object({ name: z.string() })).nullish(),
    wpCreatedAt: z.string().nullish(),
    wpUpdatedAt: z.string().nullish(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .transform((data) => ({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || "",
    content: data.content || "",
    publishedDate: new Date(data.wpCreatedAt || data.createdAt),
    modifiedDate: new Date(data.wpUpdatedAt || data.updatedAt),
    author: data.author?.username || "Auteur inconnu",
    coverImage: transformImage(data.coverImage),
    tags: data.tags?.map((t) => t.name) || [],
    categories: data.categories?.map((c) => c.name) || [],
  }));

// Output schema (for Astro collection definition - validates the TRANSFORMED data)
export const postOutputSchema = z.object({
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
});

// Output type
export type Post = z.output<typeof postSchema>;
