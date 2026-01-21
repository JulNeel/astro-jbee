import type { Loader } from "astro/loaders";
import { pagesService } from "../services/pages";
import { pageSchema } from "@content/schemas/pages.schema";

export function createPagesLoader(): Loader {
  return {
    name: "pages-loader",
    async load({ store, logger }) {
      logger.info("Loading pages from Strapi...");

      try {
        const pages = await pagesService.getAll();
        store.clear();

        for (const page of pages) {
          // Parse and transform raw Strapi data using Zod schema
          const transformedPage = pageSchema.parse(page);
          store.set({
            id: page.slug,
            data: transformedPage as unknown as Record<string, unknown>,
          });
        }

        logger.info(`${pages.length} pages loaded from Strapi.`);
      } catch (error) {
        logger.error(`Failed to load pages from Strapi: ${error}`);
        throw error;
      }
    },
  };
}
