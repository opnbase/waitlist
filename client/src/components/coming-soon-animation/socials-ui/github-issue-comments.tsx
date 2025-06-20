import {
  MoreHorizontal,
  ThumbsUp,
  Rocket,
  Eye,
  Plus,
  Smile,
} from "lucide-react";

interface GithubCommentProps {
  comment: {
    id: string;
    username: string;
    avatarUrl: string;
    date: string;
    content: string;
    reactions: {
      thumbsUp: number;
      rocket: number;
      eyes: number;
    };
  };
}

function GithubIssueComment({ comment }: GithubCommentProps) {
  return (
    <div className="bg-[#0d1117] border border-neutral-700 rounded-lg w-full max-w-4xl text-neutral-300 shadow-lg mb-4 overflow-hidden">
      <div className="bg-[#161b22] border-b border-neutral-700 px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <img
              src={comment.avatarUrl || "https://avatars.githubusercontent.com/u/123456?v=4&s=32"}
              alt={`${comment.username}'s avatar`}
              className="rounded-full w-6 h-6 sm:w-8 sm:h-8 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-neutral-100 text-sm sm:text-base">
                {comment.username}
              </span>
              <span className="text-xs sm:text-sm text-neutral-400 block sm:inline sm:ml-2">
                commented on {comment.date}
              </span>
            </div>
          </div>
          <button className="text-neutral-400 p-1 sm:p-1.5 rounded-md transition-colors shrink-0">
            <MoreHorizontal size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
        <div className="relative max-h-64 overflow-hidden lg:max-h-none lg:overflow-visible">
          <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-neutral-200 leading-relaxed">
            <p className="text-sm sm:text-base text-left mb-0">
              {comment.content}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0d1117] to-transparent lg:hidden pointer-events-none" />
        </div>
      </div>

      <div className="border-t border-neutral-700 px-3 py-2 sm:px-4 sm:py-3 bg-[#0d1117]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {comment.reactions.thumbsUp > 0 && (
              <button className="flex items-center gap-1 bg-blue-900/30 border border-blue-700/50 text-blue-300 rounded-full px-2 py-1 text-xs sm:text-sm  transition-transform">
                <ThumbsUp size={12} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{comment.reactions.thumbsUp}</span>
              </button>
            )}
            {comment.reactions.rocket > 0 && (
              <button className="flex items-center gap-1 bg-neutral-700/50 border border-neutral-600 text-neutral-300 rounded-full px-2 py-1 text-xs sm:text-sm  transition-transform">
                <Rocket size={12} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{comment.reactions.rocket}</span>
              </button>
            )}
            {comment.reactions.eyes > 0 && (
              <button className="flex items-center gap-1 bg-neutral-700/50 border border-neutral-600 text-neutral-300 rounded-full px-2 py-1 text-xs sm:text-sm  transition-transform">
                <Eye size={12} className="sm:w-4 sm:h-4" />
                <span className="font-medium">{comment.reactions.eyes}</span>
              </button>
            )}
          </div>
          <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-transparent border border-neutral-600 rounded-full text-neutral-400  transition-all duration-200 text-xs sm:text-sm shrink-0">
            <Smile size={12} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline font-medium">React</span>
            <Plus size={10} className="sm:w-3 sm:h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GithubIssueComment;
