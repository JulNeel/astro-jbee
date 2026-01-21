import { strapiClient } from "../client";
import type { StrapiResponse, StrapiRessource } from "../types";

export const ressourcesService = {
  async getAll(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<StrapiRessource[]> {
    const queryParams: Record<string, string> = {
      "populate": "*",
    };

    if (params?.page) {
      queryParams["pagination[page]"] = String(params.page);
    }
    if (params?.pageSize) {
      queryParams["pagination[pageSize]"] = String(params.pageSize);
    }

    const response = await strapiClient.request<StrapiResponse<StrapiRessource[]>>(
      "/ressources",
      queryParams
    );

    return response.data;
  },
};
