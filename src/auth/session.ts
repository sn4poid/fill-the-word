import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { db } from "../prisma/db.ts";

const COOKIE_NAME = "wortluecke_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

// Stubbed signing key: a deployment should set AUTH_SECRET. The literal keeps
// local development working without putting a real secret in the repository.
function signingKey(): string {
  return process.env.AUTH_SECRET ?? "wortluecke-development-key";
}

function sign(userId: number): string {
  return createHmac("sha256", signingKey()).update(String(userId)).digest("base64url");
}

function matches(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  return matches(scryptSync(password, salt, 64).toString("hex"), hash);
}

export type SignedInUser = { id: number; email: string };

export async function currentUser(): Promise<SignedInUser | null> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return null;

  const [id, signature] = cookie.split(".");
  if (!id || !signature) return null;

  const userId = Number(id);
  if (!Number.isInteger(userId) || !matches(sign(userId), signature)) return null;

  return db.orm.public.User.select("id", "email").first({ id: userId });
}

export async function startSession(userId: number): Promise<void> {
  (await cookies()).set(COOKIE_NAME, `${userId}.${sign(userId)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
