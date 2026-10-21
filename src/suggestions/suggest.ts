"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import { lookUp, type Suggestion } from "./dictionary.ts";

const suggestions = z.object({
  suggestions: z
    .array(
      z.object({
        text: z.string().describe("the German word or phrase"),
        label: z.string().describe("a one or two word hint in English: case, register or nuance"),
      }),
    )
    .min(2)
    .max(3),
});

async function fromModel(word: string, line: string): Promise<Suggestion[]> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: suggestions,
    prompt:
      `A learner is writing a German sentence and left an English word in brackets.\n` +
      `Sentence so far: ${line}\n` +
      `English word or phrase: ${word}\n` +
      `Give two or three ways to say it in German that fit this sentence. ` +
      `Each needs the German text, inflected so it can be dropped straight into the sentence, ` +
      `and a short English label such as "accusative", "formal" or "colloquial".`,
  });

  return object.suggestions;
}

/**
 * German suggestions for a bracketed English word.
 *
 * OPENAI_API_KEY is read here and nowhere else: without it, or when the call
 * fails, the built-in dictionary answers instead. Putting the key into the
 * environment is the only thing needed to switch the AI path on.
 */
export async function suggestGerman(word: string, line: string): Promise<Suggestion[]> {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await fromModel(word, line);
    } catch {
      // Stay quiet and let the dictionary answer.
    }
  }

  return lookUp(word);
}
