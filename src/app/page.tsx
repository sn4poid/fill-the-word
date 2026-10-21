import { redirect } from "next/navigation";

import { currentUser } from "../auth/session.ts";
import { loadHistory } from "../sentences/history.ts";
import Writer from "./writer.tsx";

export default async function Home() {
  const user = await currentUser();
  if (user === null) redirect("/sign-in");

  return <Writer history={await loadHistory(user.id)} />;
}
