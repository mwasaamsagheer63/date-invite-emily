"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CalendarPicker({ value, onChange }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [dir, setDir] = useState(1);

  const selected = value ? new Date(value + "T12:00:00") : null;

  function go(delta: number) {
    setDir(delta);
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function pickDay(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
  }

  function isSelected(day: number) {
    return (
      !!selected &&
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    );
  }

  function isToday(day: number) {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  }

  const calKey = `${viewYear}-${viewMonth}`;

  return (
    <div className="w-full select-none">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <motion.button
          type="button"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-light"
          style={{
            color: "rgba(201,162,39,0.6)",
            background: "rgba(201,162,39,0.07)",
          }}
        >
          ‹
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.h3
            key={calKey}
            initial={{ opacity: 0, y: dir > 0 ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir > 0 ? -10 : 10 }}
            transition={{ duration: 0.22 }}
            className="font-display italic text-lg"
            style={{ color: "rgba(245,240,232,0.9)" }}
          >
            {MONTH_NAMES[viewMonth]} {viewYear}
          </motion.h3>
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => go(1)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-light"
          style={{
            color: "rgba(201,162,39,0.6)",
            background: "rgba(201,162,39,0.07)",
          }}
        >
          ›
        </motion.button>
      </div>

      {/* ── Day names ── */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-xs py-1 font-sans"
            style={{
              color: "rgba(201,162,39,0.45)",
              letterSpacing: "0.08em",
              fontSize: "0.65rem",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={calKey}
          initial={{ opacity: 0, x: dir > 0 ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir > 0 ? -24 : 24 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="grid grid-cols-7 gap-y-0.5"
        >
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="h-9" />;

            const sel = isSelected(day);
            const tod = isToday(day);
            const past = isPast(day);

            return (
              <motion.button
                key={`${calKey}-${day}`}
                type="button"
                onClick={() => pickDay(day)}
                whileHover={!past ? { scale: 1.18 } : {}}
                whileTap={!past ? { scale: 0.88 } : {}}
                className="relative h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm font-sans"
                style={
                  sel
                    ? {
                        background:
                          "linear-gradient(135deg, #b8890f 0%, #e8c86d 100%)",
                        color: "#06040f",
                        fontWeight: 700,
                        boxShadow:
                          "0 0 18px rgba(201,162,39,0.55), 0 2px 8px rgba(0,0,0,0.3)",
                      }
                    : tod
                    ? {
                        border: "1px solid rgba(201,162,39,0.5)",
                        color: "#e8c86d",
                        background: "rgba(201,162,39,0.09)",
                      }
                    : past
                    ? {
                        color: "rgba(245,240,232,0.2)",
                        cursor: "default",
                      }
                    : {
                        color: "rgba(245,240,232,0.72)",
                      }
                }
              >
                {sel && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      boxShadow: "0 0 22px rgba(201,162,39,0.5)",
                    }}
                  />
                )}
                {day}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* ── Selected date display ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="mt-5 py-3 px-4 rounded-xl text-center"
            style={{
              background: "rgba(201,162,39,0.07)",
              border: "1px solid rgba(201,162,39,0.18)",
            }}
          >
            <p
              className="font-display italic text-sm"
              style={{ color: "rgba(232,200,109,0.85)" }}
            >
              {selected.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
