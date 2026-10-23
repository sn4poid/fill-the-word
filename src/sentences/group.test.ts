import { expect, test } from "vitest";

import { groupByDay, withoutSentence } from "./group.ts";

// Midday timestamps, so the grouping lands on the same calendar day in any time zone.
const now = new Date(2026, 9, 21, 12, 0);

function at(timestamp: string, id: number) {
  return { id, text: `Sentence ${id}`, createdAt: timestamp };
}

test("labels the days as Heute, Gestern and a German date", () => {
  const groups = groupByDay(
    [
      at("2026-10-21 12:30:36.643+00", 3),
      at("2026-10-20 12:10:00+00", 2),
      at("2026-10-12 12:00:00+00", 1),
    ],
    now,
  );

  expect(groups.map((group) => group.label)).toEqual(["Heute", "Gestern", "12. Oktober 2026"]);
});

test("keeps the sentences of one day together in the order given", () => {
  const groups = groupByDay(
    [at("2026-10-21 13:00:00+00", 2), at("2026-10-21 12:00:00+00", 1)],
    now,
  );

  expect(groups).toHaveLength(1);
  expect(groups[0].sentences).toEqual([
    { id: 2, text: "Sentence 2" },
    { id: 1, text: "Sentence 1" },
  ]);
});

test("has no groups without sentences", () => {
  expect(groupByDay([], now)).toEqual([]);
});

const twoDays = [
  {
    label: "Heute",
    sentences: [
      { id: 3, text: "Drei" },
      { id: 2, text: "Zwei" },
    ],
  },
  { label: "Gestern", sentences: [{ id: 1, text: "Eins" }] },
];

test("takes one sentence out of its day", () => {
  expect(withoutSentence(twoDays, 2)).toEqual([
    { label: "Heute", sentences: [{ id: 3, text: "Drei" }] },
    { label: "Gestern", sentences: [{ id: 1, text: "Eins" }] },
  ]);
});

test("drops the day the last sentence leaves empty", () => {
  expect(withoutSentence(twoDays, 1)).toEqual([
    {
      label: "Heute",
      sentences: [
        { id: 3, text: "Drei" },
        { id: 2, text: "Zwei" },
      ],
    },
  ]);
});

test("leaves the history alone when the sentence is not in it", () => {
  expect(withoutSentence(twoDays, 9)).toEqual(twoDays);
});
