"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "If you were a star, you'd be the one I'd wish upon every night.",
  "I checked the calendar — every day looks better with you in it.",
  "You make ordinary moments feel like they deserve a soundtrack.",
  "Of all the questions worth asking, this one keeps finding me.",
  "They say courage is rare. Asking you feels worth every nerve.",
  "Somewhere between hello and here, I completely lost my composure.",
  "Some things are worth the wait. I think you're worth every second.",
];

export default function PickupLine() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const t = setTimeout(() => {
        setIndex((i) => (i + 1) % LINES.length);
        setVisible(true);
      }, 500);
      return () => clearTimeout(t);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 flex items-center justify-center overflow-hidden w-full">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="font-display italic text-xs sm:text-sm text-center leading-relaxed px-4"
            style={{ color: "rgba(232, 200, 109, 0.55)" }}
          >
            &ldquo;{LINES[index]}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
