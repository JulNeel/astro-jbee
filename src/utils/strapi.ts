const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

export const buildImageUrl = (path: string | undefined): string | null => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
};
