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

// The preview shows the app in a frame on another site, and a browser only keeps
// a cookie from there when it says SameSite=None, Secure and Partitioned — the
// attributes the preview's own cookie uses. A Lax cookie is dropped, which signs
// the writer out again on the first request after signing in.
const COOKIE_ATTRIBUTES = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  partitioned: true,
  path: "/",
} as const;

export async function startSession(userId: number): Promise<void> {
  (await cookies()).set(COOKIE_NAME, `${userId}.${sign(userId)}`, {
    ...COOKIE_ATTRIBUTES,
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  // Cleared with the attributes it was set with, so the browser drops that cookie.
  (await cookies()).set(COOKIE_NAME, "", { ...COOKIE_ATTRIBUTES, maxAge: 0 });
}
