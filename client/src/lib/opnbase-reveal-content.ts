export interface GithubChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  link?: string; 
}

export interface GithubSection {
  id: string;
  title?: string;
  content: string;
}

export interface GithubLabel {
  id: string;
  name: string;
  color: string; 
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
   
  };
}

export interface GithubIssueSpecificData {
  titlePrefix?: string; 
  checklist?: GithubChecklistItem[];
  sections?: GithubSection[];
  assignees?: { avatarUrl: string; username: string }[];
  labels?: GithubLabel[];
  project?: string;
  milestone?: string;
}

export interface StackOverflowQuestionData {
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
  social: "reddit" | "github" | "github-comment" | "stackoverflow"; 
  username: string;
  group?: string;
  avatarUrl: string;
  date: string;
  tag?: { text: string; colorScheme?: string }; 
  heading: string; 
  description: string; 
  link?: string;
  upvotes?: number | string; 
  downvotes?: number | string; 
  comments?: number | string; 
  githubData?: GithubIssueSpecificData;
  commentData?: GithubComment; 
  stackoverflowData?: StackOverflowQuestionData; 
}

const CONSISTENT_AVATAR_URL =
  "https://i.pinimg.com/474x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg";
const CONSISTENT_AVATAR_SM_URL =
  "https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_640.png";

export const revealIssues: IssueDetail[] = [
  {
    id: "gh-issue1",
    social: "github",
    link: "https://github.com/supabase/supabase/issues/12963#issue-1620208386",
    username: "cristian-milea",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Mar 12, 2023",
    heading: "Better documentation on self hosted setup",
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
        avatarUrl: CONSISTENT_AVATAR_SM_URL, 
        reputation: 11,
      },
      comments: [],
    },
  },
  {
    id: "issue3",
    social: "reddit",
    group: "r/Supabase",
    username: "ericmathison",
    link : "https://www.reddit.com/r/Supabase/comments/1idhwhl/anyone_able_to_get_the_self_hosted_version",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "5 month ago",
    tag: { text: "storage", colorScheme: "bg-red-500/20 text-red-300" },
    heading: "Anyone able to get the self hosted version running properly?",
    description: `Hey everyone, I've been struggling to get the self hosted version of Supabase to work properly. I am running it inside docker swarm using the docker compose example they provide in github as reference. I've been able to get everything to work (as far as I'm aware) except for the storage portion. To my understanding you can connect to your s3 provider, which I've configured the env variables. But in the dashboard, it doesn't seem to connect to look for the bucket. Also when trying to upload anything, Studio is firing off a ton of Cors violations. To add to this, when I click on Configuration -> Settings, it just redirects me to the home page. Under network console log, it simply says cancelled... 
    I honestly don't know what is going on. Any help is appreciated.`,
    upvotes: "13",
    downvotes: "5",
    comments: "6",
  },
  {
    id: "gh-issue4",
    social: "github",
    link: "https://github.com/orgs/supabase/discussions/20111#discussion-6022564",
    username: "nokia6290",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Jan 1, 2024",
    heading: "Self-hosting not working properly",
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
          content: "Hi all,",
        },
        {
          id: "s2",
          content: "Trying to self-host supabase.",
        },
        {
          id: "s3",
          content:
            "Tutorials, videos, official documentation is really challenging and sometimes nonexistant ...",
        },
        {
          id: "s4",
          content:
            "However. Got it eventually running ( supabase, edited production env files with secrets and all. Launched successfully studio login on digital ocean Ec2 instance. (2cpu, 4gb ram, enough ssd). Built a mini website on flutter and trying to fetch some basic data (no auth, and no security on them added so the API call is publicly available.). Built a simple table on public scheme..made a query that fetches all my data that I want.",
        },
      ],
      labels: [
        {
          id: "l1",
          name: "bug",
          color: "bg-red-200 text-red-800 border border-red-400",
        },
      ],
      assignees: [{ avatarUrl: CONSISTENT_AVATAR_SM_URL, username: "General" }],
    },
    comments: "5",
  },
  {
    id: "gh-issue5",
    social: "github",
    link: "https://github.com/supabase/supabase/issues/19949#issue-2052865202",
    username: "miguelgargallo",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Dec 21, 2023",
    heading: "2024 | Lack of Essential Features in Supabase Open-Source Version: SSL and Multi-Project Management",
    description: "",
    githubData: {
      titlePrefix: "Bug report",
      checklist: [
        {
          id: "c1",
          text: `I love supabase but I feel disappointed ¿How I supose to use this "open source" project on production at home servers?`,
          checked: true,
        },
        {
          id: "c2",
          text: "Supabase closed hundreds of times this kind of issues but never really solve it.",
          checked: true,
        },
        {
          id: "c3",
          text: "I confirm this is a bug with Supabase, not with my own application.",
          checked: true,
        },
        {
          id: "c4",
          text: "I confirm I have searched the Docs, GitHub Discussions, and Discord.",
          checked: true,
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Introduction",
          content: "My admiration for Supabase and its community is profound. This community, known for its dedication to creating guides and supporting features, has made Supabase more accessible and versatile. However, this approach raises concerns about the accessibility of key features to all users. Essential features should be natively supported in the core platform, ensuring an inclusive and user-friendly experience for everyone.",
        },
        {
          id: "s2",
          title: "The Concerning Trend",
          content: "There's a worrying trend in treating Supabase as a ready-for-production open-source solution, based solely on the official guides. This approach is somewhat disingenuous and could be perceived as an insult to the community. Open-source projects should be transparent about their capabilities and limitations, especially in production environments.",
        },
       
        {
          id: "s3",
          title: "Unsound Practices",
          content: "The deliberate exclusion of crucial features like domain SSL and multi-project management in the open-source version, pushing users towards the paid cloud variant, is an unsound practice. This contradicts the ethos of open-source software, which centers on inclusivity and community support.",
        },
       
      ],
      labels: [
        {
          id: "l1",
          name: "bug",
          color: "bg-red-200 text-red-800 border border-red-400",
        },
      ],
      assignees: [{ avatarUrl: CONSISTENT_AVATAR_SM_URL, username: "General" }],
    },
    comments: "3",
  },
  {
    id: "gh-issue6",
    social: "github",
    link: "https://github.com/orgs/supabase/discussions/12954",
    username: "anasfik",
    avatarUrl: CONSISTENT_AVATAR_URL,
    date: "Dec 11, 2023",
    heading: "General Informations exchanges for self hosted version of Supabase",
    description: "",
    githubData: {
      titlePrefix: "Bug report",
      checklist: [],
      sections: [
        {
          id: "s1",
          content: "Hello, I discovered Supabase a while, the cloud service is just great and unique. However, working with the self-hosted version let to a lot of confusing such as regarding the existence of features, settings, different databases, and authentication behaviors that I love to discuss here.",
        },
        {
          id: "s2",
          content: "",
        },
      ],
      labels: [],
      assignees: [],
    },
    comments: "4",
    upvotes: "4"
  },
];

export const finalRevealLines: string[] = [
  "Presenting Opnbase.",
  "It is the Postgres development platform. The Supabase alternative, but actually open source.",
  "Coming with all the features Supabase has, and many more, free and open for everyone.",
];
