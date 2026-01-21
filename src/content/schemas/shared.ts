import { z } from "astro:content";
import { buildImageUrl } from "@utils/strapi";

// Strapi media schema (nullish to handle both null and undefined)
export const strapiMediaSchema = z
  .object({
    url: z.string(),
    alternativeText: z.string().nullish(),
    formats: z
      .object({
        small: z.object({ url: z.string() }).optional(),
      })
      .optional(),
  })
  .nullish();

// Helper to transform Strapi media to app format
export type StrapiMedia = z.infer<typeof strapiMediaSchema>;

export const transformImage = (media: StrapiMedia) =>
  media
    ? {
        url: buildImageUrl(media.url)!,
        smallUrl:
          buildImageUrl(media.formats?.small?.url) ?? buildImageUrl(media.url)!,
        altText: media.alternativeText || "",
      }
    : null;
