"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const DODGE_MESSAGES = [
  "Hmm. That's strange.",
  "This button seems to have a mind of its own.",
  "Still not cooperating. Curious.",
  "Our engineers have been notified. (There are no engineers.)",
  "Have you considered the other option?",
  "At this point it's practically volunteering.",
  "I think the universe is trying to tell you something.",
];

type EvasiveNoButtonProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function EvasiveNoButton({ containerRef }: EvasiveNoButtonProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
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
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className="rounded-full border px-7 py-3 text-sm font-medium font-sans transition-colors"
        style={{
          borderColor: "rgba(155, 61, 90, 0.45)",
          background: "rgba(155, 61, 90, 0.08)",
          color: "rgba(245, 240, 232, 0.55)",
          touchAction: "none",
        }}
      >
        no 💔
      </motion.button>

      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-sans"
          style={{ color: "rgba(245, 240, 232, 0.38)" }}
          role="status"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
