"use client";

import { Users, Shield, KeyRound, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface FamilyStatsCardProps {
  totalMembers: number;
  roleCounts: {
    owner: number;
    admin: number;
    member: number;
    viewer: number;
  };
  inviteCode: string;
}

export function FamilyStatsCard({
  totalMembers,
  roleCounts,
  inviteCode,
}: FamilyStatsCardProps) {
  const { t, locale } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Metric 1: Total Members */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-display">
            {t("familyManagement.statsTotalMembers")}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalMembers} <span className="text-xs font-semibold text-slate-400">{locale === "en" ? "People" : "Orang"}</span>
          </span>
        </div>
      </div>

      {/* Metric 2: Role Distribution */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-display">
            {t("familyManagement.statsActiveRoles")}
          </span>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-500/20">
              {roleCounts.owner} Owner
            </span>
            {roleCounts.admin > 0 && (
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                {roleCounts.admin} Admin
              </span>
            )}
            {roleCounts.member > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                {roleCounts.member} Member
              </span>
            )}
            {roleCounts.viewer > 0 && (
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08]">
                {roleCounts.viewer} Viewer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metric 3: Active Workspace Invite Code */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
          <KeyRound className="h-6 w-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-display">
            {t("familyManagement.statsInviteCode")}
          </span>
          <span className="text-xl font-mono font-black text-blue-600 dark:text-blue-400 tracking-widest">
            {inviteCode}
          </span>
        </div>
      </div>
    </div>
  );
}
