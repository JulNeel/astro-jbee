import { createHash } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { extname, join } from "path";

const CACHE_DIR = "public/uploads/content";
const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

// Ensure cache directory exists
function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// Generate a unique filename based on URL hash
function generateFilename(url: string): string {
  const hash = createHash("md5").update(url).digest("hex").slice(0, 12);
  const ext = extname(new URL(url).pathname) || ".jpg";
  return `${hash}${ext}`;
}

// Download image and return local path
export async function downloadImage(remoteUrl: string): Promise<string> {
  ensureCacheDir();

  const filename = generateFilename(remoteUrl);
  const localPath = join(CACHE_DIR, filename);
  const publicPath = `/uploads/content/${filename}`;

  // Skip if already downloaded
  if (existsSync(localPath)) {
    return publicPath;
  }

  try {
    const response = await fetch(remoteUrl);

    if (!response.ok) {
      console.warn(`Failed to download image: ${remoteUrl} (${response.status})`);
      return remoteUrl;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    writeFileSync(localPath, buffer);

    console.log(`[image-downloader] Downloaded: ${filename}`);
    return publicPath;
  } catch (error) {
    console.warn(`Failed to download image: ${remoteUrl}`, error);
    return remoteUrl;
  }
}

// Check if URL is a remote Strapi URL that should be downloaded
export function isRemoteStrapiUrl(url: string): boolean {
  if (!url || !url.startsWith("http")) return false;

  // Check if it matches common Strapi cloud domains first
  if (url.includes("strapiapp.com") || url.includes("strapi.io")) {
    return true;
  }

  // Also download images from the configured Strapi domain
  if (STRAPI_URL) {
    try {
      const strapiHost = new URL(STRAPI_URL).host;
      const imageHost = new URL(url).host;
      return imageHost === strapiHost || imageHost.endsWith(strapiHost);
    } catch {
      return false;
    }
  }

  return false;
}
