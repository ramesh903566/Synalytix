import { usePageContext } from "../../hooks/usePageContext";
import { useChatStore } from "../../store/chatStore";

interface QuickAction {
  label: string;
  prompt: string;
}

const PAGE_ACTIONS: Record<string, QuickAction[]> = {
  dashboard: [
    { label: "Explain these metrics", prompt: "Explain the key metrics on this dashboard and what they mean for my growth." },
    { label: "Generate insights", prompt: "Generate actionable insights based on my current dashboard data." },
    { label: "Weekly summary", prompt: "Give me a summary of this week's performance across all platforms." },
  ],
  github: [
    { label: "Analyze repository", prompt: "Analyze my GitHub repository activity and suggest improvements." },
    { label: "Explain commit activity", prompt: "Explain the recent commit activity and what it tells about my development patterns." },
    { label: "Code review tips", prompt: "Based on my GitHub activity, suggest code review best practices for me." },
  ],
  linkedin: [
    { label: "Analyze engagement", prompt: "Analyze my LinkedIn engagement metrics and suggest content strategies." },
    { label: "Optimize profile", prompt: "How can I optimize my LinkedIn profile based on my current analytics?" },
    { label: "Content calendar", prompt: "Suggest a LinkedIn content calendar for the next 2 weeks." },
  ],
  instagram: [
    { label: "Analyze engagement", prompt: "Analyze my Instagram engagement and identify top-performing content." },
    { label: "Recommend posting times", prompt: "Based on my audience data, when should I post on Instagram for maximum reach?" },
    { label: "Hashtag strategy", prompt: "Suggest a hashtag strategy based on my Instagram content performance." },
  ],
  x: [
    { label: "Analyze tweets", prompt: "Analyze my X/Twitter engagement and identify what content resonates most." },
    { label: "Growth strategy", prompt: "Suggest a growth strategy for my X/Twitter account based on current metrics." },
    { label: "Thread ideas", prompt: "Generate thread ideas based on my top-performing tweets." },
  ],
  planner: [
    { label: "Prioritize tasks", prompt: "Help me prioritize my tasks based on impact and urgency." },
    { label: "Create today's plan", prompt: "Create an optimized plan for today based on my task list and deadlines." },
    { label: "Weekly review", prompt: "Review my completed tasks and suggest focus areas for next week." },
  ],
  recommendations: [
    { label: "Explain top rec", prompt: "Explain the top recommendation and why it's important for my career growth." },
    { label: "Action plan", prompt: "Create a step-by-step action plan for the highest-priority recommendation." },
    { label: "Progress check", prompt: "How am I progressing on my completed recommendations?" },
  ],
  settings: [
    { label: "Configure AI", prompt: "Help me configure my AI settings for the best experience." },
  ],
  studio: [
    { label: "Content ideas", prompt: "Generate content ideas based on my connected platforms and trending topics." },
    { label: "Optimize post", prompt: "Help me optimize my current post draft for maximum engagement." },
  ],
  analytics: [
    { label: "Compare periods", prompt: "Compare my performance across different time periods." },
    { label: "Find trends", prompt: "Identify trends in my analytics data." },
  ],
  apps: [
    { label: "Connect platforms", prompt: "Help me connect and configure my social media platforms." },
  ],
};

export function QuickActions() {
  const { page } = usePageContext();
  const { activeConversationId } = useChatStore();

  // Don't show if there's an active conversation (not empty)
  if (activeConversationId) return null;

  const actions = PAGE_ACTIONS[page] || PAGE_ACTIONS.dashboard;

  return null; // QuickActions are rendered in the ChatPanel when conversation is empty
}

export function getQuickActions(page: string): QuickAction[] {
  return PAGE_ACTIONS[page] || PAGE_ACTIONS.dashboard;
}
