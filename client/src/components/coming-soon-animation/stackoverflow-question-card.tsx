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
      className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl w-full max-w-5xl text-neutral-200 flex flex-col md:flex-row overflow-hidden"
      style={{ minHeight: "70vh" }}
    >
      <div className="flex-shrink-0 bg-neutral-800 border-r border-neutral-700 p-4 flex flex-col items-center justify-start gap-2">
        <button className="text-neutral-400 p-1" aria-label="Upvote">
          <ArrowBigUp size={24} />
        </button>
        <span className="text-xl font-bold text-white blur-sm">
          {question.upvotes}
        </span>
        <button className="text-neutral-400 p-1" aria-label="Downvote">
          <ArrowBigDown size={24} />
        </button>
        <button className="text-neutral-400 p-1 mt-4" aria-label="Bookmark">
          <Bookmark size={20} />
        </button>
        <button className="text-neutral-400 p-1" aria-label="View history">
          <History size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex  items-start text-left mb-4">
          <h1 className="text-2xl font-bold text-white  ">{question.title}</h1>
        </div>

        <div className="text-xs text-neutral-400 mb-6 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar size={14} aria-label="Asked date" /> Asked{" "}
            {question.askedDate}
          </span>
          <span className="flex items-center gap-1">
            <Code size={14} aria-label="Modified date" /> Modified{" "}
            {question.modifiedDate}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} aria-label="View count" /> Viewed{" "}
            {question.viewCount} times
          </span>
        </div>

        <hr className="border-neutral-700 mb-6" />

        <div className="text-left text-neutral-200 leading-relaxed mb-6">
          <p>
            When I try to create a new user I receive the following error , does
            anyone know why it happens ? I'm new to supabase and don't have much
            experience .
          </p>
          <br />

          <a
            className="text-blue-400 underline "
            href="https://i.sstatic.net/xOcKp.png"
          >
            supabase dashboard error
          </a>

          <p className="mt-6">
            In the .env file, the only relevant thing that I modified was the
            password of POSGREST_PASSWORD, JWT_SECRET, ANON_KEY and
            SERVICE_ROLE_KEY following the supabase documentation. I also tried
            restarting the docker service to see if it was some supabase error
            but it didn't work either.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {(question.tags || []).map((tag, index) => (
            <span
              key={index}
              className="bg-blue-900/40 text-blue-300 text-xs px-2.5 py-1 rounded-md "
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-neutral-400 mb-6">
          <div className="flex items-center gap-4">
            <button className="">Share</button>
            <button className="">Improve this question</button>
            <button className="">Follow</button>
          </div>
          <div className="text-right">
            <p className="mb-1">asked {question.askedDate}</p>
            <div className="flex items-center justify-end gap-2">
              <img
                src={question.author.avatarUrl || "/placeholder.svg"}
                alt={`Avatar of ${question.author.username}`}
                width={24}
                height={24}
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

        <hr className="border-neutral-700 mb-4" />

        {question.comments && question.comments.length > 0 && (
          <div className="space-y-4">
            {question.comments.map((comment) => (
              <div
                key={comment.id}
                className="text-sm border-b border-neutral-800 pb-2"
              >
                <p className="text-neutral-300 mb-1">{comment.content}</p>
                <p className="text-neutral-500 text-xs">
                  — {comment.username} {comment.date}
                </p>
              </div>
            ))}
          </div>
        )}
        <button className="text-blue-400 text-sm mt-4 ">Add a comment</button>
      </div>

      {/* Right Sidebar (Blog and Meta) */}
      <div className="flex-shrink-0 w-80 text-left bg-neutral-800 border-l border-neutral-700 p-5 space-y-6 overflow-y-auto">
        <div className="text-sm">
          <h3 className="text-white font-semibold mb-3">The Overflow Blog</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-400 ">
                "We're not worried about compute anymore": The future of AI
                models
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400 ">
                After 30 years, Java is still brewing up new features
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <h3 className="text-white font-semibold mb-3">Featured on Meta</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-400 ">
                Thoughts on the future of Stack Exchange site customisation
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400  ">
                Community Asks Sprint Announcement - June 2025
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400  ">
                How can I revert the style/layout changes to comments?
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400 ">
                Policy: Generative AI (e.g. ChatGPT) is banned
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-400 ">
                2025 Community Moderator Election Results
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
