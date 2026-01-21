import { z } from "astro:content";
import { strapiMediaSchema, transformImage } from "./shared";

// About schema with transform (validates raw Strapi data, outputs app format)
export const aboutSchema = z
  .object({
    picture: strapiMediaSchema,
    name: z.string().nullable(),
    firstName: z.string().nullable(),
    description: z.string().nullable(),
    linkedinProfileUrl: z.string().nullable(),
    githubProfileUrl: z.string().nullable(),
  })
  .transform((data) => ({
    picture: transformImage(data.picture),
    name: data.name || "",
    firstName: data.firstName || "",
    fullName: [data.firstName, data.name].filter(Boolean).join(" "),
    description: data.description || "",
    linkedinProfileUrl: data.linkedinProfileUrl,
    githubProfileUrl: data.githubProfileUrl,
  }));

// Output schema (for Astro collection definition - validates the TRANSFORMED data)
export const aboutOutputSchema = z.object({
  picture: z
    .object({
      url: z.string(),
      smallUrl: z.string(),
      altText: z.string(),
    })
    .nullable(),
  name: z.string(),
  firstName: z.string(),
  fullName: z.string(),
  description: z.string(),
  linkedinProfileUrl: z.string().nullable(),
  githubProfileUrl: z.string().nullable(),
});

// Output type
export type About = z.output<typeof aboutSchema>;
