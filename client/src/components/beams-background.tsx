"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
  className?: string;
  children?: ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(w: number, h: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * w * 1.5 - w * 0.25,
    y: Math.random() * h * 1.5 - h * 0.25,
    width: 30 + Math.random() * 60,
    length: h * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({
  className,
  children,
  intensity = "strong",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beams = useRef<Beam[]>([]);
  const raf = useRef<number | undefined>(undefined);

  const opacityScale = { subtle: 0.7, medium: 0.85, strong: 1 }[intensity];
  const MIN_BEAMS = 20;

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const total = MIN_BEAMS * 1.5;
      beams.current = Array.from({ length: total }, () =>
        createBeam(width, height)
      );

      drawStaticFrame();            // <── paint once, synchronously
    };

    const drawBeam = (b: Beam) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate((b.angle * Math.PI) / 180);

      const pulse =
        b.opacity *
        (0.8 + Math.sin(b.pulse) * 0.2) *
        opacityScale;

      const g = ctx.createLinearGradient(0, 0, 0, b.length);
      g.addColorStop(0, `hsla(${b.hue},85%,65%,0)`);
      g.addColorStop(0.1, `hsla(${b.hue},85%,65%,${pulse * 0.5})`);
      g.addColorStop(0.4, `hsla(${b.hue},85%,65%,${pulse})`);
      g.addColorStop(0.6, `hsla(${b.hue},85%,65%,${pulse})`);
      g.addColorStop(0.9, `hsla(${b.hue},85%,65%,${pulse * 0.5})`);
      g.addColorStop(1, `hsla(${b.hue},85%,65%,0)`);

      ctx.fillStyle = g;
      ctx.fillRect(-b.width / 2, 0, b.width, b.length);
      ctx.restore();
    };

    const tick = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width / dpr, height / dpr);

      beams.current.forEach((b, i) => {
        b.y -= b.speed;
        b.pulse += b.pulseSpeed;
        if (b.y + b.length < -100) {
          const col = i % 3;
          const span = width / dpr / 3;
          Object.assign(b, {
            y: height / dpr + 100,
            x:
              col * span + span / 2 + (Math.random() - 0.5) * span * 0.5,
            width: 100 + Math.random() * 100,
          });
        }
        drawBeam(b);
      });

      raf.current = requestAnimationFrame(tick);
    };

    const drawStaticFrame = () => {
      ctx.fillStyle = "#0d1117";               // dark fallback
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      beams.current.forEach(drawBeam);
    };

    resize();
    window.addEventListener("resize", resize);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [intensity, opacityScale]);

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-950">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          /* extra safety: a dark fill while JS initialises */
          style={{ background: "#0d1117", filter: "blur(15px)" }}
        />
        <motion.div
          className="absolute inset-0 bg-neutral-950/5"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
          style={{ backdropFilter: "blur(20px)" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
