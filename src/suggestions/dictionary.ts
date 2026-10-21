export type Suggestion = {
  /** The German word or phrase that replaces the bracketed English one. */
  text: string;
  /** A short hint: case, register or nuance. */
  label: string;
};

/**
 * Fallback source for suggestions, used whenever the AI path is unavailable.
 * Same shape as the model's structured output.
 */
const DICTIONARY: Record<string, Suggestion[]> = {
  umbrella: [
    { text: "den Regenschirm", label: "accusative" },
    { text: "der Regenschirm", label: "nominative" },
    { text: "den Schirm", label: "colloquial" },
  ],
  coffee: [
    { text: "einen Kaffee", label: "accusative" },
    { text: "der Kaffee", label: "nominative" },
  ],
  weather: [
    { text: "das Wetter", label: "nominative" },
    { text: "beim Wetter", label: "dative" },
  ],
  tired: [
    { text: "müde", label: "neutral" },
    { text: "erschöpft", label: "formal" },
    { text: "kaputt", label: "colloquial" },
  ],
  friend: [
    { text: "eine Freundin", label: "feminine" },
    { text: "ein Freund", label: "masculine" },
    { text: "eine Bekannte", label: "distant" },
  ],
  home: [
    { text: "nach Hause", label: "direction" },
    { text: "zu Hause", label: "location" },
    { text: "das Zuhause", label: "noun" },
  ],
  work: [
    { text: "die Arbeit", label: "nominative" },
    { text: "zur Arbeit", label: "dative, direction" },
    { text: "arbeiten", label: "verb" },
  ],
  love: [
    { text: "die Liebe", label: "noun" },
    { text: "lieben", label: "verb" },
    { text: "ich mag", label: "softer" },
  ],
  time: [
    { text: "die Zeit", label: "nominative" },
    { text: "die Uhrzeit", label: "clock time" },
    { text: "das Mal", label: "occasion" },
  ],
  today: [
    { text: "heute", label: "adverb" },
    { text: "der heutige Tag", label: "formal" },
  ],
};

export function lookUp(word: string): Suggestion[] {
  return DICTIONARY[word.trim().toLowerCase()] ?? [];
}
