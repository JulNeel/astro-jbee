import { parse } from "node-html-parser";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(html: string): TocHeading[] {
  if (!html) return [];

  const root = parse(html);
  const headings: TocHeading[] = [];

  for (const el of root.querySelectorAll("h2, h3, h4")) {
    const id = el.getAttribute("id");
    const text = el.textContent.trim();
    const level = parseInt(el.rawTagName.replace("h", ""), 10);

    if (id && text) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}
