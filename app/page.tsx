"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import AmbientGlow from "./components/AmbientGlow";
import EvasiveNoButton from "./components/EvasiveNoButton";
import DatePicker from "./components/DatePicker";
import PickupLine from "./components/PickupLine";

const RECIPIENT_NAME = "Emily";

export default function Home() {
  const [answered, setAnswered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), {
    stiffness: 120, damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), {
    stiffness: 120, damping: 28,
  });
  const glowX = useSpring(useTransform(mouseX, [-300, 300], [0, 100]), {
    stiffness: 80, damping: 30,
  });
  const glowY = useSpring(useTransform(mouseY, [-300, 300], [0, 100]), {
    stiffness: 80, damping: 30,
  });
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(201,162,39,0.15) 0%, transparent 60%)`
  );

  function handleMouseMove(e: React.MouseEvent) {
    if (answered) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <main
      className="relative flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-8 py-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <AmbientGlow />

      {/* Aurora orbs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute rounded-full" style={{ top: "-5%", left: "10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute rounded-full" style={{ bottom: "0%", right: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(201,162,39,0.09) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute rounded-full" style={{ top: "35%", right: "15%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(232,160,176,0.07) 0%, transparent 70%)", filter: "blur(35px)" }} />
      </div>

      {/* ── QUESTION VIEW ── */}
      <AnimatePresence mode="wait">
        {!answered ? (
          <motion.div
            key="ask"
            ref={cardRef}
            style={{ rotateX, rotateY, perspective: 1200, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-3xl"
          >
            {/* Mouse glow */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-2xl"
              style={{
                background: glowBg,
                zIndex: -1,
              }}
            />

            <div className="glass-card rounded-2xl relative overflow-hidden">
              {/* Top line */}
              <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.55) 30%, rgba(232,160,176,0.4) 70%, transparent 100%)" }} />

              <div
                ref={containerRef}
                className="px-8 sm:px-16 lg:px-24 py-14 sm:py-18 flex flex-col items-center text-center"
              >
                <PickupLine />

                <div className="flex items-center gap-3 w-full max-w-sm my-7" aria-hidden="true">
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(245,240,232,0.12))" }} />
                  <span className="text-xs" style={{ color: "rgba(245,240,232,0.2)" }}>✦</span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(245,240,232,0.12))" }} />
                </div>

                <p className="text-xs uppercase tracking-[0.3em] font-sans mb-5" style={{ color: "rgba(201,162,39,0.55)" }}>
                  {RECIPIENT_NAME}
                </p>

                <h1 className="font-display italic leading-snug mb-10" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
                  <span style={{ color: "#f5f0e8" }}>Would you like to go</span>
                  <br />
                  <span style={{ background: "linear-gradient(135deg, #f5f0e8 0%, #e8c86d 45%, #f5f0e8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    on a date with me?
                  </span>
                </h1>

                <div className="flex items-center gap-6">
                  <motion.button
                    type="button"
                    onClick={() => setAnswered(true)}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-full px-10 py-4 text-sm font-medium font-sans"
                    style={{ background: "linear-gradient(135deg, #b8890f 0%, #e8c86d 50%, #b8890f 100%)", color: "#06040f", boxShadow: "0 0 32px rgba(201,162,39,0.40), 0 4px 20px rgba(0,0,0,0.35)" }}
                  >
                    yes ❤️
                  </motion.button>
                  <EvasiveNoButton containerRef={containerRef} />
                </div>
              </div>

              <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(155,61,90,0.35) 40%, rgba(124,58,237,0.3) 70%, transparent 100%)" }} />
            </div>
          </motion.div>

        ) : (

          /* ── PICKER VIEW (full width 2-column) ── */
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative z-10 w-full max-w-6xl"
          >
            <div className="glass-card rounded-2xl relative overflow-hidden">
              <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.55) 30%, rgba(232,160,176,0.4) 70%, transparent 100%)" }} />

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-0">

                {/* Left column — romantic heading */}
                <div className="flex flex-col justify-center px-8 sm:px-12 py-10 lg:py-16 lg:border-r" style={{ borderColor: "rgba(245,240,232,0.07)" }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="flex flex-col gap-5"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
                      className="text-3xl"
                    >
                      ✨
                    </motion.div>

                    <div className="flex flex-col gap-2">
                      <p className="text-xs uppercase tracking-[0.3em] font-sans" style={{ color: "rgba(201,162,39,0.55)" }}>
                        I knew you would.
                      </p>
                      <h2 className="font-display italic" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#f5f0e8", lineHeight: 1.15 }}>
                        Let&apos;s pick<br />a day.
                      </h2>
                    </div>

                    <div className="w-16 h-px" style={{ background: "linear-gradient(to right, rgba(201,162,39,0.4), transparent)" }} />

                    <p className="font-display italic text-sm leading-relaxed max-w-xs" style={{ color: "rgba(232,160,176,0.55)" }}>
                      &ldquo;Every day is better with something to look forward to.&rdquo;
                    </p>

                    {/* Decorative dots */}
                    <div className="flex gap-2 mt-2" aria-hidden="true">
                      {[0.6, 0.3, 0.15].map((o, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(201,162,39,${o})` }} />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right column — date picker form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="px-8 sm:px-12 py-10 lg:py-16"
                >
                  <DatePicker />
                </motion.div>
              </div>

              <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(155,61,90,0.35) 40%, rgba(124,58,237,0.3) 70%, transparent 100%)" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
