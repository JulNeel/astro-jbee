import { strapiClient } from "../client";
import type { StrapiResponse, StrapiPost, BlogPost } from "../types";
import { buildImageUrl } from "@utils/strapi";

export const postsService = {
  async getAll(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<StrapiPost[]> {
    const queryParams: Record<string, string> = {
      "populate": "*",
    };

    if (params?.page) {
      queryParams["pagination[page]"] = String(params.page);
    }
    if (params?.pageSize) {
      queryParams["pagination[pageSize]"] = String(params.pageSize);
    }

    const response = await strapiClient.request<StrapiResponse<StrapiPost[]>>(
      "/posts",
      queryParams
    );

    return response.data;
  },

  async getBySlug(slug: string): Promise<StrapiPost | null> {
    const response = await strapiClient.request<StrapiResponse<StrapiPost[]>>(
      "/posts",
      {
        "filters[slug][$eq]": slug,
        "populate": "*",
      }
    );

    return response.data[0] || null;
  },

  async getById(documentId: string): Promise<StrapiPost | null> {
    try {
      const response = await strapiClient.request<StrapiResponse<StrapiPost>>(
        `/posts/${documentId}`,
        { "populate": "*" }
      );
      return response.data;
    } catch {
      return null;
    }
  },

  transformPost(post: StrapiPost): BlogPost {
    return {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      publishedDate: new Date(post.wpCreatedAt || post.createdAt),
      modifiedDate: new Date(post.wpUpdatedAt || post.updatedAt),
      author: post.author?.username || "Auteur inconnu",
      coverImage: post.coverImage
        ? {
            url: buildImageUrl(post.coverImage.url)!,
            smallUrl:
              buildImageUrl(post.coverImage.formats?.small?.url) ??
              buildImageUrl(post.coverImage.url)!,
            altText: post.coverImage.alternativeText || "",
          }
        : null,
      tags: post.tags?.map((tag) => tag.name) || [],
      categories: post.categories?.map((cat) => cat.name) || [],
    };
  },
};
