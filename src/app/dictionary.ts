export type Suggestion = {
  text: string;
  label: string;
};

const DICTIONARY: Record<string, Suggestion[]> = {
  umbrella: [
    { text: "der Regenschirm", label: "Nomen, maskulin" },
    { text: "der Schirm", label: "Nomen, maskulin · umgangssprachlich" },
  ],
  dog: [
    { text: "der Hund", label: "Nomen, maskulin" },
    { text: "die Hündin", label: "Nomen, femininin · weiblicher Hund" },
  ],
  house: [
    { text: "das Haus", label: "Nomen, neutrum" },
    { text: "das Zuhause", label: "Nomen, neutrum · übertragen" },
  ],
  coffee: [
    { text: "der Kaffee", label: "Nomen, maskulin" },
    { text: "einen Kaffee", label: "Nomen, maskulin · Akkusativ" },
  ],
  friend: [
    { text: "der Freund", label: "Nomen, maskulin" },
    { text: "die Freundin", label: "Nomen, femininin" },
  ],
  morning: [
    { text: "der Morgen", label: "Nomen, maskulin" },
    { text: "am Morgen", label: "Zeitangabe · Dativ" },
  ],
  rain: [
    { text: "der Regen", label: "Nomen, maskulin" },
    { text: "regnen", label: "Verb" },
  ],
  work: [
    { text: "die Arbeit", label: "Nomen, femininin" },
    { text: "arbeiten", label: "Verb" },
  ],
  happy: [
    { text: "glücklich", label: "Adjektiv" },
    { text: "froh", label: "Adjektiv · Synonym" },
  ],
  tired: [{ text: "müde", label: "Adjektiv" }],
  book: [{ text: "das Buch", label: "Nomen, neutrum" }],
  window: [{ text: "das Fenster", label: "Nomen, neutrum" }],
  street: [{ text: "die Straße", label: "Nomen, femininin" }],
  music: [{ text: "die Musik", label: "Nomen, femininin" }],
  time: [
    { text: "die Zeit", label: "Nomen, femininin" },
    { text: "die Uhrzeit", label: "Nomen, femininin · Uhrzeit" },
  ],
  love: [
    { text: "die Liebe", label: "Nomen, femininin" },
    { text: "lieben", label: "Verb" },
  ],
  light: [
    { text: "das Licht", label: "Nomen, neutrum" },
    { text: "leicht", label: "Adjektiv · leicht/einfach" },
  ],
  city: [{ text: "die Stadt", label: "Nomen, femininin" }],
  water: [{ text: "das Wasser", label: "Nomen, neutrum" }],
  bread: [{ text: "das Brot", label: "Nomen, neutrum" }],
};

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getSuggestions(word: string): Suggestion[] {
  const entry = DICTIONARY[word.trim().toLowerCase()];
  if (entry) return entry;
  return [{ text: capitalize(word.trim()), label: "unbekannt" }];
}
