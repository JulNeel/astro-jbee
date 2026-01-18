import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [
        "javascript",
        "typescript",
        "html",
        "css",
        "json",
        "python",
        "php",
        "bash",
        "sql",
        "yaml",
        "plaintext",
        "jsx",
        "tsx",
      ],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: string,
): Promise<string> {
  const highlighter = await getHighlighter();
  const shikiLang = lang.replace("language-", "") || "plaintext";

  try {
    return highlighter.codeToHtml(code, {
      lang: shikiLang,
      theme: "github-dark",
    });
  } catch {
    return highlighter.codeToHtml(code, {
      lang: "plaintext",
      theme: "github-dark",
    });
  }
}
