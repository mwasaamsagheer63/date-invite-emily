"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalendarPicker from "./CalendarPicker";

type SubmitState = "idle" | "submitting" | "success" | "error";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const inputBase = {
  background: "rgba(6,4,15,0.5)",
  border: "1px solid rgba(245,240,232,0.1)",
  color: "#f5f0e8",
  borderRadius: "10px",
  padding: "11px 14px",
  fontFamily: "inherit",
  fontSize: "0.85rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s, box-shadow 0.2s",
} as React.CSSProperties;

const labelBase = {
  fontSize: "0.62rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "rgba(245,240,232,0.35)",
  fontFamily: "inherit",
  marginBottom: "6px",
  display: "block",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={item} className="flex flex-col">
      <label style={labelBase}>{label}</label>
      {children}
    </motion.div>
  );
}

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
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center gap-4 py-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
          className="text-4xl"
        >
          🌹
        </motion.div>
        <p
          className="font-display italic text-2xl"
          style={{ color: "#e8c86d" }}
        >
          Perfect.
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(245,240,232,0.5)" }}
        >
          That&apos;s all I needed.
          <br />
          I&apos;ll see you then.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col gap-5"
    >
      {/* Calendar */}
      <motion.div
        variants={item}
        className="rounded-2xl p-4"
        style={{
          background: "rgba(6,4,15,0.45)",
          border: "1px solid rgba(245,240,232,0.07)",
        }}
      >
        <CalendarPicker value={date} onChange={setDate} />
      </motion.div>

      {/* Divider */}
      <motion.div
        variants={item}
        className="flex items-center gap-3"
      >
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(245,240,232,0.1))",
          }}
        />
        <span
          className="text-xs"
          style={{ color: "rgba(245,240,232,0.18)" }}
        >
          ✦
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(to left, transparent, rgba(245,240,232,0.1))",
          }}
        />
      </motion.div>

      {/* Place */}
      <Field label="Anywhere in particular?">
        <input
          type="text"
          placeholder="Coffee, dinner, somewhere with a view..."
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          style={inputBase}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(201,162,39,0.55)";
            e.target.style.boxShadow = "0 0 16px rgba(201,162,39,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(245,240,232,0.1)";
            e.target.style.boxShadow = "none";
          }}
        />
      </Field>

      {/* Note */}
      <Field label="Anything else? (optional)">
        <textarea
          rows={2}
          placeholder="..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ ...inputBase, resize: "none" }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(201,162,39,0.55)";
            e.target.style.boxShadow = "0 0 16px rgba(201,162,39,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(245,240,232,0.1)";
            e.target.style.boxShadow = "none";
          }}
        />
      </Field>

      {/* Submit */}
      <motion.div variants={item}>
        <motion.button
          type="submit"
          disabled={!date || state === "submitting"}
          whileHover={date ? { scale: 1.03 } : {}}
          whileTap={date ? { scale: 0.97 } : {}}
          className="w-full rounded-full py-3.5 text-sm font-medium font-sans disabled:opacity-40 transition-opacity"
          style={{
            background: date
              ? "linear-gradient(135deg, #b8890f 0%, #e8c86d 50%, #b8890f 100%)"
              : "rgba(201,162,39,0.25)",
            color: date ? "#06040f" : "rgba(245,240,232,0.4)",
            boxShadow: date
              ? "0 0 32px rgba(201,162,39,0.35), 0 4px 16px rgba(0,0,0,0.3)"
              : "none",
          }}
        >
          {state === "submitting" ? "Sending..." : date ? "Confirm ✦" : "Pick a date first"}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {state === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center font-sans"
            style={{ color: "rgba(232,160,176,0.75)" }}
          >
            That didn&apos;t send. Mind trying again?
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
