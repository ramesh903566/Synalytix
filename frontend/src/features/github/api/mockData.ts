export const GITHUB_PROFILE_MOCK = {
  login: "ramesh903566",
  name: "Ramesh Kumar",
  avatarUrl: "https://i.pravatar.cc/150?u=gh_ramesh",
  bio: "Senior Staff Engineer @ Synalytix | Product Designer | Open Source Advocate",
  company: "@Synalytix",
  website: "https://ramesh.dev",
  location: "San Francisco, CA",
  email: "hello@ramesh.dev",
  createdAt: "2015-06-10T14:00:00Z",
  followers: { totalCount: 1420 },
  following: { totalCount: 45 },
  repositories: { totalCount: 84 },
  gists: { totalCount: 12 },
  isHireable: false,
  organizations: {
    nodes: [
      { name: "Synalytix", avatarUrl: "https://github.com/synalytix.png" },
      { name: "OpenSourceContribs", avatarUrl: "https://github.com/opensource.png" }
    ]
  },
  scores: {
    completion: 98,
    developer: 94,
    trust: 99,
    activityLevel: 88,
    openSource: 92
  }
};

export const GITHUB_CONTRIBUTIONS_MOCK = {
  totalContributions: 2145,
  streak: { current: 14, longest: 64 },
  activeDay: "Tuesday",
  activeMonth: "October",
  averagePerDay: 5.8,
  calendar: Array.from({ length: 365 }).map((_, i) => ({
    date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 15),
    level: Math.floor(Math.random() * 5)
  }))
};

export const GITHUB_ACTIVITY_MOCK = {
  commits: { count: 1245, percentage: 58, delta: "+12%" },
  prs: { count: 430, percentage: 20, delta: "+5%" },
  issues: { count: 150, percentage: 7, delta: "-2%" },
  reviews: { count: 280, percentage: 13, delta: "+18%" },
  discussions: { count: 40, percentage: 2, delta: "0%" }
};

export const GITHUB_REPOS_MOCK = [
  {
    name: "synalytix-core",
    description: "Core analytics engine for cross-platform metrics.",
    stargazerCount: 1400,
    forkCount: 230,
    primaryLanguage: { name: "TypeScript", color: "#3178c6" },
    updatedAt: "2026-07-20T10:00:00Z",
    issues: 12,
    watchers: 45,
    size: 2048,
    healthScore: 98,
    activityScore: 95,
    licenseInfo: { name: "MIT" },
    topics: ["analytics", "react", "dashboard"]
  },
  {
    name: "react-animations",
    description: "Framer motion utility components for modern web apps.",
    stargazerCount: 3500,
    forkCount: 410,
    primaryLanguage: { name: "TypeScript", color: "#3178c6" },
    updatedAt: "2026-07-25T10:00:00Z",
    issues: 24,
    watchers: 89,
    size: 1024,
    healthScore: 92,
    activityScore: 88,
    licenseInfo: { name: "MIT" },
    topics: ["react", "framer-motion", "animation"]
  },
  {
    name: "go-microservices",
    description: "A boilerplate for scalable Go backend services.",
    stargazerCount: 890,
    forkCount: 120,
    primaryLanguage: { name: "Go", color: "#00ADD8" },
    updatedAt: "2026-06-15T10:00:00Z",
    issues: 5,
    watchers: 30,
    size: 5120,
    healthScore: 85,
    activityScore: 70,
    licenseInfo: { name: "Apache-2.0" },
    topics: ["go", "backend", "microservices"]
  }
];

export const GITHUB_LANGUAGES_MOCK = [
  { name: "TypeScript", bytes: 1542000, color: "#3178c6" },
  { name: "JavaScript", bytes: 840000, color: "#f1e05a" },
  { name: "Go", bytes: 420000, color: "#00ADD8" },
  { name: "Python", bytes: 210000, color: "#3572A5" },
  { name: "Rust", bytes: 105000, color: "#dea584" }
];

export const GITHUB_TIMELINE_MOCK = [
  { id: 1, type: "PushEvent", repo: "ramesh903566/synalytix-core", description: "Pushed 3 commits to main", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 2, type: "PullRequestEvent", repo: "vercel/next.js", description: "Opened pull request #54210", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 3, type: "IssuesEvent", repo: "ramesh903566/react-animations", description: "Closed issue #42", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 4, type: "WatchEvent", repo: "facebook/react", description: "Starred repository", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];
