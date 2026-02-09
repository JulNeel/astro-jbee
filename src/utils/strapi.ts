const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

export const buildImageUrl = (path: string | undefined): string | null => {
  if (!path) return null;
  // If already a full URL or a local downloaded image, return as-is
  if (path.startsWith("http") || path.startsWith("/uploads/content/")) {
    return path;
  }
  // Otherwise, prefix with Strapi URL
  return `${STRAPI_URL}${path}`;
};
