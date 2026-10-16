export type Suggestion = {
  word: string;
  article?: string;
  example: string;
};

const DICTIONARY: Record<string, Suggestion[]> = {
  umbrella: [
    {
      word: "Regenschirm",
      article: "der",
      example: "Nimm den Regenschirm mit, es regnet.",
    },
    { word: "Schirm", article: "der", example: "Hast du deinen Schirm dabei?" },
  ],
  weather: [
    { word: "Wetter", article: "das", example: "Das Wetter ist heute schön." },
  ],
  train: [
    { word: "Zug", article: "der", example: "Der Zug fährt um acht Uhr ab." },
    {
      word: "Bahn",
      article: "die",
      example: "Ich fahre mit der Bahn zur Arbeit.",
    },
  ],
  coffee: [
    {
      word: "Kaffee",
      article: "der",
      example: "Ich trinke jeden Morgen einen Kaffee.",
    },
  ],
  friend: [
    { word: "Freund", article: "der", example: "Er ist mein bester Freund." },
    {
      word: "Freundin",
      article: "die",
      example: "Sie ist meine beste Freundin.",
    },
  ],
  work: [
    {
      word: "Arbeit",
      article: "die",
      example: "Ich gehe jeden Tag zur Arbeit.",
    },
    { word: "arbeiten", example: "Ich muss heute länger arbeiten." },
  ],
  tired: [{ word: "müde", example: "Ich bin heute sehr müde." }],
  happy: [
    { word: "glücklich", example: "Ich bin sehr glücklich." },
    { word: "froh", example: "Ich bin froh, dich zu sehen." },
  ],
  city: [
    { word: "Stadt", article: "die", example: "Die Stadt ist sehr lebendig." },
  ],
  morning: [
    { word: "Morgen", article: "der", example: "Am Morgen trinke ich Kaffee." },
  ],
  evening: [
    { word: "Abend", article: "der", example: "Am Abend lese ich gern." },
  ],
  rain: [
    { word: "Regen", article: "der", example: "Der Regen hört bald auf." },
  ],
  snow: [
    { word: "Schnee", article: "der", example: "Der Schnee fällt leise." },
  ],
  book: [
    { word: "Buch", article: "das", example: "Ich lese ein spannendes Buch." },
  ],
  phone: [
    { word: "Telefon", article: "das", example: "Mein Telefon klingelt." },
    {
      word: "Handy",
      article: "das",
      example: "Ich habe mein Handy vergessen.",
    },
  ],
  money: [
    { word: "Geld", article: "das", example: "Ich habe nicht viel Geld." },
  ],
  house: [
    {
      word: "Haus",
      article: "das",
      example: "Wir wohnen in einem kleinen Haus.",
    },
  ],
  street: [
    { word: "Straße", article: "die", example: "Die Straße ist heute leer." },
  ],
  food: [
    { word: "Essen", article: "das", example: "Das Essen schmeckt sehr gut." },
  ],
};

export function getSuggestions(word: string): Suggestion[] | null {
  return DICTIONARY[word.trim().toLowerCase()] ?? null;
}
