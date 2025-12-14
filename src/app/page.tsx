"use client";

import { useEffect, useState } from "react";
import { countDueCards, createDeck, listDecks } from "./lib/db";
// import { countDueCards, createDeck, listDecks } from "@/lib/db";

export default function HomePage() {
  const [due, setDue] = useState<number>(0);
  const [decks, setDecks] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");

  async function refresh() {
    setDue(await countDueCards());
    setDecks(await listDecks());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Revue</h1>
        <p className="text-sm text-muted-foreground">
          Local-first flashcards with spaced repetition.
        </p>
      </header>

      <section className="rounded-xl border p-4">
        <div className="text-sm text-muted-foreground">Due today</div>
        <div className="text-4xl font-semibold">{due}</div>
      </section>

      <section className="rounded-xl border p-4 space-y-3">
        <h2 className="text-lg font-semibold">Create a deck</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border px-3 py-2"
            placeholder="e.g. DSA, Interview, React"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="rounded-lg border px-4 py-2"
            onClick={async () => {
              if (!name.trim()) return;
              await createDeck(name);
              setName("");
              await refresh();
            }}
          >
            Create
          </button>
        </div>
      </section>

      <section className="rounded-xl border p-4 space-y-2">
        <h2 className="text-lg font-semibold">Decks</h2>
        {decks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No decks yet.</p>
        ) : (
          <ul className="space-y-2">
            {decks.map((d) => (
              <li key={d.id} className="flex items-center justify-between">
                <span>{d.name}</span>
                <span className="text-xs text-muted-foreground">{d.id}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
