import { db } from "../prisma/db.ts";
import { groupByDay, type SentenceGroup } from "./group.ts";

/** Every sentence of one user, newest first, grouped by the day it was written. */
export async function loadHistory(userId: number): Promise<SentenceGroup[]> {
  const sentences = await db.orm.public.Sentence.select("id", "text", "createdAt")
    .where({ userId })
    .orderBy((sentence) => sentence.createdAt.desc())
    .all();

  return groupByDay(sentences, new Date());
}
