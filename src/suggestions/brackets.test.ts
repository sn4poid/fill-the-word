import { expect, test } from "vitest";

import { findBracketed, replaceBracketed } from "./brackets.ts";

test("finds nothing while the bracket is still open", () => {
  expect(findBracketed("Heute brauchte ich einen [umbrel")).toBeNull();
});

test("finds the closed bracket and its position", () => {
  expect(findBracketed("Heute brauchte ich einen [umbrella] im Regen.")).toEqual({
    word: "umbrella",
    start: 25,
    end: 35,
  });
});

test("finds a short phrase and ignores empty brackets", () => {
  expect(findBracketed("Ich gehe [on foot].")?.word).toBe("on foot");
  expect(findBracketed("Ich gehe [].")).toBeNull();
});

test("takes the last closed bracket when there are several", () => {
  expect(findBracketed("[coffee] und [time]")?.word).toBe("time");
});

test("replaces the bracketed segment in place and puts the cursor behind it", () => {
  const line = "Heute brauchte ich einen [umbrella] im Regen.";
  const bracketed = findBracketed(line);

  expect(bracketed).not.toBeNull();
  expect(replaceBracketed(line, bracketed!, "Regenschirm")).toEqual({
    line: "Heute brauchte ich einen Regenschirm im Regen.",
    cursor: 36,
  });
});
