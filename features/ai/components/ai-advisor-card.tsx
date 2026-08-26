"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import type { FinancialAdviceResponse } from "@/lib/validations/ai";

interface AIAdvisorCardProps {
  advice: FinancialAdviceResponse;
}

export function AIAdvisorCard({ advice }: AIAdvisorCardProps) {
  const { t } = useTranslation();
  const isExcellent = advice.healthScore >= 85;
  const isGood = advice.healthScore >= 70 && advice.healthScore < 85;
  const isFair = advice.healthScore >= 50 && advice.healthScore < 70;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/40 dark:border-blue-400/20 bg-gradient-to-br from-blue-500/[0.08] via-indigo-500/[0.03] to-cyan-500/[0.06] dark:from-[#0D111A] dark:via-[#111A2E] dark:to-[#0D111A] backdrop-blur-2xl p-6 sm:p-7 shadow-xl shadow-blue-500/10 transition-all duration-300">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-blue-500/20 dark:bg-blue-400/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-cyan-500/15 dark:bg-cyan-400/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header with Health Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 font-black">
              <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight font-display">
                  {t("dashboard.healthAdvisorTitle")}
                </h3>
                <Badge
                  className={`text-[10px] uppercase font-black rounded-full px-3 py-0.5 border shadow-sm ${
                    isExcellent
                      ? "bg-blue-600 text-white border-blue-400"
                      : isGood
                      ? "bg-cyan-600 text-white border-cyan-400"
                      : isFair
                      ? "bg-amber-500 text-white border-amber-400"
                      : "bg-rose-500 text-white border-rose-400"
                  }`}
                >
                  {advice.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {t("dashboard.healthAdvisorSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-white/90 dark:bg-[#07090E]/90 px-5 py-3 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm self-start sm:self-auto backdrop-blur-xl">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">
                {t("dashboard.healthScore")}
              </p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none mt-0.5 font-mono">
                {advice.healthScore}<span className="text-xs font-bold text-slate-400">/100</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-white/70 dark:bg-white/[0.03] p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] shadow-sm flex items-start gap-3">
          <Zap className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p>{advice.summary}</p>
        </div>

        {/* 3 Recommendations */}
        <div className="space-y-2.5 pt-1">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-display">
            {t("dashboard.strategicRecommendations")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {advice.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white/85 dark:bg-[#07090E]/70 border border-slate-200/80 dark:border-white/[0.06] text-xs space-y-1.5 hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    {rec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Tip Banner */}
        {advice.savingsTip && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 shadow-sm">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <span className="font-bold leading-relaxed">{advice.savingsTip}</span>
          </div>
        )}
      </div>
    </div>
  );
}
