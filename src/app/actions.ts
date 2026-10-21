"use server";

import { redirect } from "next/navigation";

import {
  currentUser,
  endSession,
  hashPassword,
  startSession,
  verifyPassword,
} from "../auth/session.ts";
import { db } from "../prisma/db.ts";
import type { SentenceGroup } from "../sentences/group.ts";
import { loadHistory } from "../sentences/history.ts";

async function authenticate(email: string, password: string): Promise<number | null> {
  if (email.length === 0 || password.length < 6) return null;

  const user = await db.orm.public.User.select("id", "passwordHash").where({ email }).first();

  // The first sign-in with an address opens the account — the app has no
  // separate registration screen.
  if (user === null) {
    const created = await db.orm.public.User.select("id").create({
      email,
      passwordHash: hashPassword(password),
    });
    return created.id;
  }

  if (user.passwordHash === null) return null;

  return verifyPassword(password, user.passwordHash) ? user.id : null;
}

export async function signIn(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const userId = await authenticate(email, String(formData.get("password") ?? ""));

  if (userId === null) redirect("/sign-in?error=1");

  await startSession(userId);
  redirect("/");
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/sign-in");
}

/** Saves one sentence and answers with the writer's history including it. */
export async function saveSentence(text: string): Promise<SentenceGroup[]> {
  const user = await currentUser();
  if (user === null) redirect("/sign-in");

  const sentence = text.trim();
  if (sentence.length > 0) {
    await db.orm.public.Sentence.create({ userId: user.id, text: sentence });
  }

  return loadHistory(user.id);
}
