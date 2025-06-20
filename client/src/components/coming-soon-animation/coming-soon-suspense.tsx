import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import FullscreenRevealContent from "./fullscreen-reveal-content";
import { getFingerPrint } from "@/lib/device-fingerprint";
import { api } from "@/lib/api-client";
import { trackEvent } from "@/lib/analytics";

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
  const [viewCount, setViewCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await api.viewCount();
      if (res.status === 200) setViewCount(res.data.views);
    } catch (e) {
      console.error(e);
    }
  };

  const recordView = async () => {
    try {
      const fp = await getFingerPrint();
      if (fp.fingerprint_hash) {
        await api.viewPresenting(fp.fingerprint_hash);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openFull = () => {
    setIsFullScreen(true);
    recordView();
    fetchCount();
    /* ─── Google Analytics custom‐event ─── */
    trackEvent("coming_soon_video_opened", {
      page: window.location.pathname,
      component: "ComingSoonSuspense",
    });
    setTimeout(() => setShowBlackOverlay(true), 300);
  };

  const closeFull = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowBlackOverlay(false);
    setIsFullScreen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) closeFull();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullScreen]);

  return (
    <>
      {!isFullScreen && (
        <motion.div
          layoutId={`reveal-card-${imageUrl}`}
          onClick={openFull}
          role="button"
          aria-label="See more (coming soon)"
          tabIndex={0}
          initial={{ borderRadius: "0.75rem" }}
          animate={{ borderRadius: "0.75rem" }}
          className="
            relative w-full
            h-[200px]    /* xs */
            sm:h-[300px] /* sm+ */
            md:h-[400px] /* md+ */
            bg-gradient-to-br from-white/10 to-white/5
            rounded-xl backdrop-blur-md
            flex items-center justify-center
            group cursor-pointer overflow-hidden
          "
        >
          <img
            src={imageUrl}
            alt={altText || "Coming Soon"}
            loading="eager"
            draggable="false"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/50" />
          <div
            className="
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              p-4 bg-white/20 rounded-full shadow-lg
              group-hover:bg-white/30 transition-all duration-300 ease-in-out
              transform group-hover:scale-110 z-10
            "
          >
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
            exit={{ borderRadius: "0.75rem" }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
            onClick={closeFull}
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
                      onClose={closeFull}
                      viewCount={viewCount}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFull();
                }}
                className="
                  absolute top-5 right-5 z-[60]
                  p-2 bg-white/10 text-white rounded-full
                  hover:bg-white/25 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-white/50
                "
                aria-label="Close"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 0.5 },
                }}
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
