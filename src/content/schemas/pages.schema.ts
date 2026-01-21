import { z } from "astro:content";

// Pages schema with transform (validates raw Strapi data, outputs app format)
export const pageSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    content: z.string().nullable(),
  })
  .transform((data) => ({
    title: data.title,
    slug: data.slug,
    content: data.content || "",
  }));

// Output schema (for Astro collection definition - validates the TRANSFORMED data)
export const pageOutputSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
});

// Output type
export type Page = z.output<typeof pageSchema>;
