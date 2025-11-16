import { wpClient } from '../client';
import type { WPPost } from '../types';

export const postsService = {
  async getAll(params?: {
    per_page?: number;
    page?: number;
    categories?: string;
    tags?: string;
  }) {
    return wpClient.request<WPPost[]>('/posts', {
      _embed: true,
      ...params,
    });
  },

  async getBySlug(slug: string) {
    const posts = await wpClient.request<WPPost[]>('/posts', {
      slug,
      _embed: true,
    });
    return posts[0] || null;
  },

  async getById(id: number) {
    return wpClient.request<WPPost>(`/posts/${id}`, {
      _embed: true,
    });
  },

  async getRecent(limit = 5) {
    return this.getAll({ per_page: limit });
  },
};