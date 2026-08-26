"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { Users, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  titleKey: string;
  subtitleKey?: string;
  icon?: LucideIcon;
  badgeText?: string;
  familyName?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  titleKey,
  subtitleKey,
  icon: Icon,
  badgeText,
  familyName,
  children,
}: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
      <div className="flex items-start sm:items-center gap-3.5">
        {Icon && (
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t(titleKey)}
            </h1>
            {badgeText && (
              <span className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
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
              <Users className="h-3 w-3 text-emerald-500" />
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
