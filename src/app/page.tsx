"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { listSentencesAction, saveSentenceAction } from "./actions.ts";
import type { SavedSentence } from "./actions.ts";
import { getSuggestions, type Suggestion } from "./dictionary.ts";

type BracketMatch = {
  start: number;
  end: number;
  word: string;
};

function findBracketWord(text: string): BracketMatch | null {
  const regex = /\[([^[\]]+)\]/g;
  let last: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    last = match;
  }
  if (!last) return null;
  return { start: last.index, end: last.index + last[0].length, word: last[1] };
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const dateLabelFormat = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function groupByDate(entries: SavedSentence[]) {
  const todayKey = dateKey(new Date());
  const yesterdayKey = dateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  const groups = new Map<string, SavedSentence[]>();
  for (const entry of entries) {
    const key = dateKey(new Date(entry.createdAt));
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(entry);
    } else {
      groups.set(key, [entry]);
    }
  }

  return Array.from(groups.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, bucket]) => ({
      key,
      label:
        key === todayKey
          ? "Heute"
          : key === yesterdayKey
            ? "Gestern"
            : dateLabelFormat.format(new Date(bucket[0].createdAt)),
      entries: bucket,
    }));
}

export default function Home() {
  const [value, setValue] = useState("");
  const [bracketMatch, setBracketMatch] = useState<BracketMatch | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<SavedSentence[] | null>(null);
  const [historyLoading, startHistoryLoad] = useTransition();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const match = findBracketWord(value);
      setBracketMatch(match);
      setSuggestions(match ? getSuggestions(match.word) : []);
    }, 250);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    if (!menuOpen) return;
    startHistoryLoad(async () => {
      const entries = await listSentencesAction();
      setHistory(entries);
    });
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  function triggerToast() {
    setToastVisible(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastVisible(false), 1600);
  }

  function applySuggestion(text: string) {
    if (!bracketMatch) return;
    const before = value.slice(0, bracketMatch.start);
    const after = value.slice(bracketMatch.end);
    const nextValue = `${before}${text}${after}`;
    setValue(nextValue);
    setBracketMatch(null);
    setSuggestions([]);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const cursor = before.length + text.length;
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  }

  async function handleSave(text: string) {
    const saved = await saveSentenceAction(text);
    if (!saved) return;
    setValue("");
    setBracketMatch(null);
    setSuggestions([]);
    setHistory((prev) => (prev ? [saved, ...prev] : prev));
    triggerToast();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || trimmed.includes("[") || trimmed.includes("]")) return;
    void handleSave(trimmed);
  }

  const grouped = history ? groupByDate(history) : [];

  return (
    <main className="shell">
      <header className="topbar">
        <span className="wordmark">Wortlücke</span>
        <button
          type="button"
          className="menuButton"
          aria-label="Menü öffnen"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menuIcon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      <div className="content">
        <p className="lede">Ein Satz genügt.</p>
        <input
          ref={inputRef}
          className="writingInput"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreib, was heute blieb …"
          autoComplete="off"
          spellCheck={false}
        />
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                type="button"
                className="suggestionChip"
                onClick={() => applySuggestion(suggestion.text)}
              >
                <span className="suggestionText">{suggestion.text}</span>
                <span className="suggestionLabel">{suggestion.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className={`toast ${toastVisible ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        Gespeichert
      </div>

      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`historyPanel ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="historyContent">
          {historyLoading && <p className="historyEmpty">Lädt …</p>}
          {!historyLoading && history && history.length === 0 && (
            <p className="historyEmpty">Noch keine Sätze gespeichert.</p>
          )}
          {!historyLoading &&
            grouped.map((group) => (
              <div key={group.key} className="historyGroup">
                <h2 className="historyGroupLabel">{group.label}</h2>
                <ul className="historyList">
                  {group.entries.map((entry) => (
                    <li key={entry.id} className="historyItem">
                      {entry.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
        <button type="button" className="signOutLink" onClick={() => {}}>
          Abmelden
        </button>
      </aside>
    </main>
  );
}
