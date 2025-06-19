import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Eye, LinkIcon as LinkIconLucide } from "lucide-react";

import RedditCard from "./socials-ui/reddit-card";
import GithubIssueCard from "./socials-ui/github-issue-card";
import GithubIssueComment from "./socials-ui/github-issue-comments";
import StackOverflowQuestionCard from "./socials-ui/stackoverflow-question-card";
import { revealIssues, type IssueDetail } from "@/lib/opnbase-reveal-content";
import FinalRevealStage from "./FinalRevealStage";

interface FullscreenRevealContentProps {
  onClose: () => void;
  viewCount: number;
}

const ISSUE_DISPLAY_DURATION = 4000;

export default function FullscreenRevealContent({
  viewCount,
}: FullscreenRevealContentProps) {
  const [currentStage, setCurrentStage] = useState<"issue" | "finalReveal">("issue");
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const startTimeRef = useRef<number>(0);
  const elapsedTimeOnPauseRef = useRef<number>(0);

  const currentIssue: IssueDetail | undefined = useMemo(
    () => revealIssues[currentIssueIndex],
    [currentIssueIndex]
  );

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    let progressIntervalId: NodeJS.Timeout | undefined;

    const startProgressTracking = () => {
      startTimeRef.current = Date.now() - elapsedTimeOnPauseRef.current;
      progressIntervalId = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = (elapsed / ISSUE_DISPLAY_DURATION) * 100;
        setProgress(Math.min(newProgress, 100));
      }, 50);
    };

    if (
      isPlaying &&
      currentStage === "issue" &&
      currentIssueIndex < revealIssues.length
    ) {
      if (elapsedTimeOnPauseRef.current === 0) {
        setProgress(0);
      }
      startProgressTracking();

      const remainingDuration =
        ISSUE_DISPLAY_DURATION - elapsedTimeOnPauseRef.current;

      timerId = setTimeout(() => {
        elapsedTimeOnPauseRef.current = 0;
        if (currentIssueIndex < revealIssues.length - 1) {
          setCurrentIssueIndex((prev) => prev + 1);
        } else {
          setCurrentStage("finalReveal");
          setIsPlaying(false);
        }
      }, remainingDuration);
    } else {
      if (progressIntervalId) clearInterval(progressIntervalId);
      if (timerId) clearTimeout(timerId);
      if (currentStage === "issue") {
        elapsedTimeOnPauseRef.current = Date.now() - startTimeRef.current;
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (progressIntervalId) clearInterval(progressIntervalId);
    };
  }, [currentStage, currentIssueIndex, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStage === "issue" && currentIssue && (
          <motion.div
            key={`${currentIssue.social}-${currentIssue.id}`}
            className="w-full flex justify-center items-center"
          >
            {currentIssue.social === "reddit" && (
              <RedditCard issue={currentIssue} />
            )}
            {currentIssue.social === "github" && (
              <GithubIssueCard issue={currentIssue} />
            )}
            {currentIssue.social === "github-comment" &&
              currentIssue.commentData && (
                <GithubIssueComment comment={currentIssue.commentData} />
              )}
            {currentIssue.social === "stackoverflow" &&
              currentIssue.stackoverflowData && (
                <StackOverflowQuestionCard
                  question={{
                    ...currentIssue.stackoverflowData,
                    id: currentIssue.id,
                  }}
                />
              )}
          </motion.div>
        )}
        {currentStage === "finalReveal" && <FinalRevealStage />}
      </AnimatePresence>

      {currentStage === "issue" && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-4">
          {revealIssues.map((_, index) => (
            <motion.div
              key={index}
              className="relative w-4 h-4 flex items-center justify-center group cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: index === currentIssueIndex ? 8 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: index * 0.1,
              }}
              whileHover={{ scale: 1.2 }}
            >
              <div
                className={`absolute w-full h-full rounded-full backdrop-blur-sm border transition-all duration-300 ${
                  index === currentIssueIndex
                    ? "bg-white/20 border-white/40 shadow-lg shadow-white/20"
                    : index < currentIssueIndex
                    ? "bg-blue-400/30 border-blue-400/50 shadow-md shadow-blue-400/20"
                    : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
                }`}
              />
              {index === currentIssueIndex && (
                <svg
                  className="absolute w-6 h-6 -rotate-90"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 9}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 9 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 9 * (1 - progress / 100),
                    }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </svg>
              )}
              <div
                className={`relative w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIssueIndex
                    ? "bg-white shadow-sm"
                    : index < currentIssueIndex
                    ? "bg-blue-400 shadow-sm"
                    : "bg-white/50 group-hover:bg-white/70"
                }`}
              />
              {index < currentIssueIndex && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <svg
                    className="w-3 h-3 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
              {index === currentIssueIndex &&
                isPlaying && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
            </motion.div>
          ))}
        </div>
      )}

      {currentStage === "issue" && currentIssue?.link && (
        <div className="absolute bottom-5 z-[60] flex items-center gap-3">
          <motion.a
            href={currentIssue.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/25 transition-colors"
            aria-label="Verify link"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }}
            exit={{ y: 20, opacity: 0 }}
          >
            <LinkIconLucide size={16} />
            <span>Verify</span>
          </motion.a>

          <motion.button
            onClick={() => setCurrentStage("finalReveal")}
            className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/25 transition-colors"
            aria-label="Skip to final reveal"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }}
            exit={{ y: 20, opacity: 0 }}
          >
            Skip
          </motion.button>
        </div>
      )}

      <motion.button
        onClick={togglePlayPause}
        className="absolute bottom-5 right-5 z-[60] p-2 bg-white/10 text-white rounded-full hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={isPlaying ? "Pause" : "Play"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.7 } }}
      >
        {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
      </motion.button>

      <motion.div
        className="absolute bottom-5 left-5 z-[60] px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold flex items-center gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }}
      >
        <Eye className="w-5 h-5" />
        <span>{formatViewCount(viewCount)} Views</span>
      </motion.div>
    </div>
  );
}
