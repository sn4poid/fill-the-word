"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { withoutSentence, type SentenceGroup } from "../sentences/group.ts";
import { findBracketed, replaceBracketed } from "../suggestions/brackets.ts";
import type { Suggestion } from "../suggestions/dictionary.ts";
import { suggestGerman } from "../suggestions/suggest.ts";
import { deleteSentence, saveSentence, signOut } from "./actions.ts";

const SUGGEST_DELAY_MS = 450;
const SAVED_VISIBLE_MS = 1500;
const CONFIRM_VISIBLE_MS = 3000;

export default function Writer({ history }: { history: SentenceGroup[] }) {
  const [line, setLine] = useState("");
  const [answer, setAnswer] = useState<{ word: string; suggestions: Suggestion[] }>({
    word: "",
    suggestions: [],
  });
  const [groups, setGroups] = useState(history);
  const [savedAt, setSavedAt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // The sentence whose "×" has been clicked once, and the one a delete failed on.
  const [asking, setAsking] = useState<number | null>(null);
  const [failed, setFailed] = useState<number | null>(null);

  const input = useRef<HTMLInputElement>(null);
  const cursor = useRef<number | null>(null);

  const word = findBracketed(line)?.word ?? null;
  // Chips belong to the bracketed word they were asked for, and to no other line.
  const suggestions = word !== null && answer.word === word ? answer.suggestions : [];

  // One request per bracketed word, a breath after the typing stops.
  useEffect(() => {
    if (word === null || answer.word === word) return;

    let wanted = true;
    const timer = setTimeout(() => {
      void suggestGerman(word, line).then((found) => {
        if (wanted) setAnswer({ word, suggestions: found });
      });
    }, SUGGEST_DELAY_MS);

    return () => {
      wanted = false;
      clearTimeout(timer);
    };
  }, [word, line, answer.word]);

  // Put the cursor behind an accepted suggestion once React has written the line.
  useEffect(() => {
    const at = cursor.current;
    if (at === null) return;
    cursor.current = null;
    input.current?.focus();
    input.current?.setSelectionRange(at, at);
  }, [line]);

  useEffect(() => {
    if (savedAt === 0) return;
    const timer = setTimeout(() => setSavedAt(0), SAVED_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [savedAt]);

  // A question that goes unanswered for a few seconds takes itself back.
  useEffect(() => {
    if (asking === null) return;
    const timer = setTimeout(() => setAsking(null), CONFIRM_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [asking]);

  function accept(suggestion: Suggestion) {
    const bracketed = findBracketed(line);
    if (bracketed === null) return;

    const replaced = replaceBracketed(line, bracketed, suggestion.text);
    cursor.current = replaced.cursor;
    setLine(replaced.line);
  }

  async function write(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const sentence = line.trim();
    if (sentence.length === 0) return;

    setLine("");

    try {
      setGroups(await saveSentence(sentence));
      setSavedAt(Date.now());
    } catch {
      setLine(sentence);
    }
  }

  /** First click asks, the second one deletes. */
  async function erase(id: number) {
    if (asking !== id) {
      setAsking(id);
      return;
    }

    const kept = groups;
    setAsking(null);
    setFailed(null);
    setGroups(withoutSentence(groups, id));

    try {
      setGroups(await deleteSentence(id));
    } catch {
      setGroups(kept);
      setFailed(id);
    }
  }

  return (
    <>
      <span className="wordmark">Satzweise</span>
      <button className="menu" type="button" aria-label="Verlauf" onClick={() => setMenuOpen(true)}>
        <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
          <path d="M1 4.5h14M1 11.5h14" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </button>

      <main className="screen">
        <div className="writing">
          <h1 className="headline">Ein Satz genügt.</h1>
          <input
            ref={input}
            className="line"
            value={line}
            onChange={(event) => setLine(event.target.value)}
            onKeyDown={write}
            placeholder="Schreib, was heute blieb …"
            aria-label="Satz"
            autoComplete="off"
            autoFocus
          />
          <div className="beneath">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                className="chip"
                type="button"
                onClick={() => accept(suggestion)}
              >
                {suggestion.text}
                <span className="chip-label">{suggestion.label}</span>
              </button>
            ))}
            {savedAt > 0 ? (
              <p key={savedAt} className="saved">
                Gespeichert
              </p>
            ) : null}
          </div>
        </div>
      </main>

      {menuOpen ? (
        <button
          className="backdrop"
          type="button"
          aria-label="Verlauf schließen"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside className="panel" data-open={menuOpen} inert={!menuOpen}>
        <button
          className="close"
          type="button"
          aria-label="Verlauf schließen"
          onClick={() => setMenuOpen(false)}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </button>

        <div className="history">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="day">{group.label}</h2>
              {group.sentences.map((sentence) => (
                <p key={sentence.id} className="entry">
                  <span>{sentence.text}</span>
                  {failed === sentence.id ? <span className="unerased">nicht gelöscht</span> : null}
                  <button
                    className="erase"
                    type="button"
                    data-asking={asking === sentence.id}
                    aria-label={asking === sentence.id ? "Löschen bestätigen" : "Satz löschen"}
                    onClick={() => void erase(sentence.id)}
                  >
                    {asking === sentence.id ? "wirklich?" : "×"}
                  </button>
                </p>
              ))}
            </section>
          ))}
        </div>

        <form action={signOut}>
          <button className="signout" type="submit">
            Abmelden
          </button>
        </form>
      </aside>
    </>
  );
}
