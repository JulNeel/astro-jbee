import { wpClient } from "../client";
import type { WpMenu } from "../types";

export const menuItemsService = {

  async getMenuItems(menuSlug: string) {
    const wpMenu = await wpClient.request<WpMenu>(`/custom/v1/menus/${menuSlug}`);
    return wpMenu.items.map(item => ({ path: item.url, label: item.title }));
  },
};