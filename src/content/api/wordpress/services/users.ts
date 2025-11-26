import { wpClient } from "../client";

export interface WpUserSocialApi {
  linkedin: string | null;
  linkedin_handle: string | null;

  twitter: string | null;
  twitter_handle: string | null;

  instagram: string | null;
  instagram_handle: string | null;

  youtube: string | null;
  youtube_handle: string | null;

  facebook: string | null;
  facebook_handle: string | null;
}


export const userService = {

  async getUsersList() {
    const users = await wpClient.request<WpUserSocialApi[]>(`/wp/v2/users/`);
    return users;
  },
  async getUser(slug: string) {
    const user = await wpClient.request<WpUserSocialApi[]>(`/wp/v2/users?slug=${slug}`);
    console.log("USEEEEEEER", user[0].linkedin);
    return user[0];
  },
};