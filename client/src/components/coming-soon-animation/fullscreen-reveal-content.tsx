import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Eye, LinkIcon as LinkIconLucide } from "lucide-react"

import RedditCard from "./reddit-card"
import GithubIssueCard from "./github-issue-card"
import GithubIssueComment from "./github-issue-comments"
import StackOverflowQuestionCard from "./stackoverflow-question-card"
import { finalRevealLines, revealIssues, type IssueDetail } from "@/lib/opnbase-reveal-content"

interface FullscreenRevealContentProps {
  onClose: () => void 
  viewCount: number // View count to display
}

const ISSUE_DISPLAY_DURATION = 4000 // 4 seconds

export default function FullscreenRevealContent({ onClose, viewCount }: FullscreenRevealContentProps) {
  const [currentStage, setCurrentStage] = useState<"issue" | "finalReveal">("issue")
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true) // State for play/pause

  const currentIssue: IssueDetail | undefined = useMemo(() => revealIssues[currentIssueIndex], [currentIssueIndex])

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined

    if (isPlaying && currentStage === "issue" && currentIssueIndex < revealIssues.length) {
      timerId = setTimeout(() => {
        if (currentIssueIndex < revealIssues.length - 1) {
          setCurrentIssueIndex((prev) => prev + 1)
        } else {
          setCurrentStage("finalReveal")
          setIsPlaying(false); // Pause when final reveal is reached
        }
      }, ISSUE_DISPLAY_DURATION)
    }

    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [currentStage, currentIssueIndex, isPlaying])

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M"
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K"
    }
    return count.toString()
  }

  const finalRevealFontConfig = useMemo(
    () => ({
      fontFamily: "Inter, sans-serif",
      fontSize: "clamp(32px, 5vw, 48px)",
      fontWeight: 700,
    }),
    [],
  )
  const finalRevealSubFontConfig = useMemo(
    () => ({
      fontFamily: "Inter, sans-serif",
      fontSize: "clamp(18px, 3vw, 24px)",
      fontWeight: 400,
    }),
    [],
  )

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStage === "issue" && currentIssue && (
          <motion.div
            key={`${currentIssue.social}-${currentIssue.id}`} // Ensure key changes for different card types too
            className="w-full flex justify-center items-center" // Added items-center
          >
            {currentIssue.social === "reddit" && <RedditCard issue={currentIssue} />}
            {currentIssue.social === "github" && <GithubIssueCard issue={currentIssue} />}
            {/* Render GithubIssueComment for the 'github-comment' social type */}
            {currentIssue.social === "github-comment" && currentIssue.commentData && (
              <GithubIssueComment comment={currentIssue.commentData} />
            )}
            {/* Pass currentIssue.stackoverflowData to StackOverflowQuestionCard */}
            {currentIssue.social === "stackoverflow" && currentIssue.stackoverflowData && (
              <StackOverflowQuestionCard question={currentIssue.stackoverflowData} />
            )}
          </motion.div>
        )}

        {currentStage === "finalReveal" && (
          <motion.div
            key="final-reveal-stage"
            className="flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 style={{ ...finalRevealFontConfig, color: "rgb(255, 255, 255)" }} className="mb-2 text-white">
              {finalRevealLines[0]}
            </h1>
            <p
              style={{ ...finalRevealSubFontConfig, color: "rgb(200, 200, 200)" }}
              className="max-w-3xl text-neutral-300 leading-relaxed"
            >
              {finalRevealLines[1]}
            </p>
            <p
              style={{ ...finalRevealSubFontConfig, color: "rgb(200, 200, 200)" }}
              className="max-w-3xl text-neutral-300 leading-relaxed"
            >
              {finalRevealLines[2]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify Button - bottom center */}
      {currentStage === "issue" && currentIssue?.link && (
        <motion.a
          href={currentIssue.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-5 z-[60] px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-white/25 transition-colors"
          aria-label="Verify link"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }}
          exit={{ y: 20, opacity: 0 }}
        >
          <LinkIconLucide size={16} />
          <span>Verify</span>
        </motion.a>
      )}

      {/* Play/Pause Button - bottom right */}
      <motion.button
        onClick={togglePlayPause}
        className="absolute bottom-5 right-5 z-[60] p-2 bg-white/10 text-white rounded-full hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label={isPlaying ? "Pause" : "Play"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.7 } }} // Delay to appear after expansion
      >
        {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
      </motion.button>

      {/* View Count - bottom left */}
      <motion.div
        className="absolute bottom-5 left-5 z-[60] px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold flex items-center gap-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.7 } }} // Delay to appear after expansion
      >
        <Eye className="w-5 h-5" />
        <span>{formatViewCount(viewCount)} Views</span>
      </motion.div>
    </div>
  )
}