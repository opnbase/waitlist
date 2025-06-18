import type React from "react";

import {
  MoreHorizontal,
  CheckSquare,
  Square,
  Bell,
  Settings2,
  ChevronDown,
  Tag,
} from "lucide-react";
import type { IssueDetail } from "@/lib/opnbase-reveal-content";
import { motion, type Variants } from "framer-motion";

interface GithubIssueCardProps {
  issue: IssueDetail;
}

const SidebarSection: React.FC<{
  title: string;
  children?: React.ReactNode;
  defaultText?: string;
}> = ({ title, children, defaultText }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <h4 className="text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">
        {title}
      </h4>{" "}
      {title === "Notifications" && (
        <button className="text-xs text-blue-400">Customize</button>
      )}
      {title === "Labels" && (
        <button className="text-xs text-blue-400">
          <Tag size={12} className="inline-block mr-1 -mt-0.5" />
          See all
        </button>
      )}
    </div>
    {children || (
      <p className="text-xs text-start text-neutral-500">
        {defaultText || `No ${title.toLowerCase()}`}
      </p>
    )}
    <hr className="border-neutral-700 mt-3" />
  </div>
);

const CONSISTENT_AVATAR_SM_URL =
  "https://avatars.githubusercontent.com/u/1234567?v=4&s=24";

export default function GithubIssueCard({ issue }: GithubIssueCardProps) {
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

  const ghData = issue.githubData;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-[#0d1117] border border-neutral-700 rounded-lg shadow-2xl w-full max-w-4xl text-neutral-300 flex overflow-hidden"
      style={{ minHeight: "70vh" }}
    >
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={"https://avatars.githubusercontent.com/u/123456789?v=4&s=24"}
              alt={`${issue.username}'s avatar`}
              width={36}
              height={36}
              className="rounded-full"
            />
            <div>
              <span className="font-semibold text-neutral-100 mr-1">
                {issue.username}
              </span>{" "}
              <span className="text-[13px] text-neutral-400">
                {" "}
                opened this issue on {issue.date} · {issue.comments || 0}{" "}
                comments
              </span>
            </div>
          </div>
          <button className="text-neutral-400 p-1.5 rounded-md ">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <h2 className="text-3xl text-start  font-bold text-neutral-50 mb-6">
          {issue.heading}
        </h2>

        <div className="relative max-h-[350px] overflow-hidden">
          {" "}
          {ghData?.checklist && ghData.checklist.length > 0 && (
            <ul className="space-y-2 mb-6 border-b  border-neutral-700 pb-6">
              {ghData.checklist.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-sm">
                  {item.checked ? (
                    <CheckSquare
                      size={18}
                      className="text-purple-400 mt-0.5 shrink-0"
                    />
                  ) : (
                    <Square
                      size={18}
                      className="text-neutral-500 mt-0.5 shrink-0"
                    />
                  )}
                  <span
                    className="item-start"
                    dangerouslySetInnerHTML={{
                      __html: item.text.replace(
                        /\[([^\]]+)\]\(([^)]+)\)/g,
                        (text, url) =>
                          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 ">${text}</a>`
                      ),
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
          {ghData?.sections?.map((section) => (
            <div
              key={section.id}
              className="mb-6 prose text-left prose-sm prose-invert max-w-none"
            >
              <div className="flex item-start">
                <h3 className="text-xl  font-semibold text-neutral-100 mb-2">
                  {section.title}
                </h3>
              </div>
              <div className="flex item-start">
                <p className="text-neutral-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />{" "}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 bg-[#161b22] border-l border-neutral-700 p-5 space-y-4 shrink-0 overflow-y-auto">
        {" "}
        <SidebarSection title="Assignees">
          {ghData?.assignees && ghData.assignees.length > 0 ? (
            ghData.assignees.map((assignee) => (
              <div
                key={assignee.username}
                className="flex items-center gap-2 text-xs mb-1"
              >
                <img
                  src={assignee.avatarUrl || "/placeholder.svg"}
                  alt={assignee.username}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>{assignee.username}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-start text-neutral-500">
              No one assigned
            </p>
          )}
        </SidebarSection>
        <SidebarSection title="Labels">
          {ghData?.labels && ghData.labels.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {" "}
              {ghData.labels.map((label) => (
                <span
                  key={label.id}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full inline-block ${label.color}`}
                >
                  {label.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-start text-neutral-500">None yet</p>
          )}
        </SidebarSection>
        <SidebarSection title="Projects" defaultText="No projects" />
        <SidebarSection title="Milestone" defaultText="No milestone" />
        <SidebarSection
          title="Development"
          defaultText="No branches or pull requests"
        >
          <button className="w-full mt-1 flex items-center justify-center gap-2 text-xs bg-neutral-700  text-neutral-200 px-3 py-1.5 rounded-md">
            <Settings2 size={14} /> Code with Copilot Agent Mode{" "}
            <ChevronDown size={14} />
          </button>
        </SidebarSection>
        <SidebarSection title="Notifications">
          <button className="w-full flex items-center justify-center gap-2 text-xs bg-neutral-700  text-neutral-200 px-3 py-1.5 rounded-md">
            <Bell size={14} /> Subscribe
          </button>
          <p className="text-xs text-neutral-500 mt-1.5 text-center">
            You’re not receiving notifications from this thread.
          </p>
        </SidebarSection>
        <SidebarSection title="Participants">
          <div className="flex items-center gap-1">
            {[
              CONSISTENT_AVATAR_SM_URL,
              CONSISTENT_AVATAR_SM_URL,
              CONSISTENT_AVATAR_SM_URL,
            ]
              .slice(
                0,
                issue.githubData?.assignees?.length ||
                  1 + (issue.comments || 0 > 5 ? 1 : 0)
              )
              .map((p_avatar, idx) => (
                <img
                  key={idx}
                  src={p_avatar || "/placeholder.svg"}
                  alt={`participant ${idx + 1}`}
                  width={24}
                  height={24}
                  className="rounded-full border-2 border-[#0d1117]"
                />
              ))}
          </div>
        </SidebarSection>
      </div>
    </motion.div>
  );
}
