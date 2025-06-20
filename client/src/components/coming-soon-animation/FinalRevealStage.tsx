"use client";

import { useState, useCallback, useEffect } from "react";
import { VaporizeText, Tag } from "./vaporize-text";
import { motion, type Variants } from "framer-motion";
import { finalRevealLines } from "@/lib/opnbase-reveal-content";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeInOut", duration: 0.6 },
  },
};

export default function FinalRevealStage() {
  const [showMain, setShowMain] = useState(false);
  const [presentFontSize, setPresentFontSize] = useState(70);

  const resizeFont = useCallback(() => {
    const w = window.innerWidth;
    if (w < 380) setPresentFontSize(28);
    else if (w < 640) setPresentFontSize(34);
    else if (w < 768) setPresentFontSize(44);
    else if (w < 1024) setPresentFontSize(56);
    else setPresentFontSize(70);
  }, []);

  useEffect(() => {
    resizeFont();
    window.addEventListener("resize", resizeFont);
    return () => window.removeEventListener("resize", resizeFont);
  }, [resizeFont]);

  const handleVaporizeComplete = useCallback(() => setShowMain(true), []);

  return (
    <div className="bg-black min-h-screen w-screen flex flex-col items-center justify-center text-white relative px-4 sm:px-8 md:px-12">
      {!showMain ? (
        <div className="flex items-center justify-center w-full h-full">
          <VaporizeText
            text="Presenting"
            onComplete={handleVaporizeComplete}
            font={{
              fontFamily: "Inter, sans-serif",
              fontSize: `${presentFontSize}px`,
              fontWeight: 600,
            }}
            color="rgb(255,255,255)"
            spread={5}
            density={5}
            animation={{ vaporizeDuration: 1.5 }}
            alignment="center"
            tag={Tag.H1}
          />
        </div>
      ) : (
        <motion.div
          className="flex flex-col items-center gap-6 text-center w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
            variants={itemVariants}
          >
            Opnbase
          </motion.h1>
          {finalRevealLines.map((line, i) => (
            <motion.p
              key={i}
              className="max-w-4xl leading-relaxed text-neutral-300 text-base sm:text-lg md:text-xl"
              variants={itemVariants}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      )}
    </div>
  );
}
