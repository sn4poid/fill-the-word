"use client";

import { useEffect, useRef, useState } from "react";

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

export default function Home() {
  const [value, setValue] = useState("");
  const [bracketMatch, setBracketMatch] = useState<BracketMatch | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const match = findBracketWord(value);
      setBracketMatch(match);
      setSuggestions(match ? getSuggestions(match.word) : null);
    }, 200);
    return () => clearTimeout(timer);
  }, [value]);

  function applySuggestion(suggestion: Suggestion) {
    if (!bracketMatch) return;
    const replacement = suggestion.article
      ? `${suggestion.article} ${suggestion.word}`
      : suggestion.word;
    const before = value.slice(0, bracketMatch.start);
    const after = value.slice(bracketMatch.end);
    const nextValue = `${before}${replacement}${after}`;
    setValue(nextValue);
    setBracketMatch(null);
    setSuggestions(null);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      const cursor = before.length + replacement.length;
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <main className="shell">
      <p className="lede">Ein Satz genügt.</p>
      <input
        ref={inputRef}
        className="writingInput"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Schreib, was heute blieb …"
        autoComplete="off"
        spellCheck={false}
      />
      {bracketMatch &&
        (suggestions ? (
          <div className="suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.word}
                type="button"
                className="suggestionChip"
                onClick={() => applySuggestion(suggestion)}
              >
                <span className="suggestionWord">
                  {suggestion.article
                    ? `${suggestion.article} ${suggestion.word}`
                    : suggestion.word}
                </span>
                <span className="suggestionExample">{suggestion.example}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="suggestionFallback">
            Für „{bracketMatch.word}“ gibt es noch keine Vorschläge.
          </p>
        ))}
    </main>
  );
}
