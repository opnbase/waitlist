import { motion } from "framer-motion"
import {
  MoreHorizontal,
  ThumbsUp,
  Rocket,
  Eye,
  Plus, 
} from "lucide-react"

interface GithubCommentProps {
  comment: {
    id: string
    username: string
    avatarUrl: string
    date: string
    content: string
    reactions: {
      thumbsUp: number
      rocket: number
      eyes: number
    }
  }
}

export default function GithubIssueComment({ comment }: GithubCommentProps) {
  return (
    <motion.div
      variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
        },
      },
      }}
      initial="hidden"
      animate="visible"
      className="bg-[#0d1117] border border-neutral-700 rounded-md p-4 w-3/4 text-neutral-300 shadow-md mb-4"
    >
      <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      className="flex items-center justify-between mb-3"
      >
      <div className="flex items-center gap-3">
        <img
        src={comment.avatarUrl || "/placeholder.svg"}
        alt={`${comment.username}'s avatar`}
        width={32}
        height={32}
        className="rounded-full"
        />
        <div>
        <span className="font-semibold text-neutral-100 mr-1">
          {comment.username}
        </span>
        <span className="text-[13px] text-neutral-400">
          commented on {comment.date}
        </span>
        </div>
      </div>
      <button className="text-neutral-400  p-1.5 rounded-md ">
        <MoreHorizontal size={18} />
      </button>
      </motion.div>

      <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      className="prose text-left prose-sm prose-invert max-w-none text-neutral-200 leading-relaxed mb-4"
      >
      {comment.content}
      </motion.div>

      <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      className="flex items-center gap-2 text-sm text-neutral-400"
      >
      {/* Reactions */}
      <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-full px-2 py-1">
        <button className="flex items-center gap-1 text-yellow-300  rounded-full px-2 py-1 -ml-2">
        <ThumbsUp size={16} />
        <span>{comment.reactions.thumbsUp}</span>
        </button>
        <button className="flex items-center gap-1 text-neutral-300  rounded-full px-2 py-1">
        <Rocket size={16} />
        <span>{comment.reactions.rocket}</span>
        </button>
        {comment.reactions.eyes > 0 && (
        <button className="flex items-center gap-1 text-neutral-300  rounded-full px-2 py-1 -mr-2">
          <Eye size={16} />
          <span>{comment.reactions.eyes}</span>
        </button>
        )}
      </div>

      <button className="flex items-center gap-1 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full ">
        <Plus size={16} />
      </button>
      </motion.div>
    </motion.div>
  )
}
