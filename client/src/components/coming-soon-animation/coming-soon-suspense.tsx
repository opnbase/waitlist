import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import FullscreenRevealContent from "./fullscreen-reveal-content"; // New import

interface ComingSoonSuspenseProps {
  imageUrl: string;
  altText?: string;
}

const ComingSoonSuspense: React.FC<ComingSoonSuspenseProps> = ({
  imageUrl,
  altText,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showBlackOverlay, setShowBlackOverlay] = useState(false);
  const [viewCount] = useState(
    Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000
  ); 

  const handleOpenFullScreen = () => {
    setIsFullScreen(true);
    setTimeout(() => {
      setShowBlackOverlay(true);
    }, 300); 
  };

  const handleCloseFullScreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShowBlackOverlay(false); 
    setIsFullScreen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        handleCloseFullScreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  return (
    <>
      {!isFullScreen && (
        <motion.div
          layoutId={`reveal-card-${imageUrl}`}
          onClick={handleOpenFullScreen}
          className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl backdrop-blur-md flex items-center justify-center group cursor-pointer overflow-hidden "
          role="button"
          aria-label="See more (coming soon)"
          tabIndex={0}
        >
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={altText || "Coming Soon"}
            className="absolute  inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out "
          />
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white/20 rounded-full shadow-lg group-hover:bg-white/30 transition-all duration-300 ease-in-out transform group-hover:scale-110 z-10">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            layoutId={`reveal-card-${imageUrl}`}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
            initial={{ borderRadius: "0.75rem" }}
            animate={{ borderRadius: "0rem" }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
            onClick={() => handleCloseFullScreen()}
          >
            <motion.div
              className="w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence>
                {showBlackOverlay && (
                  <motion.div
                    key="black-overlay-content"
                    className="absolute inset-0 bg-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <FullscreenRevealContent
                      onClose={handleCloseFullScreen}
                      viewCount={viewCount}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseFullScreen();
                }}
                className="absolute top-5 right-5 z-[60] p-2 bg-white/10 text-white rounded-full hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { delay: 0.5 } }}
              >
                <X className="w-7 h-7" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ComingSoonSuspense;
