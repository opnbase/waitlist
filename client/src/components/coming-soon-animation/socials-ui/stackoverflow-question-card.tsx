import { motion, type Variants } from "framer-motion";
import {
  ArrowBigUp,
  ArrowBigDown,
  Bookmark,
  History,
  Eye,
  Calendar,
  Code,
} from "lucide-react";

interface StackOverflowQuestionCardProps {
  question: {
    id: string;
    title: string;
    askedDate: string;
    modifiedDate: string;
    viewCount: number;
    upvotes: number;
    content: string;
    tags: string[];
    author: {
      username: string;
      avatarUrl: string;
      reputation: number;
    };
    comments?: {
      id: string;
      username: string;
      avatarUrl: string;
      content: string;
      date: string;
    }[];
  };
}

export default function StackOverflowQuestionCard({
  question,
}: StackOverflowQuestionCardProps) {
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
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl w-full max-w-5xl text-neutral-200 flex flex-col lg:flex-row overflow-hidden"
    >
      <div className="order-2 lg:order-1 flex-shrink-0 bg-neutral-800 border-t lg:border-t-0 lg:border-r border-neutral-700 p-3 lg:p-4 flex flex-row lg:flex-col items-center justify-start gap-2">
        <button className="text-neutral-400 p-1" aria-label="Upvote">
          <ArrowBigUp size={24} />
        </button>
        <span className="text-lg lg:text-xl font-bold text-white blur-sm">
          {question.upvotes}
        </span>
        <button className="text-neutral-400 p-1" aria-label="Downvote">
          <ArrowBigDown size={24} />
        </button>
        <div className="flex lg:flex-col gap-2 lg:gap-0 ml-auto lg:ml-0">
          <button className="text-neutral-400 p-1" aria-label="Bookmark">
            <Bookmark size={20} />
          </button>
          <button className="text-neutral-400 p-1" aria-label="View history">
            <History size={20} />
          </button>
        </div>
      </div>

      <div className="order-1 lg:order-2 flex-grow p-4 md:p-6 overflow-y-auto">
        <h1 className="text-lg md:text-2xl font-bold text-white leading-snug mb-3 md:mb-4">
          {question.title}
        </h1>

        <div className="text-[10px] sm:text-xs text-neutral-400 mb-5 flex flex-wrap gap-2">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {question.askedDate}
          </span>
          <span className="flex items-center gap-1">
            <Code size={12} /> {question.modifiedDate}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {question.viewCount}
          </span>
        </div>

        <hr className="border-neutral-700 mb-5" />

        <div className="relative max-h-52 overflow-hidden lg:max-h-none lg:overflow-visible mb-5">
          <div className="text-left text-neutral-200 leading-relaxed space-y-4 text-sm md:text-base">
            <p>{question.content}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900 to-transparent lg:hidden pointer-events-none" />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {question.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-900/40 text-blue-300 text-[10px] px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="hidden md:flex flex-wrap justify-between items-start gap-4 text-[10px] sm:text-xs text-neutral-400 mb-5">
          <div className="flex gap-3">
            <button>Share</button>
            <button>Improve</button>
            <button>Follow</button>
          </div>
          <div className="text-right">
            <p className="mb-1">asked {question.askedDate}</p>
            <div className="flex items-center justify-end gap-2">
              <img
                src={question.author.avatarUrl || "/placeholder.svg"}
                alt={question.author.username}
                width={20}
                height={20}
                className="rounded-sm"
              />
              <div>
                <p className="text-blue-400 font-medium">
                  {question.author.username}
                </p>
                <p className="text-neutral-300">{question.author.reputation}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="hidden md:block border-neutral-700 mb-4" />

        {question.comments && question.comments.length > 0 && (
          <div className="space-y-4">
            {question.comments.map((c) => (
              <div
                key={c.id}
                className="text-[11px] sm:text-sm border-b border-neutral-800 pb-2"
              >
                <p className="text-neutral-300 mb-1">{c.content}</p>
                <p className="text-neutral-500">
                  — {c.username} {c.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:order-3 lg:block lg:flex-shrink-0 lg:w-80 lg:bg-neutral-800 lg:border-l lg:border-neutral-700 lg:p-5 lg:space-y-6 lg:overflow-y-auto">
        <div className="text-sm">
          <h3 className="text-white font-semibold mb-3">The Overflow Blog</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-400">
                "We're not worried about compute anymore": The future of AI
                models
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400">
                After 30 years, Java is still brewing up new features
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <h3 className="text-white font-semibold mb-3">Featured on Meta</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-400">
                Thoughts on the future of Stack Exchange site customisation
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400">
                Community Asks Sprint Announcement - June 2025
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400">
                How can I revert the style/layout changes to comments?
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400">
                Policy: Generative AI (e.g. ChatGPT) is banned
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400">
                2025 Community Moderator Election Results
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
