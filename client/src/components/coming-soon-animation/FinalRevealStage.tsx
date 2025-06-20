import { useState, useEffect, useCallback } from "react";
import { VaporizeText, Tag } from "./vaporize-text";
import { motion, type Variants } from "framer-motion";
import OpnbaseParticles from "./opnbase-particles";

const particleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function FinalRevealStage() {
  const [showMain, setShowMain] = useState(false);
  const [presentSize, setPresentSize] = useState(72);

  const syncSizes = useCallback(() => {
    const w = innerWidth;
    setPresentSize(
      w < 380 ? 28 : w < 640 ? 34 : w < 768 ? 44 : w < 1024 ? 56 : 72
    );
  }, []);

  useEffect(() => {
    syncSizes();
    addEventListener("resize", syncSizes);
    return () => removeEventListener("resize", syncSizes);
  }, [syncSizes]);

  return (
    <div className="relative bg-black min-h-screen w-screen flex items-center justify-center text-white overflow-hidden px-4 sm:px-8 md:px-12">
      {!showMain ? (
        <VaporizeText
          text="Presenting"
          onComplete={() => setShowMain(true)}
          font={{
            fontFamily: "Inter, sans-serif",
            fontSize: `${presentSize}px`,
            fontWeight: 600,
          }}
          color="rgb(255,255,255)"
          spread={5}
          density={5}
          animation={{ vaporizeDuration: 1.5 }}
          alignment="center"
          tag={Tag.H1}
        />
      ) : (
        <motion.div
          className="relative w-full flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={particleVariants}
        >
          <OpnbaseParticles  />
        </motion.div>
      )}
    </div>
  );
}
