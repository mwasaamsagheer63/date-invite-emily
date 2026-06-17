"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function DatePicker() {
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setState("submitting");

    try {
      const res = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, place, note }),
      });
      if (!res.ok) throw new Error("failed");
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-2xl italic text-gold-soft mb-2">
          Perfect.
        </p>
        <p className="text-paper/70 font-sans text-sm">
          That's all I needed. I'll see you then.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="date" className="text-xs uppercase tracking-wider text-paper/50 font-sans">
          When works for you?
        </label>
        <input
          id="date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-paper/20 bg-ink-deep/60 px-4 py-3 text-paper font-sans focus:border-gold outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="place" className="text-xs uppercase tracking-wider text-paper/50 font-sans">
          Anywhere in particular?
        </label>
        <input
          id="place"
          type="text"
          placeholder="Coffee, dinner, somewhere with a view..."
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="rounded-lg border border-paper/20 bg-ink-deep/60 px-4 py-3 text-paper placeholder:text-paper/30 font-sans focus:border-gold outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="note" className="text-xs uppercase tracking-wider text-paper/50 font-sans">
          Anything else? (optional)
        </label>
        <textarea
          id="note"
          rows={2}
          placeholder="..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-lg border border-paper/20 bg-ink-deep/60 px-4 py-3 text-paper placeholder:text-paper/30 font-sans focus:border-gold outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="mt-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink-deep transition-opacity hover:opacity-90 disabled:opacity-50 font-sans"
      >
        {state === "submitting" ? "Sending..." : "Confirm"}
      </button>

      <AnimatePresence>
        {state === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-blush/80 text-center font-sans"
          >
            That didn't send. Mind trying again?
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
