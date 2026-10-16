import { connectDatabase, db } from "./db.ts";

// Stub auth: the app has one implicit user until real sign-in exists.
export const CURRENT_USER_ID = "local-user";

export type SavedSentence = {
  id: string;
  text: string;
  createdAt: string;
};

export async function saveSentence(text: string): Promise<SavedSentence> {
  await connectDatabase();
  const row = await db.orm.public.Sentence.create({
    userId: CURRENT_USER_ID,
    text,
  });

  return { id: String(row.id), text: row.text, createdAt: row.createdAt };
}

export async function listSentences(): Promise<SavedSentence[]> {
  await connectDatabase();
  const rows = await db.orm.public.Sentence.where({ userId: CURRENT_USER_ID })
    .orderBy((s) => s.createdAt.desc())
    .all();

  return rows.map((row) => ({
    id: String(row.id),
    text: row.text,
    createdAt: row.createdAt,
  }));
}
