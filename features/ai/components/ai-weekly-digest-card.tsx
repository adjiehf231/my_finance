"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { WeeklyDigestData } from "../actions/ai-actions";

interface AIWeeklyDigestCardProps {
  digest: WeeklyDigestData;
}

export function AIWeeklyDigestCard({ digest }: AIWeeklyDigestCardProps) {
  const { t } = useTranslation();
  const isVelocityUp = digest.velocityPercentage > 0;

  return (
    <Card className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 via-[#0D111A]/90 to-[#07090E]/90 backdrop-blur-2xl text-white shadow-xl shadow-blue-950/20 overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardContent className="p-6 sm:p-7 space-y-5 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-tight font-display">
                  {t("weeklyDigest.title")}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  {t("weeklyDigest.badge")}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                {digest.weekLabel}
              </p>
            </div>
          </div>

          <div
            className={`self-start sm:self-auto px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border ${
              isVelocityUp
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {isVelocityUp ? (
              <TrendingUp className="h-4 w-4 text-rose-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-emerald-400" />
            )}
            <span>
              {isVelocityUp ? `+${digest.velocityPercentage}%` : `${digest.velocityPercentage}%`} {t("weeklyDigest.vsLastWeek")}
            </span>
          </div>
        </div>

        {/* 2-Column Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
              {t("weeklyDigest.total7Days")}
            </span>
            <p className="text-2xl font-black font-mono text-white">
              {formatCurrency(digest.totalExpenseThisWeek)}
            </p>
            <p className="text-[11px] text-slate-400">
              {t("weeklyDigest.prevWeek", { amount: formatCurrency(digest.totalExpenseLastWeek) })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">
              {t("weeklyDigest.topCategory")}
            </span>
            <p className="text-lg font-black font-display text-cyan-300 truncate">
              {digest.topExpenseCategory?.name || t("weeklyDigest.noSpending")}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              {digest.topExpenseCategory
                ? formatCurrency(digest.topExpenseCategory.amount)
                : "Rp 0"}
            </p>
          </div>
        </div>

        {/* 3 Actionable Tips */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-400 font-display">
            <Lightbulb className="h-4 w-4" />
            <span>{t("weeklyDigest.recommendationsTitle")}</span>
          </div>

          <div className="space-y-2">
            {digest.tips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-xs text-slate-300 font-medium"
              >
                <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
