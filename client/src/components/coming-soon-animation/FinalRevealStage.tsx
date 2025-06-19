"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VaporizeTextCycle, { Tag } from "./vaporize-text-cycle";

const finalRevealLines = [
  "The future of database management is here",
  "Build, scale, and deploy with confidence using our next-generation platform"
];

export default function FinalRevealStage() {
  const [showMain, setShowMain] = useState(false);

  const handleVaporizeComplete = useCallback(() => {
    setShowMain(true);
  }, []);

  return (
    <div className="bg-black h-screen w-screen flex flex-col items-center justify-center text-white">
      <AnimatePresence mode="wait">
        {!showMain ? (
          <motion.div
            key="vaporize"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <VaporizeTextCycle
              texts={["Presenting"]}
              cycleDuration={5}
              onComplete={handleVaporizeComplete} 
              font={{
                fontFamily: "Inter, sans-serif",
                fontSize: "70px",
                fontWeight: 600
              }}
              color="rgb(255,255, 255)"
              spread={5}
              density={5}
              animation={{
                vaporizeDuration: 1.5,
                fadeInDuration: 0.5,
                waitDuration: 0.2
              }}
              direction="left-to-right"
              alignment="center"
              tag={Tag.H1}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <h1 className="text-7xl font-extrabold mb-4">Opnbase</h1>
            {finalRevealLines.map((line, i) => (
              <p
                key={i}
                className="max-w-4xl leading-relaxed text-neutral-300 text-xl"
              >
                {line}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}