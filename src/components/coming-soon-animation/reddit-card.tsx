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
      className="bg-neutral-800/60 backdrop-blur-lg border border-neutral-700/70 rounded-xl p-5 sm:p-6 shadow-2xl w-full max-w-2xl text-left text-neutral-50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={
              issue.avatarUrl ||
              "https://i.pinimg.com/474x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg"
            }
            alt={`${issue.username}'s avatar`}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <span className="text-sm font-semibold text-neutral-100">
              {issue.username}
            </span>
            <span className="text-xs text-neutral-400 block">{issue.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {issue.tag && (
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                issue.tag.colorScheme || "bg-neutral-700 text-neutral-300"
              }`}
            >
              {issue.tag.text}
            </span>
          )}
          <button className="text-neutral-400  p-1.5 rounded-full  transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-neutral-50 mb-2.5">
        {issue.heading}
      </h2>
      <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
        {issue.description}
      </p>

      <div className="flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-700/50 rounded-full p-1.5 pr-2.5">
            <button className="p-1 bg-neutral-600/50 rounded-full transition-colors  text-green-800">
              <ArrowBigUp size={20} />
            </button>
            <span className="text-sm font-medium text-neutral-200 filter blur-[2px] select-none mx-1.5">
              {issue.upvotes}
            </span>
            <button className="p-1  rounded-full transition-colors text-neutral-400">
              <ArrowBigDown size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-700/50 rounded-full px-3 py-1.5">
            <MessageCircle size={18} className="text-neutral-300" />
            <span className="text-sm font-medium text-neutral-200 filter blur-[2px] select-none">
              {issue.comments}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
