import { expect, test } from "vitest";

import { suggestGerman } from "./suggest.ts";

test("falls back to the dictionary when no OPENAI_API_KEY is set", async () => {
  delete process.env.OPENAI_API_KEY;

  const found = await suggestGerman("umbrella", "Heute brauchte ich einen [umbrella].");

  expect(found.length).toBeGreaterThanOrEqual(2);
  expect(found[0]).toEqual({ text: "den Regenschirm", label: "accusative" });
});

test("answers with nothing for a word the dictionary does not know", async () => {
  delete process.env.OPENAI_API_KEY;

  expect(await suggestGerman("photosynthesis", "Ich erklärte die [photosynthesis].")).toEqual([]);
});
