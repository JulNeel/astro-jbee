import type { Loader } from 'astro/loaders';
import { postsService } from '../services/posts';
import { postSchema } from '@content/schemas/posts.schema';
import { downloadImage, isRemoteStrapiUrl } from '@utils/image-downloader';
import { buildImageUrl } from '@utils/strapi';

export function createPostsLoader(): Loader {
  return {
    name: 'posts-loader',
    async load({ store, logger }) {
      logger.info('Loading posts from Strapi...');

      try {
        const posts = await postsService.getAll();
        store.clear();

        for (const post of posts) {
          // Download cover images locally before parsing
          if (post.coverImage) {
            const fullUrl = buildImageUrl(post.coverImage.url);
            if (fullUrl && isRemoteStrapiUrl(fullUrl)) {
              post.coverImage.url = await downloadImage(fullUrl);
            }

            // Download small format if it exists
            if (post.coverImage.formats?.small?.url) {
              const smallUrl = buildImageUrl(post.coverImage.formats.small.url);
              if (smallUrl && isRemoteStrapiUrl(smallUrl)) {
                post.coverImage.formats.small.url = await downloadImage(smallUrl);
              }
            }
          }

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
