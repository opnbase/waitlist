import type React from "react";
import { useState } from "react";

import {
  MoreHorizontal,
  CheckSquare,
  Square,
  Bell,
  Settings2,
  ChevronDown,
  Tag,
  Menu,
  X,
} from "lucide-react";
import type { IssueDetail } from "@/lib/opnbase-reveal-content";
import { motion, type Variants, AnimatePresence } from "framer-motion";

interface GithubIssueCardProps {
  issue: IssueDetail;
}

// Reusable sidebar section component
const SidebarSection: React.FC<{
  title: string;
  children?: React.ReactNode;
  defaultText?: string;
  isMobile?: boolean;
}> = ({ title, children, defaultText, isMobile = false }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1.5">
      <h4
        className={`font-semibold text-neutral-400 uppercase tracking-wider ${
          isMobile ? "text-[10px]" : "text-[12px]"
        }`}
      >
        {title}
      </h4>
      {title === "Notifications" && (
        <button
          className={`text-blue-400 ${isMobile ? "text-[10px]" : "text-xs"}`}
        >
          Customize
        </button>
      )}
      {title === "Labels" && (
        <button
          className={`text-blue-400 ${isMobile ? "text-[10px]" : "text-xs"}`}
        >
          <Tag
            size={isMobile ? 10 : 12}
            className="inline-block mr-1 -mt-0.5"
          />
          See all
        </button>
      )}
    </div>
    {children || (
      <p
        className={`text-start text-neutral-500 ${
          isMobile ? "text-[10px]" : "text-xs"
        }`}
      >
        {defaultText || `No ${title.toLowerCase()}`}
      </p>
    )}
    <hr className="border-neutral-700 mt-3" />
  </div>
);

const CONSISTENT_AVATAR_SM_URL =
  "https://avatars.githubusercontent.com/u/1234567?v=4&s=24";

export default function GithubIssueCard({ issue }: GithubIssueCardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Animation variants for card entrance
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

  // Animation variants for sidebar slide-in
  const sidebarVariants: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const ghData = issue.githubData;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-[#0d1117] border border-neutral-700 rounded-lg shadow-2xl w-full max-w-4xl text-neutral-300 flex overflow-hidden relative"
      style={{ minHeight: "70vh" }}
    >
      {/* Main content area */}
      <div className="flex-grow p-3 sm:p-4 lg:p-6 overflow-y-auto">
        {/* Header with user info and controls */}
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
            <img
              src={"https://avatars.githubusercontent.com/u/123456789?v=4&s=24"}
              alt={`${issue.username}'s avatar`}
              width={24}
              height={24}
              className="rounded-full lg:w-9 lg:h-9 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-neutral-100 mr-1 text-sm lg:text-base">
                {issue.username}
              </span>
              <span className="text-[11px] lg:text-[13px] text-neutral-400 block sm:inline">
                opened this issue on {issue.date} · {issue.comments || 0}{" "}
                comments
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile menu toggle */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-neutral-400 p-1.5 rounded-md hover:bg-neutral-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            {/* Desktop more options */}
            <button className="text-neutral-400 p-1.5 rounded-md hidden lg:block">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Issue title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl text-start font-bold text-neutral-50 mb-4 lg:mb-6 leading-tight">
          {issue.heading}
        </h2>

        {/* Issue content with better mobile height handling */}
        <div className="relative max-h-[350px] sm:max-h-[400px] md:max-h-[450px] lg:max-h-[350px] overflow-hidden">
          {" "}
          {/* Checklist items */}
          {ghData?.checklist && ghData.checklist.length > 0 && (
            <ul className="space-y-1.5 lg:space-y-2 mb-4 lg:mb-6 border-b border-neutral-700 pb-4 lg:pb-6">
              {ghData.checklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 text-xs lg:text-sm"
                >
                  {item.checked ? (
                    <CheckSquare
                      size={16}
                      className="text-purple-400 mt-0.5 shrink-0 lg:w-[18px] lg:h-[18px]"
                    />
                  ) : (
                    <Square
                      size={16}
                      className="text-neutral-500 mt-0.5 shrink-0 lg:w-[18px] lg:h-[18px]"
                    />
                  )}
                  <span
                    className="item-start text-left"
                    dangerouslySetInnerHTML={{
                      __html: item.text.replace(
                        /\[([^\]]+)\]\(([^)]+)\)/g,
                        (text, url) =>
                          `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400">${text}</a>`
                      ),
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
          {/* Content sections */}
          {ghData?.sections?.map((section) => (
            <div
              key={section.id}
              className="mb-4 lg:mb-6 prose text-left prose-sm prose-invert max-w-none"
            >
              <div className="flex item-start">
                <h3 className="text-lg lg:text-xl font-semibold text-neutral-100 mb-2">
                  {section.title}
                </h3>
              </div>
              <div className="flex item-start">
                <p className="text-neutral-300 leading-relaxed text-sm lg:text-base">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
          {/* Subtle fade gradient - reduced height for better mobile experience */}
          <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-4 lg:h-16 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />{" "}
        </div>
      </div>

      {/* Desktop sidebar - always visible on large screens */}
      <div className="hidden lg:block w-72 bg-[#161b22] border-l border-neutral-700 p-5 space-y-4 shrink-0 overflow-y-auto">
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
          <button className="w-full mt-1 flex items-center justify-center gap-2 text-xs bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-md">
            <Settings2 size={14} /> Code with Copilot Agent Mode{" "}
            <ChevronDown size={14} />
          </button>
        </SidebarSection>
        <SidebarSection title="Notifications">
          <button className="w-full flex items-center justify-center gap-2 text-xs bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-md">
            <Bell size={14} /> Subscribe
          </button>
          <p className="text-xs text-neutral-500 mt-1.5 text-center">
            You're not receiving notifications from this thread.
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

      {/* Mobile sidebar - slides within card container */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 right-0 h-full w-80 max-w-[85%] bg-[#161b22] border-l border-neutral-700 p-4 space-y-3 overflow-y-auto lg:hidden z-10"
          >
            {/* Mobile sidebar header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-700">
              <h3 className="text-sm font-semibold text-neutral-100">
                Issue Details
              </h3>
              <button
                onClick={toggleSidebar}
                className="text-neutral-400 p-1 rounded-md hover:bg-neutral-700 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile sidebar sections */}
            <SidebarSection title="Assignees" isMobile>
              {ghData?.assignees && ghData.assignees.length > 0 ? (
                ghData.assignees.map((assignee) => (
                  <div
                    key={assignee.username}
                    className="flex items-center gap-2 text-[10px] mb-1"
                  >
                    <img
                      src={assignee.avatarUrl || "/placeholder.svg"}
                      alt={assignee.username}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                    <span>{assignee.username}</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-start text-neutral-500">
                  No one assigned
                </p>
              )}
            </SidebarSection>

            <SidebarSection title="Labels" isMobile>
              {ghData?.labels && ghData.labels.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {ghData.labels.map((label) => (
                    <span
                      key={label.id}
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full inline-block ${label.color}`}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-start text-neutral-500">
                  None yet
                </p>
              )}
            </SidebarSection>

            <SidebarSection
              title="Projects"
              defaultText="No projects"
              isMobile
            />
            <SidebarSection
              title="Milestone"
              defaultText="No milestone"
              isMobile
            />

            <SidebarSection
              title="Development"
              defaultText="No branches or pull requests"
              isMobile
            >
              <button className="w-full mt-1 flex items-center justify-center gap-1.5 text-[10px] bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-md">
                <Settings2 size={12} /> Code with Copilot Agent Mode{" "}
                <ChevronDown size={12} />
              </button>
            </SidebarSection>

            <SidebarSection title="Notifications" isMobile>
              <button className="w-full flex items-center justify-center gap-1.5 text-[10px] bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-md">
                <Bell size={12} /> Subscribe
              </button>
              <p className="text-[10px] text-neutral-500 mt-1.5 text-center">
                You're not receiving notifications from this thread.
              </p>
            </SidebarSection>

            <SidebarSection title="Participants" isMobile>
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
                      width={20}
                      height={20}
                      className="rounded-full border-2 border-[#0d1117]"
                    />
                  ))}
              </div>
            </SidebarSection>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
