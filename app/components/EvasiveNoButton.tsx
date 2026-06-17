"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const DODGE_MESSAGES = [
  "Hm, that's strange.",
  "This button seems to be malfunctioning.",
  "Still not working. Odd.",
  "Engineers have been notified (there are no engineers).",
  "Have you tried the other button?",
  "This one's just for decoration now.",
  "At this point it's basically a 'yes' button with extra steps.",
];

type EvasiveNoButtonProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function EvasiveNoButton({ containerRef }: EvasiveNoButtonProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dodgeCount, setDodgeCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const dodge = useCallback(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const maxX = Math.max(containerRect.width - buttonRect.width - 16, 0);
    const maxY = Math.max(containerRect.height - buttonRect.height - 16, 0);

    const x = Math.random() * maxX - maxX / 2;
    const y = Math.random() * maxY - maxY / 2;

    setPosition({ x, y });
    setDodgeCount((c) => c + 1);

    const msgIndex = Math.min(
      DODGE_MESSAGES.length - 1,
      Math.floor((dodgeCount + 1) / 2)
    );
    setMessage(DODGE_MESSAGES[msgIndex]);
  }, [containerRef, dodgeCount]);

  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label="No"
        onPointerEnter={dodge}
        onClick={(e) => {
          e.preventDefault();
          dodge();
        }}
        animate={position ? { x: position.x, y: position.y } : { x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="rounded-full border border-rose/60 bg-transparent px-7 py-3 text-sm font-medium text-paper/70 transition-colors hover:border-rose"
        style={{ touchAction: "none" }}
      >
        no <span aria-hidden="true">😭</span>
      </motion.button>

      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-paper/50 font-sans"
          role="status"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
