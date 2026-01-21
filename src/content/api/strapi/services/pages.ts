import { strapiClient } from "../client";
import type { StrapiResponse, StrapiPage } from "../types";

export const pagesService = {
  async getAll(): Promise<StrapiPage[]> {
    const response = await strapiClient.request<StrapiResponse<StrapiPage[]>>(
      "/pages",
      { populate: "*" }
    );

    return response.data;
  },
};
