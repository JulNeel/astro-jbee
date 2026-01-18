import { parse, type HTMLElement } from "node-html-parser";
import { highlightCode } from "./shiki";

export async function processHtmlContent(html: string): Promise<string> {
  if (!html) return "";

  const root = parse(html, {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
    },
  });
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
