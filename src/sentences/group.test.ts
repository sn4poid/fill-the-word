import { expect, test } from "vitest";

import { groupByDay } from "./group.ts";

// Midday timestamps, so the grouping lands on the same calendar day in any time zone.
const now = new Date(2026, 9, 21, 12, 0);

function at(timestamp: string, id: number) {
  return { id, text: `Satz ${id}`, createdAt: timestamp };
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
    { id: 2, text: "Satz 2" },
    { id: 1, text: "Satz 1" },
  ]);
});

test("has no groups without sentences", () => {
  expect(groupByDay([], now)).toEqual([]);
});
