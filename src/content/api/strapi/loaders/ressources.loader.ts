import type { Loader } from 'astro/loaders';
import { ressourcesService } from '../services/ressources';
import { ressourceSchema } from '@content/schemas/ressources.schema';
import { downloadImage, isRemoteStrapiUrl } from '@utils/image-downloader';
import { buildImageUrl } from '@utils/strapi';

export function createRessourcesLoader(): Loader {
  return {
    name: 'ressources-loader',
    async load({ store, logger }) {
      logger.info('Loading ressources from Strapi...');

      try {
        const ressources = await ressourcesService.getAll();
        store.clear();

        for (const ressource of ressources) {
          // Download thumbnail images locally before parsing
          if (ressource.Thumbnail) {
            const fullUrl = buildImageUrl(ressource.Thumbnail.url);
            if (fullUrl && isRemoteStrapiUrl(fullUrl)) {
              ressource.Thumbnail.url = await downloadImage(fullUrl);
            }

            // Download small format if it exists
            if (ressource.Thumbnail.formats?.small?.url) {
              const smallUrl = buildImageUrl(ressource.Thumbnail.formats.small.url);
              if (smallUrl && isRemoteStrapiUrl(smallUrl)) {
                ressource.Thumbnail.formats.small.url = await downloadImage(smallUrl);
              }
            }
          }

          // Parse and transform raw Strapi data using Zod schema
          const transformedRessource = ressourceSchema.parse(ressource);
          store.set({
            id: ressource.Slug,
            data: transformedRessource as unknown as Record<string, unknown>,
          });
        }

        logger.info(`${ressources.length} ressources loaded from Strapi.`);
      } catch (error) {
        logger.error(`Failed to load ressources from Strapi: ${error}`);
        throw error;
      }
    },
  };
}
