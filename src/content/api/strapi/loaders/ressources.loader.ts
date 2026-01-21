import type { Loader } from 'astro/loaders';
import { ressourcesService } from '../services/ressources';
import { ressourceSchema } from '@content/schemas/ressources.schema';

export function createRessourcesLoader(): Loader {
  return {
    name: 'ressources-loader',
    async load({ store, logger }) {
      logger.info('Loading ressources from Strapi...');

      try {
        const ressources = await ressourcesService.getAll();
        store.clear();

        for (const ressource of ressources) {
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
