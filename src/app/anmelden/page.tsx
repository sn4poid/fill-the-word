import { redirect } from "next/navigation";

import { currentUser } from "../../auth/session.ts";
import { signIn } from "../actions.ts";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ fehler?: string }>;
}) {
  if ((await currentUser()) !== null) redirect("/");
  const { fehler } = await searchParams;

  return (
    <main className="screen">
      <form className="writing" action={signIn}>
        <h1 className="headline">Wortlücke</h1>
        <input
          className="line"
          type="email"
          name="email"
          placeholder="E-Mail"
          aria-label="E-Mail"
          autoComplete="email"
          required
        />
        <input
          className="line"
          type="password"
          name="password"
          placeholder="Passwort"
          aria-label="Passwort"
          autoComplete="current-password"
          minLength={6}
          required
        />
        <div className="beneath">
          <button className="chip" type="submit">
            Weiter
          </button>
          {fehler ? <p className="hint">Das passt nicht.</p> : null}
        </div>
      </form>
    </main>
  );
}
