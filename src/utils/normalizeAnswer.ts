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

function levenshteinDistance(a: string, b: string): number {
  const distances = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) distances[j] = j;

  for (let i = 1; i <= a.length; i++) {
    let previousDiagonal = distances[0];
    distances[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const previousDistance = distances[j];
      distances[j] =
        a[i - 1] === b[j - 1]
          ? previousDiagonal
          : 1 + Math.min(previousDiagonal, distances[j], distances[j - 1]);
      previousDiagonal = previousDistance;
    }
  }
  return distances[b.length];
}

// How many typos (insertions/deletions/substitutions) we tolerate, scaled to
// the length of the expected answer \u2014 short answers leave no room for a typo
// to hide in, longer ones can absorb one or two.
function typoTolerance(length: number): number {
  if (length <= 3) return 0;
  if (length <= 6) return 1;
  if (length <= 12) return 2;
  return 3;
}

// Compares two already-normalized answers, tolerating a small number of
// typos so users aren't penalized for misspelling an otherwise correct
// answer.
export function isFuzzyAnswerMatch(given: string, accepted: string): boolean {
  if (given === accepted) return true;
  const tolerance = typoTolerance(accepted.length);
  if (tolerance === 0) return false;
  return levenshteinDistance(given, accepted) <= tolerance;
}
