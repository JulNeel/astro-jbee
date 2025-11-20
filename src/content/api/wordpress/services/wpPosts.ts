import { wpClient } from '../client';
import type { BlogPost, WpPost } from '../types';



export const postsService = {
  async getAll(params?: {
    per_page?: number;
    page?: number;
    categories?: string;
    tags?: string;
  }) {
    return wpClient.request<WpPost[]>('/wp/v2/posts', {
      _embed: true,
      ...params,
    });
  },

  async getBySlug(slug: string) {
    const posts = await wpClient.request<WpPost[]>('/wp/v2/posts', {
      slug,
      _embed: true,
    });
    return posts[0] || null;
  },

  async getById(id: number) {
    return wpClient.request<WpPost>(`wp/v2/posts/${id}`, {
      _embed: true,
    });
  },

  async getRecent(limit = 5) {
    return this.getAll({ per_page: limit });
  },
  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  },

  transformPost(post: WpPost): BlogPost {
    const featuredImage =
    {
      url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      altText: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
    }

    const categories =
      post._embedded?.['wp:term']?.[0]?.map(cat => cat.name) || [];

    const tags =
      post._embedded?.['wp:term']?.[1]?.map(tag => tag.name) || [];

    return {
      title: post.title.rendered,
      slug: post.slug,
      excerpt: this.stripHtml(post.excerpt.rendered),
      content: post.content.rendered,
      publishedDate: new Date(post.date),
      modifiedDate: new Date(post.modified),
      author: post._embedded?.author?.[0]?.name || 'Auteur inconnu',
      featuredImage,
      categories,
      tags,
      wpId: post.id,
      link: post.link,
    };
  }
};