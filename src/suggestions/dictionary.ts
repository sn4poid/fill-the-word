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
    { text: "den Regenschirm", label: "Akkusativ" },
    { text: "der Regenschirm", label: "Nominativ" },
    { text: "den Schirm", label: "umgangssprachlich" },
  ],
  coffee: [
    { text: "einen Kaffee", label: "Akkusativ" },
    { text: "der Kaffee", label: "Nominativ" },
  ],
  weather: [
    { text: "das Wetter", label: "Nominativ" },
    { text: "beim Wetter", label: "Dativ" },
  ],
  tired: [
    { text: "müde", label: "neutral" },
    { text: "erschöpft", label: "gehoben" },
    { text: "kaputt", label: "umgangssprachlich" },
  ],
  friend: [
    { text: "eine Freundin", label: "weiblich" },
    { text: "ein Freund", label: "männlich" },
    { text: "eine Bekannte", label: "distanziert" },
  ],
  home: [
    { text: "nach Hause", label: "Richtung" },
    { text: "zu Hause", label: "Ort" },
    { text: "das Zuhause", label: "Substantiv" },
  ],
  work: [
    { text: "die Arbeit", label: "Nominativ" },
    { text: "zur Arbeit", label: "Dativ, Richtung" },
    { text: "arbeiten", label: "Verb" },
  ],
  love: [
    { text: "die Liebe", label: "Substantiv" },
    { text: "lieben", label: "Verb" },
    { text: "ich mag", label: "schwächer" },
  ],
  time: [
    { text: "die Zeit", label: "Nominativ" },
    { text: "die Uhrzeit", label: "Tageszeit" },
    { text: "das Mal", label: "Anzahl" },
  ],
  today: [
    { text: "heute", label: "Adverb" },
    { text: "der heutige Tag", label: "gehoben" },
  ],
};

export function lookUp(word: string): Suggestion[] {
  return DICTIONARY[word.trim().toLowerCase()] ?? [];
}
