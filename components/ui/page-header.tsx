"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  Users,
  ArrowRightLeft,
  Wallet,
  PieChart,
  Target,
  CreditCard,
  Repeat,
  BarChart3,
  Sparkles,
  Settings,
  Tags,
  Activity,
  Trophy,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";

export type PageHeaderIconName =
  | "dashboard"
  | "transactions"
  | "wallets"
  | "budgeting"
  | "goals"
  | "debts"
  | "recurring"
  | "analytics"
  | "advisor"
  | "settings"
  | "categories"
  | "family"
  | "activity"
  | "gamification";

const ICONS: Record<PageHeaderIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  transactions: ArrowRightLeft,
  wallets: Wallet,
  budgeting: PieChart,
  goals: Target,
  debts: CreditCard,
  recurring: Repeat,
  analytics: BarChart3,
  advisor: Sparkles,
  settings: Settings,
  categories: Tags,
  family: Users,
  activity: Activity,
  gamification: Trophy,
};

interface PageHeaderProps {
  titleKey: string;
  subtitleKey?: string;
  iconName?: PageHeaderIconName;
  badgeText?: string;
  familyName?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  titleKey,
  subtitleKey,
  iconName,
  badgeText,
  familyName,
  children,
}: PageHeaderProps) {
  const { t } = useTranslation();
  const Icon = iconName ? ICONS[iconName] : undefined;

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
      <div className="flex items-start sm:items-center gap-3.5">
        {Icon && (
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              {t(titleKey)}
            </h1>
            {badgeText && (
              <span className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-wider">
                {badgeText}
              </span>
            )}
          </div>
          {subtitleKey && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {t(subtitleKey)}
            </p>
          )}
          {familyName && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <Users className="h-3 w-3 text-blue-500" />
              {t("common.familyWorkspace")}: <span className="font-bold text-slate-700 dark:text-slate-300">{familyName}</span>
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {children}
        </div>
      )}
    </div>
  );
}
