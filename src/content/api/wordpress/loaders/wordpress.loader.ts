import type { Loader } from 'astro/loaders';
import { postsService } from '../services/wpPosts';

export function createWordPressLoader(): Loader {

  return {
    name: 'wordpress-loader',
    async load({ store, logger }) {
      logger.info('Wordpress posts are loading...');

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

        logger.info(`${posts.length} wordpress posts successfully loaded.`);
      } catch (error) {
        logger.error(error as string);
        throw error;
      }
    },
  };
}