export type Bracketed = {
  /** The English word or phrase between the brackets. */
  word: string;
  /** Index of the opening bracket. */
  start: number;
  /** Index just past the closing bracket. */
  end: number;
};

const CLOSED_BRACKET = /\[([^[\]\n]{1,40})\]/g;

/** The last closed `[word]` in the line, or null while none is finished. */
export function findBracketed(line: string): Bracketed | null {
  let found: Bracketed | null = null;

  for (const match of line.matchAll(CLOSED_BRACKET)) {
    const word = match[1].trim();
    if (word.length === 0) continue;
    found = { word, start: match.index, end: match.index + match[0].length };
  }

  return found;
}

/** Puts `german` where the brackets were and says where the cursor belongs. */
export function replaceBracketed(
  line: string,
  bracketed: Bracketed,
  german: string,
): { line: string; cursor: number } {
  return {
    line: line.slice(0, bracketed.start) + german + line.slice(bracketed.end),
    cursor: bracketed.start + german.length,
  };
}
