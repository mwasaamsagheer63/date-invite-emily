"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  hue: "gold" | "blush";
};

export default function AmbientGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let particles: Particle[] = [];
    let animationFrame: number;
    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * window.devicePixelRatio;
      canvas!.height = height * window.devicePixelRatio;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);

      const count = Math.min(48, Math.floor((width * height) / 28000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.6,
        speed: Math.random() * 0.18 + 0.04,
        drift: Math.random() * 0.6 - 0.3,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.7 ? "blush" : "gold",
      }));
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        const flicker = 0.55 + 0.45 * Math.sin(time / 900 + p.phase);
        const color =
          p.hue === "gold"
            ? `rgba(232, 184, 109, ${0.35 * flicker})`
            : `rgba(242, 201, 194, ${0.28 * flicker})`;

        ctx!.beginPath();
        ctx!.fillStyle = color;
        ctx!.arc(p.x, p.y, p.r * (0.8 + flicker * 0.4), 0, Math.PI * 2);
        ctx!.fill();

        if (!prefersReducedMotion) {
          p.y -= p.speed;
          p.x += Math.sin(time / 4000 + p.phase) * p.drift * 0.02;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
        }
      }
      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
