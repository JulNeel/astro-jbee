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
        "astro",
      ],
    });
  }
  return highlighterPromise;
}

// Language display names
const langNames: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  python: "Python",
  php: "PHP",
  bash: "Bash",
  sql: "SQL",
  yaml: "YAML",
  plaintext: "Text",
  jsx: "JSX",
  tsx: "TSX",
  astro: "Astro",
};

// Comment patterns for different languages
const commentPatterns: Record<string, RegExp> = {
  javascript: /^\/\/\s*(.+)$/,
  typescript: /^\/\/\s*(.+)$/,
  jsx: /^\/\/\s*(.+)$/,
  tsx: /^\/\/\s*(.+)$/,
  html: /^<!--\s*(.+?)\s*-->$/,
  css: /^\/\*\s*(.+?)\s*\*\/$/,
  json: /^\/\/\s*(.+)$/,
  python: /^#\s*(.+)$/,
  php: /^(?:\/\/|#)\s*(.+)$/,
  bash: /^#\s*(.+)$/,
  sql: /^--\s*(.+)$/,
  yaml: /^#\s*(.+)$/,
  astro: /^---\s*(.+)$|^<!--\s*(.+?)\s*-->$/,
};

function extractFilename(code: string, lang: string): { filename: string | null; codeWithoutFilename: string } {
  const lines = code.split("\n");
  const firstLine = lines[0]?.trim();

  if (!firstLine) {
    return { filename: null, codeWithoutFilename: code };
  }

  const pattern = commentPatterns[lang] || /^(?:\/\/|#|--|\/\*)\s*(.+?)(?:\s*\*\/)?$/;
  const match = firstLine.match(pattern);

  if (match) {
    const filename = match[1] || match[2];
    // Check if it looks like a filename (has extension or path)
    if (filename && /^[\w\-./]+\.\w+$/.test(filename.trim())) {
      return {
        filename: filename.trim(),
        codeWithoutFilename: lines.slice(1).join("\n"),
      };
    }
  }

  return { filename: null, codeWithoutFilename: code };
}

// SVG icons for copy button
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-check hidden"><path d="M20 6 9 17l-5-5"/></svg>`;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function highlightCode(
  code: string,
  lang: string,
): Promise<string> {
  const highlighter = await getHighlighter();
  const shikiLang = lang.replace("language-", "") || "plaintext";

  // Extract filename from first line comment
  const { filename, codeWithoutFilename } = extractFilename(code, shikiLang);
  const codeToHighlight = filename ? codeWithoutFilename : code;
  const codeForCopy = codeToHighlight.trim();

  let highlightedCode: string;
  try {
    highlightedCode = highlighter.codeToHtml(codeToHighlight, {
      lang: shikiLang,
      theme: "github-dark",
    });
  } catch {
    highlightedCode = highlighter.codeToHtml(codeToHighlight, {
      lang: "plaintext",
      theme: "github-dark",
    });
  }

  const langDisplay = langNames[shikiLang] || shikiLang;
  const filenameHtml = filename
    ? `<span class="code-block-filename">${escapeHtml(filename)}</span>`
    : `<span class="code-block-filename"></span>`;

  return `<div class="code-block">
  <div class="code-block-header">
    ${filenameHtml}
    <span class="code-block-lang">${escapeHtml(langDisplay)}</span>
  </div>
  <div class="code-block-content">
    <button type="button" class="code-block-copy" aria-label="Copy code" data-code="${escapeHtml(codeForCopy)}">
      ${copyIcon}
      ${checkIcon}
    </button>
    ${highlightedCode}
  </div>
</div>`;
}
