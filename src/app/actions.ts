"use server";

import { listSentences, saveSentence } from "../prisma/sentences.ts";
import type { SavedSentence } from "../prisma/sentences.ts";

export type { SavedSentence };

export async function saveSentenceAction(
  text: string,
): Promise<SavedSentence | null> {
  const trimmed = text.trim();
  if (!trimmed || trimmed.includes("[") || trimmed.includes("]")) {
    return null;
  }

  return saveSentence(trimmed);
}

export async function listSentencesAction(): Promise<SavedSentence[]> {
  return listSentences();
}
