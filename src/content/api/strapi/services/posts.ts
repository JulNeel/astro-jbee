import { strapiClient } from "../client";
import type { StrapiResponse, StrapiPost } from "../types";

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
};
