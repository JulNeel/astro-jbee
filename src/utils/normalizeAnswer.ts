// Case/accent/whitespace-insensitive normalization for free-text quiz answers.
// "  Sarah Bernhardt " and "sarah bernhardt" and "SARAH BERNHARDT" must all
// normalize to the same string so answer matching doesn't punish incidental
// formatting differences.
export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " "); // collapse repeated whitespace
}
