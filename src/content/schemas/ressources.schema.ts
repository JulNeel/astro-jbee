import { z } from "astro:content";
import { strapiMediaSchema, transformImage } from "./shared";

// Ressources schema with transform (validates raw Strapi data, outputs app format)
export const ressourceSchema = z
  .object({
    Title: z.string(),
    Slug: z.string(),
    Thumbnail: strapiMediaSchema,
    Description: z.string().nullable(),
    Link: z.string().nullable(),
    Language: z.enum(["Français", "Anglais"]).nullable(),
    tags: z.array(z.object({ name: z.string() })).default([]),
    ressource_category: z.object({ name: z.string() }).nullish(),
  })
  .transform((data) => ({
    title: data.Title,
    slug: data.Slug,
    thumbnail: transformImage(data.Thumbnail),
    description: data.Description || "",
    link: data.Link,
    language: data.Language,
    tags: data.tags.map((t) => t.name),
    category: data.ressource_category?.name ?? null,
  }));

// Output schema (for Astro collection definition - validates the TRANSFORMED data)
export const ressourceOutputSchema = z.object({
  title: z.string(),
  slug: z.string(),
  thumbnail: z
    .object({
      url: z.string(),
      smallUrl: z.string(),
      altText: z.string(),
    })
    .nullable(),
  description: z.string(),
  link: z.string().nullable(),
  language: z.enum(["Français", "Anglais"]).nullable(),
  tags: z.array(z.string()),
  category: z.string().nullable(),
});

// Output type
export type Ressource = z.output<typeof ressourceSchema>;
