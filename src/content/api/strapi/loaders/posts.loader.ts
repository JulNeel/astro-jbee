import type { Loader } from 'astro/loaders';
import { postsService } from '../services/posts';
import { postSchema } from '@content/schemas/posts.schema';

export function createPostsLoader(): Loader {
  return {
    name: 'posts-loader',
    async load({ store, logger }) {
      logger.info('Loading posts from Strapi...');

      try {
        const posts = await postsService.getAll();
        store.clear();

        for (const post of posts) {
          // Parse and transform raw Strapi data using Zod schema
          const transformedPost = postSchema.parse(post);
          store.set({
            id: post.slug,
            data: transformedPost as unknown as Record<string, unknown>,
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
