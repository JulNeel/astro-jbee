import { wpClient } from "../client";
import type { WpSiteData } from "../types";

export const themeAssetsService = {

  async getThemeAssets() {
    return wpClient.request<WpSiteData>('/custom/v1/theme-assets');
  },
};