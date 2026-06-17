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

  // 3D mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-280, 280], [9, -9]), {
    stiffness: 120,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [-280, 280], [-9, 9]), {
    stiffness: 120,
    damping: 28,
  });
  const glowX = useSpring(useTransform(mouseX, [-280, 280], [0, 100]), {
    stiffness: 80,
    damping: 30,
  });
  const glowY = useSpring(useTransform(mouseY, [-280, 280], [0, 100]), {
    stiffness: 80,
    damping: 30,
  });

  function handleMouseMove(e: React.MouseEvent) {
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
      className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-12"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <AmbientGlow />

      {/* Aurora background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            top: "-10%",
            left: "15%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "5%",
            right: "10%",
            width: "420px",
            height: "420px",
            background: "radial-gradient(circle, rgba(201,162,39,0.10) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "40%",
            right: "20%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(232,160,176,0.08) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      {/* 3D Tilt Wrapper */}
      <motion.div
        ref={cardRef}
        layout
        style={{
          rotateX: answered ? 0 : rotateX,
          rotateY: answered ? 0 : rotateY,
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full"
        animate={{ maxWidth: answered ? "420px" : "512px" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Dynamic glow that follows mouse */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(201,162,39,0.18) 0%, transparent 60%)`
            ),
            zIndex: -1,
          }}
        />

        {/* Glass Card */}
        <div className="glass-card rounded-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.55) 30%, rgba(232,160,176,0.4) 70%, transparent 100%)",
            }}
          />

          {/* Content area */}
          <div
            ref={containerRef}
            className="px-8 sm:px-14 py-12 sm:py-16 flex flex-col items-center text-center"
          >
            <AnimatePresence mode="wait">
              {!answered ? (
                <motion.div
                  key="ask"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="flex flex-col items-center gap-9 w-full"
                >
                  {/* Rotating pickup lines */}
                  <PickupLine />

                  {/* Ornamental divider */}
                  <div
                    className="flex items-center gap-3 w-full max-w-xs"
                    aria-hidden="true"
                  >
                    <div
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, rgba(245,240,232,0.12))",
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "rgba(245,240,232,0.2)" }}
                    >
                      ✦
                    </span>
                    <div
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(to left, transparent, rgba(245,240,232,0.12))",
                      }}
                    />
                  </div>

                  {/* Recipient label */}
                  <p
                    className="text-xs uppercase tracking-[0.3em] font-sans -mb-4"
                    style={{ color: "rgba(201,162,39,0.55)" }}
                  >
                    {RECIPIENT_NAME}
                  </p>

                  {/* Main question */}
                  <h1 className="font-display italic leading-snug"
                    style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
                  >
                    <span style={{ color: "#f5f0e8" }}>Would you like to go</span>
                    <br />
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #f5f0e8 0%, #e8c86d 45%, #f5f0e8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      on a date with me?
                    </span>
                  </h1>

                  {/* Buttons */}
                  <div className="flex items-center gap-5 mt-1">
                    <motion.button
                      type="button"
                      onClick={() => setAnswered(true)}
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.96 }}
                      className="rounded-full px-9 py-3.5 text-sm font-medium font-sans"
                      style={{
                        background:
                          "linear-gradient(135deg, #b8890f 0%, #e8c86d 50%, #b8890f 100%)",
                        color: "#06040f",
                        boxShadow:
                          "0 0 32px rgba(201,162,39,0.40), 0 4px 20px rgba(0,0,0,0.35)",
                      }}
                    >
                      yes ❤️
                    </motion.button>

                    <EvasiveNoButton containerRef={containerRef} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="picker"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                  className="flex flex-col items-center gap-6 w-full"
                >
                  {/* Header */}
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 }}
                      className="text-xl mb-0.5"
                    >
                      ✨
                    </motion.div>
                    <p
                      className="text-xs uppercase tracking-[0.3em] font-sans"
                      style={{ color: "rgba(201,162,39,0.55)" }}
                    >
                      I knew you would.
                    </p>
                    <h2
                      className="font-display italic text-2xl"
                      style={{ color: "#f5f0e8" }}
                    >
                      Let&apos;s pick a day.
                    </h2>
                    <p
                      className="font-display italic text-xs mt-0.5"
                      style={{ color: "rgba(232,160,176,0.5)" }}
                    >
                      &ldquo;Every day is better with something to look forward to.&rdquo;
                    </p>
                  </div>
                  <DatePicker />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom accent line */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(155,61,90,0.35) 40%, rgba(124,58,237,0.3) 70%, transparent 100%)",
            }}
          />
        </div>
      </motion.div>
    </main>
  );
}
