import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import type { IssueDetail } from "@/lib/opnbase-reveal-content";
import { motion, type Variants } from "framer-motion";

interface RedditCardProps {
  issue: IssueDetail;
}

export default function RedditCard({ issue }: RedditCardProps) {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      filter: "blur(8px)",
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-neutral-800/60 backdrop-blur-lg border border-neutral-700/70 rounded-xl p-4 sm:p-6 shadow-2xl w-full max-w-2xl text-left text-neutral-50"
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={
              issue.avatarUrl ||
              "https://i.pinimg.com/474x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg"
            }
            alt={issue.username}
            width={36}
            height={36}
            className="rounded-full shrink-0"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-neutral-100 truncate">
                {issue.group}
              </span>
              <span className="text-neutral-400 truncate">{issue.date}</span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 block truncate">
              {issue.username}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {issue.tag && (
            <span
              className={`px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
                issue.tag.colorScheme || "bg-neutral-700 text-neutral-300"
              } whitespace-nowrap`}
            >
              {issue.tag.text}
            </span>
          )}
          <button className="text-neutral-400 p-1.5 rounded-full transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-neutral-50 mb-2">
        {issue.heading}
      </h2>

      <div className="relative max-h-40 overflow-hidden sm:max-h-none sm:overflow-visible mb-5">
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          {issue.description}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-800 to-transparent sm:hidden pointer-events-none" />
      </div>

      <div className="flex items-center justify-between text-neutral-400">
        <div className="flex items-center bg-neutral-700/50 rounded-full p-1.5 pr-2.5 gap-1">
          <button className="p-1 rounded-full text-orange-400">
            <ArrowBigUp size={18} />
          </button>
          <span className="text-sm font-medium text-neutral-200 blur-[2px] select-none mx-1">
            {issue.upvotes}
          </span>
          <button className="p-1 rounded-full text-neutral-400">
            <ArrowBigDown size={18} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-700/50 rounded-full px-3 py-1.5">
          <MessageCircle size={16} className="text-neutral-300" />
          <span className="text-sm font-medium text-neutral-200 blur-[2px] select-none">
            {issue.comments}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
