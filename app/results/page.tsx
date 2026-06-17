"use client";

import { useState } from "react";

type ResponseEntry = {
  id: string;
  date: string;
  place: string;
  note: string;
  receivedAt: string;
};

export default function ResultsPage() {
  const [key, setKey] = useState("");
  const [responses, setResponses] = useState<ResponseEntry[] | null>(null);
  const [error, setError] = useState("");

  async function fetchResults(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/respond?key=${encodeURIComponent(key)}`);
    if (!res.ok) {
      setError("Wrong key, or nothing to see yet.");
      return;
    }
    const data = await res.json();
    setResponses(data.responses);
  }

  return (
    <main className="min-h-screen bg-ink text-paper px-6 py-16 flex flex-col items-center font-sans">
      <h1 className="font-display italic text-2xl mb-8">Results</h1>

      {!responses && (
        <form onSubmit={fetchResults} className="flex flex-col gap-3 w-full max-w-xs">
          <input
            type="password"
            placeholder="Secret key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="rounded-lg border border-paper/20 bg-ink-deep/60 px-4 py-2 outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="rounded-full bg-gold px-5 py-2 text-sm text-ink-deep"
          >
            View
          </button>
          {error && <p className="text-xs text-blush/80">{error}</p>}
        </form>
      )}

      {responses && (
        <div className="w-full max-w-md flex flex-col gap-4">
          {responses.length === 0 && (
            <p className="text-paper/50 text-sm">No responses yet.</p>
          )}
          {responses
            .slice()
            .reverse()
            .map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-paper/15 bg-ink-deep/50 p-4"
              >
                <p className="text-sm">
                  <span className="text-gold-soft">Date:</span> {r.date}
                </p>
                <p className="text-sm">
                  <span className="text-gold-soft">Place:</span>{" "}
                  {r.place || "—"}
                </p>
                {r.note && (
                  <p className="text-sm">
                    <span className="text-gold-soft">Note:</span> {r.note}
                  </p>
                )}
                <p className="text-xs text-paper/40 mt-2">{r.receivedAt}</p>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
