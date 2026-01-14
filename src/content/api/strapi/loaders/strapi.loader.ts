import type { Loader } from 'astro/loaders';
import { postsService } from '../services/posts';

export function createStrapiLoader(): Loader {
  return {
    name: 'strapi-loader',
    async load({ store, logger }) {
      logger.info('Loading posts from Strapi...');

      try {
        const posts = await postsService.getAll();

        store.clear();

        for (const post of posts) {
          const transformedPost = postsService.transformPost(post);
          store.set({
            id: post.slug,
            data: transformedPost,
          });
        }

        logger.info(`${posts.length} posts loaded from Strapi.`);
      } catch (error) {
        logger.error(`Failed to load posts from Strapi: ${error}`);
        throw error;
      }
    },
  };
}
