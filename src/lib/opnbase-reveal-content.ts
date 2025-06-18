// @/lib/opnbase-reveal-content.ts

export interface GithubChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  link?: string; // Optional link within checklist text
}

export interface GithubSection {
  id: string;
  title: string;
  content: string;
}

export interface GithubLabel {
  id: string;
  name: string;
  color: string; // e.g., 'bg-red-500 text-white' or a hex code for inline style
}

export interface GithubComment {
  id: string;
  username: string;
  avatarUrl: string;
  date: string;
  content: string;
  reactions: {
    thumbsUp: number;
    rocket: number;
    eyes: number;
    // Add other reactions as needed
  };
}

export interface GithubIssueSpecificData {
  titlePrefix?: string; // e.g., "Bug report"
  checklist?: GithubChecklistItem[];
  sections?: GithubSection[];
  assignees?: { avatarUrl: string; username: string }[];
  labels?: GithubLabel[];
  project?: string;
  milestone?: string;
}

export interface StackOverflowQuestionData {
  // NEW INTERFACE for Stack Overflow
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
}

export interface IssueDetail {
  id: string;
  social: "reddit" | "github" | "github-comment" | "stackoverflow"; // Added 'stackoverflow'
  username: string;
  avatarUrl: string;
  date: string;
  tag?: { text: string; colorScheme?: string }; // Primarily for Reddit card
  heading: string; // Main title/heading of the issue/post (used for reddit/github)
  description: string; // Main description or initial comment (used for reddit)
  link?: string;
  upvotes?: number | string; // Reddit specific
  downvotes?: number | string; // Reddit specific
  comments?: number | string; // Reddit specific / GitHub comments count
  githubData?: GithubIssueSpecificData; // Data specific to GitHub issues
  commentData?: GithubComment; // For standalone GitHub comments
  stackoverflowData?: StackOverflowQuestionData; // NEW: For Stack Overflow questions
}

const CONSISTENT_AVATAR_URL =
  "https://i.pinimg.com/474x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg";
const CONSISTENT_AVATAR_SM_URL =
  "https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_640.png";

export const revealIssues: IssueDetail[] = [
  {
    id: "issue1",
    social: "reddit",
    username: "SupaSorter",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "3 months ago",
    tag: { text: "Self-Host", colorScheme: "bg-orange-500/20 text-orange-300" },
    heading:
      "Why can I only run one project per instance on self-hosted Supabase?",
    description:
      "Users find it restrictive that a single self-hosted Supabase instance is tied to one project, limiting scalability for multiple applications.",
    link: "#",
    upvotes: "127",
    downvotes: "3",
    comments: "42",
  },
  {
    id: "gh-issue1",
    social: "github",
    link: "https://github.com/supabase/supabase/issues/12963#issue-1620208386",
    username: "cristian-milea",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Mar 12, 2023",
    heading: "Need Better documentation on self hosted setup",
    description: "",
    githubData: {
      titlePrefix: "Bug report",
      checklist: [
        {
          id: "c1",
          text: "I confirm this is a bug with Supabase, not with my own application.",
          checked: true,
        },
        {
          id: "c2",
          text: "I confirm I have searched the Docs, GitHub Discussions, and Discord.",
          checked: true,
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Describe the bug",
          content:
            "I don't think they are bugs, because some people got it working, but the information is so minimal, that's almost impossible to succeed by yourself.",
        },
        {
          id: "s2",
          title: "To Reproduce",
          content: ` 
        Steps to reproduce the behavior, please provide code snippets or a repository:
        - Go to supabase
        - Try to follow the instructions
        - Battle the Lords of Hell, jump over all the problems, fail, repeat, fail again
        - See all kinds of errors in all supabase created containers
        - Watch your beautiful supabase studio doing nothing, feel sad, write an issue on GitHub
          `,
        },
      ],
      labels: [
        {
          id: "l1",
          name: "bug",
          color: "bg-red-200 text-red-800 border border-red-400",
        },
      ],
      assignees: [],
    },
    comments: "12",
  },
  {
    id: "gh-comment-1",
    social: "github-comment",
    username: "anasfik",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Dec 23, 2023",
    link: "https://github.com/supabase/supabase/issues/19949#issuecomment-1868341516",
    heading: "",
    description: "",
    commentData: {
      id: "comment1",
      username: "anasfik",
      avatarUrl: CONSISTENT_AVATAR_URL,
      date: "Dec 23, 2023",
      content: `I was in the same situation in May of this year, it was just a disappointment to see the self-hosted version of Supabase comparing it to their cloud version, especially for a project that claims the "open source Firebase alternative", I did open many issues like this without any single response that makes sense.

Even today, the same thing is still happening, Supabase is an FIrebase alternative, not an open-source one, both keep their main features private and none of them is 100% open-source, Self-hosted Supabase is meant for testing or development, not for production.

My advice is if you need a Baas without a strong need for SQL or relations in databases, self-host Appwrite. if you want to use something non-stable but working (as I know and tried), self-host Pocket Base. if you want to use some cloud-based Baas, consider Supabase if you need Postgres in your database, otherwise just stick with Firebase.

`,
      reactions: {
        thumbsUp: 2,
        rocket: 6,
        eyes: 0,
      },
    },
  },
  {
    id: "so-question-1",
    social: "stackoverflow",
    username: "Jhonatan Lituma",
    link: "https://stackoverflow.com/questions/77212052/supabase-dashboard-error-self-hosting-failed-to-create-user-user-not-allowe",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Oct 1, 2023 at 19:41",
    heading:
      "Supabase Dashboard error (self-hosting): 'Failed to create user: User not allowed' , when i try to create a new user",
    description: "",
    stackoverflowData: {
      title: `Supabase Dashboard error (self-hosting): "Failed to create user: User not allowed" , when i try to create a new user`,
      askedDate: "1 year, 8 months ago",
      modifiedDate: "1 year, 8 months ago",
      viewCount: 836,
      upvotes: 1,
      content: `When I try to create a new user I receive the following error , does anyone know why it happens ? I'm new to supabase and don't have much experience . In the .env file , the only relevant thing that I modified was the password of POSGREST_PASSWORD , JWT_SECRET , ANON_KEY and SERVICE_ROLE_KEY following the supabase documentation . I also tried restarting the docker service to see if it was some supabase error but it didn't work either .`,
      tags: ["supabase", "supabase-js", "supabase-py"],
      author: {
        username: "Jhonatan Lituma",
        avatarUrl: CONSISTENT_AVATAR_SM_URL, // Smaller avatar for author section
        reputation: 11,
      },
      comments: [],
    },
  },
  {
    id: "issue3",
    social: "reddit",
    username: "DockerTroubles",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "1 month ago",
    tag: { text: "Stability", colorScheme: "bg-red-500/20 text-red-300" },
    heading: "Supabase Studio is buggy or unreliable in Docker.",
    description:
      "Developers report encountering bugs and reliability issues with Supabase Studio when running it within Docker containers for self-hosting.",
    link: "#",
    upvotes: "150",
    downvotes: "5",
    comments: "68",
  },
  {
    id: "gh-issue2",
    social: "github",
    username: "anotherdev",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Jan 10, 2024",
    heading: "Feature Request: Enhanced logging for self-hosted instances",
    description:
      "It would be incredibly helpful to have more granular and accessible logging capabilities directly within the self-hosted Supabase dashboard.",
    githubData: {
      titlePrefix: "Feature Request",
      sections: [
        {
          id: "s1",
          title: "Problem Statement",
          content:
            "Currently, debugging issues or monitoring performance on self-hosted instances requires significant manual effort due to limited built-in logging visibility.",
        },
        {
          id: "s2",
          title: "Proposed Solution",
          content:
            "Integrate a logging interface similar to what's available in the cloud version, allowing users to view, filter, and search logs for various services (PostgREST, GoTrue, Realtime, etc.).",
        },
      ],
      labels: [
        {
          id: "l1",
          name: "enhancement",
          color: "bg-blue-200 text-blue-800 border border-blue-400",
        },
        {
          id: "l2",
          name: "logging",
          color: "bg-gray-200 text-gray-800 border border-gray-400",
        },
      ],
      assignees: [
        { avatarUrl: CONSISTENT_AVATAR_SM_URL, username: "core-team-member" },
      ],
    },
    comments: "8",
  },
];

export const finalRevealLines: string[] = [
  "Presenting Opnbase.",
  "It is the Postgres development platform. The Supabase alternative, but actually open source.",
  "Coming with all the features Supabase has—and many more, free and open for everyone.",
];
