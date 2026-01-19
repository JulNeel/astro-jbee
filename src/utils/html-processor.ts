import { parse, type HTMLElement } from "node-html-parser";
import { highlightCode } from "./shiki";

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

export async function processHtmlContent(html: string): Promise<string> {
  if (!html) return "";

  const root = parse(html, {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
    },
  });

  // Process images - prefix Strapi URLs
  processImages(root);

  // Process code blocks with Shiki
  const codeBlocks = root.querySelectorAll("code");

  for (const codeElement of codeBlocks) {
    const preElement = codeElement.parentNode as HTMLElement;

    // Only process code blocks inside <pre> elements
    if (preElement?.rawTagName?.toLowerCase() !== "pre") {
      continue;
    }

    const classAttr = codeElement.getAttribute("class") || "";
    const langMatch = classAttr.match(/language-(\w+)/);
    const lang = langMatch ? langMatch[1] : "plaintext";

    const code = decodeHtmlEntities(codeElement.textContent);
    const highlightedHtml = await highlightCode(code, lang);

    preElement.replaceWith(highlightedHtml);
  }

  return root.toString();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function prefixStrapiUrl(url: string): string {
  if (!url || url.startsWith("http") || url.startsWith("data:")) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}

function processImages(root: HTMLElement): void {
  const images = root.querySelectorAll("img");

  for (const img of images) {
    // Process src attribute
    const src = img.getAttribute("src");
    if (src) {
      img.setAttribute("src", prefixStrapiUrl(src));
    }

    // Process srcset attribute
    const srcset = img.getAttribute("srcset");
    if (srcset) {
      const processedSrcset = srcset
        .split(",")
        .map((entry) => {
          const [url, descriptor] = entry.trim().split(/\s+/);
          return `${prefixStrapiUrl(url)} ${descriptor || ""}`.trim();
        })
        .join(", ");
      img.setAttribute("srcset", processedSrcset);
    }
  }
}
