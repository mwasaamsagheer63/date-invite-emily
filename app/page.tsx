"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientGlow from "./components/AmbientGlow";
import EvasiveNoButton from "./components/EvasiveNoButton";
import DatePicker from "./components/DatePicker";

const RECIPIENT_NAME = "Emily";

export default function Home() {
  const [answered, setAnswered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative flex-1 flex items-center justify-center overflow-hidden px-6 py-16">
      <AmbientGlow />

      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
      >
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-10"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gold-soft/70 font-sans">
                {RECIPIENT_NAME}
              </p>

              <h1 className="font-display italic text-4xl sm:text-5xl leading-tight text-paper">
                Would you like to go
                <br />
                on a date with me?
              </h1>

              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setAnswered(true)}
                  className="rounded-full bg-gold px-8 py-3 text-sm font-medium text-ink-deep transition-transform hover:scale-105 font-sans"
                >
                  yes <span aria-hidden="true">❤️</span>
                </button>

                <EvasiveNoButton containerRef={containerRef} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="flex flex-col items-center gap-8 w-full"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gold-soft/70 font-sans">
                Good answer.
              </p>
              <h2 className="font-display italic text-3xl text-paper">
                Let's pick a day.
              </h2>
              <DatePicker />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
