import {
  LayoutDashboard,
  Sparkles,
  ArrowRightLeft,
  Wallet,
  PieChart,
  Target,
  Repeat,
  CreditCard,
  BarChart3,
  Activity,
  Trophy,
  Tags,
  Users,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  href: string;
  key: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroupConfig {
  id: "overview" | "finance" | "analytics" | "system";
  titleKey: string;
  items: NavItemConfig[];
}

export const NAVIGATION_GROUPS: NavGroupConfig[] = [
  {
    id: "overview",
    titleKey: "navGroups.overview",
    items: [
      { href: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
      { href: "/advisor", key: "nav.advisor", icon: Sparkles, badge: "AI" },
      { href: "/transactions", key: "nav.transactions", icon: ArrowRightLeft },
    ],
  },
  {
    id: "finance",
    titleKey: "navGroups.finance",
    items: [
      { href: "/wallets", key: "nav.wallets", icon: Wallet },
      { href: "/budgeting", key: "nav.budgeting", icon: PieChart },
      { href: "/goals", key: "nav.goals", icon: Target },
      { href: "/debts", key: "nav.debts", icon: CreditCard },
      { href: "/recurring", key: "nav.recurring", icon: Repeat },
    ],
  },
  {
    id: "analytics",
    titleKey: "navGroups.analytics",
    items: [
      { href: "/analytics", key: "nav.analytics", icon: BarChart3 },
      { href: "/activity", key: "nav.activity", icon: Activity },
      { href: "/gamification", key: "nav.gamification", icon: Trophy },
    ],
  },
  {
    id: "system",
    titleKey: "navGroups.system",
    items: [
      { href: "/categories", key: "nav.categories", icon: Tags },
      { href: "/family", key: "nav.family", icon: Users },
      { href: "/settings", key: "nav.settings", icon: Settings },
    ],
  },
];
