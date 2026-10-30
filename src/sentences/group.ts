export type SavedSentence = {
  id: number;
  text: string;
  /** PostgreSQL `timestamptz` text, e.g. "2026-10-21 07:53:36.643+00". */
  createdAt: string;
};

export type SentenceGroup = {
  label: string;
  sentences: { id: number; text: string }[];
};

/** The groups without one sentence, and without a day that it leaves empty. */
export function withoutSentence(groups: readonly SentenceGroup[], id: number): SentenceGroup[] {
  const left: SentenceGroup[] = [];

  for (const group of groups) {
    const sentences = group.sentences.filter((sentence) => sentence.id !== id);
    if (sentences.length > 0) left.push({ label: group.label, sentences });
  }

  return left;
}

const germanDate = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function day(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Groups newest-first sentences under "Heute", "Gestern" or their date. */
export function groupByDay(sentences: readonly SavedSentence[], now: Date): SentenceGroup[] {
  const today = day(now);
  const yesterday = day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));

  const groups: SentenceGroup[] = [];
  let openDay: string | undefined;

  for (const sentence of sentences) {
    const written = new Date(sentence.createdAt);
    const writtenDay = day(written);

    if (writtenDay !== openDay) {
      const label =
        writtenDay === today
          ? "Heute"
          : writtenDay === yesterday
            ? "Gestern"
            : germanDate.format(written);
      groups.push({ label, sentences: [] });
      openDay = writtenDay;
    }

    groups[groups.length - 1].sentences.push({ id: sentence.id, text: sentence.text });
  }

  return groups;
}
