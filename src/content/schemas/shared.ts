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

// Helper to detect if alternativeText is a filename
const isFileName = (text: string | null | undefined): boolean => {
  if (!text) return false;
  // Détecte les extensions d'image courantes
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff?)$/i.test(text);
};

export const transformImage = (media: StrapiMedia) =>
  media
    ? {
        url: buildImageUrl(media.url)!,
        smallUrl:
          buildImageUrl(media.formats?.small?.url) ?? buildImageUrl(media.url)!,
        // Si alternativeText est un nom de fichier, on utilise "" pour indiquer une image décorative
        altText: isFileName(media.alternativeText)
          ? ""
          : media.alternativeText || "",
      }
    : null;
