"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  hue: "gold" | "rose" | "violet";
  type: "dot" | "heart";
  rotation: number;
  rotationSpeed: number;
};

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.9);
  ctx.bezierCurveTo(-s * 0.9, s * 0.3, -s, s * 0.05, -s, -s * 0.2);
  ctx.bezierCurveTo(-s, -s * 0.6, -s * 0.5, -s * 0.9, 0, -s * 0.45);
  ctx.bezierCurveTo(s * 0.5, -s * 0.9, s, -s * 0.6, s, -s * 0.2);
  ctx.bezierCurveTo(s, s * 0.05, s * 0.9, s * 0.3, 0, s * 0.9);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

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

      const count = Math.min(60, Math.floor((width * height) / 20000));
      const hues: Particle["hue"][] = ["gold", "rose", "violet"];
      const types: Particle["type"][] = ["dot", "dot", "dot", "heart"];

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 0.8,
        speed: Math.random() * 0.22 + 0.04,
        drift: Math.random() * 0.5 - 0.25,
        phase: Math.random() * Math.PI * 2,
        hue: hues[Math.floor(Math.random() * hues.length)],
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
      }));
    }

    function getColor(hue: Particle["hue"], alpha: number): string {
      if (hue === "gold") return `rgba(201,162,39,${alpha * 0.55})`;
      if (hue === "rose") return `rgba(232,160,176,${alpha * 0.45})`;
      return `rgba(139,92,246,${alpha * 0.35})`;
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        const flicker = 0.5 + 0.5 * Math.sin(time / 1200 + p.phase);
        const alpha = 0.25 + 0.55 * flicker;
        const color = getColor(p.hue, alpha);

        ctx!.fillStyle = color;

        if (p.type === "heart") {
          const heartSize = p.r * 2.2;
          drawHeart(ctx!, p.x, p.y, heartSize, p.rotation);
        } else {
          // Glowing dot — inner bright + outer glow
          const grd = ctx!.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.r * 3.5
          );
          grd.addColorStop(0, color);
          grd.addColorStop(1, "transparent");
          ctx!.beginPath();
          ctx!.fillStyle = grd;
          ctx!.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
          ctx!.fill();
        }

        if (!prefersReducedMotion) {
          p.y -= p.speed;
          p.x += Math.sin(time / 4500 + p.phase) * p.drift * 0.025;
          p.rotation += p.rotationSpeed;

          if (p.y < -15) {
            p.y = height + 15;
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
