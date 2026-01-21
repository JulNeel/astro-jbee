import { strapiClient } from "../client";
import type { StrapiResponse, StrapiAbout } from "../types";

export const aboutService = {
  async get(): Promise<StrapiAbout | null> {
    try {
      const response = await strapiClient.request<StrapiResponse<StrapiAbout>>(
        "/about",
        { populate: "*" }
      );
      return response.data;
    } catch {
      return null;
    }
  },
};
