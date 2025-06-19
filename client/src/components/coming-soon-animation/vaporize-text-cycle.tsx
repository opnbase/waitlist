"use client";

import React, { useRef, useEffect, useState, createElement, useMemo, useCallback, memo } from "react";

export enum Tag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  P = "p",
}

type VaporizeTextCycleProps = {
  texts: string[];
  cycleDuration?: number; // Total duration to run the animation cycle in seconds
  onComplete?: () => void; // Callback when the cycle duration is complete
  font?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
  };
  color?: string;
  spread?: number;
  density?: number;
  animation?: {
    vaporizeDuration?: number;
    fadeInDuration?: number;
    waitDuration?: number;
  };
  direction?: "left-to-right" | "right-to-left";
  alignment?: "left" | "center" | "right";
  tag?: Tag;
};

type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  shouldFadeQuickly?: boolean;
};

type TextBoundaries = {
  left: number;
  right: number;
  width: number;
};

declare global {
  interface HTMLCanvasElement {
    textBoundaries?: TextBoundaries;
  }
}

export default function VaporizeTextCycle({
  texts = [],
  cycleDuration,
  onComplete,
  font = {
    fontFamily: "sans-serif",
    fontSize: "50px",
    fontWeight: 400,
  },
  color = "rgb(255, 255, 255)",
  spread = 5,
  density = 5,
  animation = {
    vaporizeDuration: 2,
    fadeInDuration: 1,
    waitDuration: 0.5,
  },
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.P,
}: VaporizeTextCycleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isInView = useIsInView(wrapperRef as React.RefObject<HTMLElement>);
  const particlesRef = useRef<Particle[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationState, setAnimationState] = useState<"static" | "vaporizing" | "fadingIn" | "waiting">("static");
  const vaporizeProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const transformedDensity = transformValue(density, [0, 10], [0.3, 1], true);

  const elapsedTimeRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const globalDpr = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.devicePixelRatio * 1.5 || 1;
    }
    return 1;
  }, []);

  const wrapperStyle = useMemo(() => ({ width: "100%", height: "100%", pointerEvents: "none" as const }), []);
  const canvasStyle = useMemo(() => ({ minWidth: "30px", minHeight: "20px", pointerEvents: "none" as const }), []);

  const animationDurations = useMemo(() => ({
    VAPORIZE_DURATION: (animation.vaporizeDuration ?? 2) * 1000,
    FADE_IN_DURATION: (animation.fadeInDuration ?? 1) * 1000,
    WAIT_DURATION: (animation.waitDuration ?? 0.5) * 1000,
  }), [animation.vaporizeDuration, animation.fadeInDuration, animation.waitDuration]);

  const fontConfig = useMemo(() => {
    const fontSize = parseInt(font.fontSize?.replace("px", "") || "50");
    const VAPORIZE_SPREAD = calculateVaporizeSpread(fontSize);
    const MULTIPLIED_VAPORIZE_SPREAD = VAPORIZE_SPREAD * spread;
    return {
      fontSize,
      MULTIPLIED_VAPORIZE_SPREAD,
      font: `${font.fontWeight ?? 400} ${fontSize * globalDpr}px ${font.fontFamily}`,
    };
  }, [font.fontSize, font.fontWeight, font.fontFamily, spread, globalDpr]);

  useEffect(() => {
    if (isInView && animationState === 'static') {
        const startTimeout = setTimeout(() => {
            setAnimationState("vaporizing");
        }, 100);
        return () => clearTimeout(startTimeout);
    }
  }, [isInView, animationState]);

  useEffect(() => {
    if (!isInView) {
        elapsedTimeRef.current = 0;
        hasCompletedRef.current = false;
        return;
    }
    if (cycleDuration && hasCompletedRef.current) return;

    let lastTime = performance.now();
    let frameId: number;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      elapsedTimeRef.current += deltaTime;
      
      if (cycleDuration && elapsedTimeRef.current >= cycleDuration && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
        cancelAnimationFrame(frameId);
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx) {
        frameId = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (animationState) {
        case "vaporizing": {
          vaporizeProgressRef.current += deltaTime * 1000 / animationDurations.VAPORIZE_DURATION * 100;
          const textBoundaries = canvas.textBoundaries;
          if (!textBoundaries) break;

          const progress = Math.min(100, vaporizeProgressRef.current);
          const vaporizeX = direction === "left-to-right"
            ? textBoundaries.left + textBoundaries.width * progress / 100
            : textBoundaries.right - textBoundaries.width * progress / 100;

          const allVaporized = updateParticles(particlesRef.current, vaporizeX, deltaTime, fontConfig.MULTIPLIED_VAPORIZE_SPREAD, animationDurations.VAPORIZE_DURATION, direction, transformedDensity);
          renderParticles(ctx, particlesRef.current, globalDpr);

          if (vaporizeProgressRef.current >= 100 && allVaporized) {
            setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
            setAnimationState("fadingIn");
            fadeOpacityRef.current = 0;
          }
          break;
        }
        case "fadingIn": {
            fadeOpacityRef.current += deltaTime * 1000 / animationDurations.FADE_IN_DURATION;

            ctx.save();
            ctx.scale(globalDpr, globalDpr);
            particlesRef.current.forEach(particle => {
              particle.x = particle.originalX;
              particle.y = particle.originalY;
              const opacity = Math.min(fadeOpacityRef.current, 1) * particle.originalAlpha;
              const color = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
              ctx.fillStyle = color;
              ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1);
            });
            ctx.restore();

            if (fadeOpacityRef.current >= 1) {
              setAnimationState("waiting");
              setTimeout(() => {
                setAnimationState("vaporizing");
                vaporizeProgressRef.current = 0;
                resetParticles(particlesRef.current);
              }, animationDurations.WAIT_DURATION);
            }
            break;
        }
        case "waiting":
        case "static": {
          renderParticles(ctx, particlesRef.current, globalDpr);
          break;
        }
      }

      if (!hasCompletedRef.current) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [animationState, isInView, texts.length, direction, globalDpr, fontConfig.MULTIPLIED_VAPORIZE_SPREAD, animationDurations, cycleDuration]);

  useEffect(() => {
    renderCanvas({
      framerProps: { texts, font, color, alignment },
      canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
      wrapperSize,
      particlesRef,
      globalDpr,
      currentTextIndex,
    });
  }, [texts, font, color, alignment, wrapperSize, currentTextIndex, globalDpr]);
  
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setWrapperSize({ width, height });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <SeoElement tag={tag} texts={texts} />
    </div>
  );
}

// Helper Functions (createParticles, updateParticles, etc.) from your code go here...
// NOTE: I've included all the necessary helpers below.

const SeoElement = memo(({ tag = Tag.P, texts }: { tag: Tag, texts: string[] }) => {
  const style = useMemo(() => ({
    position: "absolute" as const,
    width: "0",
    height: "0",
    overflow: "hidden",
    userSelect: "none" as const,
    pointerEvents: "none" as const,
  }), []);

  const safeTag = Object.values(Tag).includes(tag) ? tag : "p";
  return createElement(safeTag, { style }, texts?.join(" ") ?? "");
});

const renderCanvas = ({
  framerProps,
  canvasRef,
  wrapperSize,
  particlesRef,
  globalDpr,
  currentTextIndex,
}: {
  framerProps: Pick<VaporizeTextCycleProps, 'texts' | 'font' | 'color' | 'alignment'>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  wrapperSize: { width: number; height: number };
  particlesRef: React.MutableRefObject<Particle[]>;
  globalDpr: number;
  currentTextIndex: number;
}) => {
  const canvas = canvasRef.current;
  if (!canvas || !wrapperSize.width || !wrapperSize.height) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = wrapperSize;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.floor(width * globalDpr);
  canvas.height = Math.floor(height * globalDpr);

  const fontSize = parseInt(framerProps.font?.fontSize?.replace("px", "") || "50");
  const font = `${framerProps.font?.fontWeight ?? 400} ${fontSize * globalDpr}px ${framerProps.font?.fontFamily ?? "sans-serif"}`;
  const color = parseColor(framerProps.color ?? "rgb(153, 153, 153)");

  let textX;
  const textY = canvas.height / 2;
  const currentText = framerProps.texts?.[currentTextIndex] || "";

  if (framerProps.alignment === "center") textX = canvas.width / 2;
  else if (framerProps.alignment === "left") textX = 0;
  else textX = canvas.width;

  const { particles, textBoundaries } = createParticles(ctx, canvas, currentText, textX, textY, font, color, framerProps.alignment || "left");
  particlesRef.current = particles;
  canvas.textBoundaries = textBoundaries;
};

const createParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string, textX: number, textY: number, font: string, color: string, alignment: "left" | "center" | "right") => {
    const particles: Particle[] = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = alignment;
    ctx.textBaseline = "middle";
    const metrics = ctx.measureText(text);
    let textLeft;
    const textWidth = metrics.width;
    if (alignment === "center") textLeft = textX - textWidth / 2;
    else if (alignment === "left") textLeft = textX;
    else textLeft = textX - textWidth;
    const textBoundaries = { left: textLeft, right: textLeft + textWidth, width: textWidth };
    ctx.fillText(text, textX, textY);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const currentDPR = canvas.width / parseInt(canvas.style.width);
    const sampleRate = Math.max(1, Math.round(currentDPR / 3));

    for (let y = 0; y < canvas.height; y += sampleRate) {
        for (let x = 0; x < canvas.width; x += sampleRate) {
            const index = (y * canvas.width + x) * 4;
            const alpha = data[index + 3];
            if (alpha > 0) {
                const originalAlpha = alpha / 255 * (sampleRate / currentDPR);
                particles.push({
                    x, y, originalX: x, originalY: y,
                    color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${originalAlpha})`,
                    opacity: originalAlpha, originalAlpha,
                    velocityX: 0, velocityY: 0, angle: 0, speed: 0,
                });
            }
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return { particles, textBoundaries };
};

const updateParticles = (particles: Particle[], vaporizeX: number, deltaTime: number, MULTIPLIED_VAPORIZE_SPREAD: number, VAPORIZE_DURATION: number, direction: string, density: number) => {
    let allParticlesVaporized = true;
    particles.forEach(particle => {
        const shouldVaporize = direction === "left-to-right" ? particle.originalX <= vaporizeX : particle.originalX >= vaporizeX;
        if (shouldVaporize) {
            if (particle.speed === 0) {
                particle.angle = Math.random() * Math.PI * 2;
                particle.speed = (Math.random() * 1 + 0.5) * MULTIPLIED_VAPORIZE_SPREAD;
                particle.velocityX = Math.cos(particle.angle) * particle.speed;
                particle.velocityY = Math.sin(particle.angle) * particle.speed;
                particle.shouldFadeQuickly = Math.random() > density;
            }
            if (particle.shouldFadeQuickly) {
                particle.opacity = Math.max(0, particle.opacity - deltaTime * 2);
            } else {
                particle.x += particle.velocityX * deltaTime * 20;
                particle.y += particle.velocityY * deltaTime * 10;
                const baseFadeRate = 0.25;
                const durationBasedFadeRate = baseFadeRate * (2000 / VAPORIZE_DURATION);
                particle.opacity = Math.max(0, particle.opacity - deltaTime * durationBasedFadeRate);
            }
            if (particle.opacity > 0.01) allParticlesVaporized = false;
        } else {
            allParticlesVaporized = false;
        }
    });
    return allParticlesVaporized;
};

const renderParticles = (ctx: CanvasRenderingContext2D, particles: Particle[], globalDpr: number) => {
    ctx.save();
    ctx.scale(globalDpr, globalDpr);
    particles.forEach(particle => {
        if (particle.opacity > 0) {
            const color = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`);
            ctx.fillStyle = color;
            ctx.fillRect(particle.x / globalDpr, particle.y / globalDpr, 1, 1);
        }
    });
    ctx.restore();
};

const resetParticles = (particles: Particle[]) => {
    particles.forEach(p => {
        p.x = p.originalX;
        p.y = p.originalY;
        p.opacity = p.originalAlpha;
        p.speed = 0;
        p.velocityX = 0;
        p.velocityY = 0;
    });
};

const calculateVaporizeSpread = (fontSize: number) => {
    const size = typeof fontSize === "string" ? parseInt(fontSize) : fontSize;
    const points = [{ size: 20, spread: 0.2 }, { size: 50, spread: 0.5 }, { size: 100, spread: 1.5 }];
    if (size <= points[0].size) return points[0].spread;
    if (size >= points[points.length - 1].size) return points[points.length - 1].spread;
    let i = 0;
    while (i < points.length - 1 && points[i + 1].size < size) i++;
    const p1 = points[i], p2 = points[i + 1];
    return p1.spread + (size - p1.size) * (p2.spread - p1.spread) / (p2.size - p1.size);
};

const parseColor = (color: string) => {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 1)`;
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaMatch) return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${rgbaMatch[4]})`;
    return "rgba(255, 255, 255, 1)";
};

function transformValue(input: number, inputRange: number[], outputRange: number[], clamp = false): number {
    const [inputMin, inputMax] = inputRange;
    const [outputMin, outputMax] = outputRange;
    const progress = (input - inputMin) / (inputMax - inputMin);
    let result = outputMin + progress * (outputMax - outputMin);
    if (clamp) {
        const [min, max] = outputMax > outputMin ? [outputMin, outputMax] : [outputMax, outputMin];
        result = Math.max(min, Math.min(max, result));
    }
    return result;
}

function useIsInView(ref: React.RefObject<HTMLElement>) {
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { rootMargin: '50px' });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);
    return isInView;
}