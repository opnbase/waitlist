import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface ComingSoonSuspenseProps {
  imageUrl: string;
  altText?: string;
}

export const ComingSoonSuspense: React.FC<ComingSoonSuspenseProps> = ({
  imageUrl,
  altText,
}) => {
  return (
    <>
      <motion.div
        layoutId={`reveal-card-${imageUrl}`}
        className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl backdrop-blur-md flex items-center justify-center group cursor-pointer overflow-hidden"
        role="button"
        aria-label="See more (coming soon)"
        tabIndex={0}
      >
        <img // Keep simple img here, motion.img is in the fullscreen version for transition
          src={imageUrl || "/placeholder.svg"}
          alt={altText || "Coming Soon"}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-90"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white/20 rounded-full shadow-lg group-hover:bg-white/30 transition-all duration-300 ease-in-out transform group-hover:scale-110 z-10">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </motion.div>
    </>
  );
};
