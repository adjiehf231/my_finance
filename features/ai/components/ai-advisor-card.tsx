"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Lightbulb, ShieldCheck } from "lucide-react";
import type { FinancialAdviceResponse } from "@/lib/validations/ai";

interface AIAdvisorCardProps {
  advice: FinancialAdviceResponse;
}

export function AIAdvisorCard({ advice }: AIAdvisorCardProps) {
  const isExcellent = advice.healthScore >= 85;
  const isGood = advice.healthScore >= 70 && advice.healthScore < 85;
  const isFair = advice.healthScore >= 50 && advice.healthScore < 70;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.07] via-teal-500/[0.03] to-indigo-500/[0.05] dark:from-[#0E131F] dark:via-[#111A2E] dark:to-[#0E131F] backdrop-blur-2xl p-6 shadow-lg shadow-emerald-500/5 transition-all duration-300">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-emerald-500/15 dark:bg-emerald-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 blur-3xl" />

      <div className="relative z-10 space-y-5">
        {/* Header with Health Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              <Sparkles className="h-6 w-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  AI Financial Health Advisor
                </h3>
                <Badge
                  className={`text-[10px] uppercase font-extrabold rounded-full px-2.5 py-0.5 border shadow-sm ${
                    isExcellent
                      ? "bg-emerald-500 text-white border-emerald-400"
                      : isGood
                      ? "bg-teal-500 text-white border-teal-400"
                      : isFair
                      ? "bg-amber-500 text-white border-amber-400"
                      : "bg-rose-500 text-white border-rose-400"
                  }`}
                >
                  {advice.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Analisis real-time arus kas & kesehatan finansial keluarga
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/90 dark:bg-[#07090E]/90 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm self-start sm:self-auto backdrop-blur-xl">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Skor Kesehatan</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none mt-0.5 font-mono">
                {advice.healthScore}<span className="text-xs font-normal text-slate-400">/100</span>
              </p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-white/50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200/50 dark:border-white/[0.05]">
          {advice.summary}
        </p>

        {/* 3 Recommendations */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Rekomendasi Strategis AI
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {advice.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-white/80 dark:bg-[#07090E]/60 border border-slate-200/70 dark:border-white/[0.06] text-xs space-y-1.5 hover:border-emerald-500/30 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {rec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Tip Banner */}
        {advice.savingsTip && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200">
            <div className="h-7 w-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <span className="font-semibold leading-relaxed">{advice.savingsTip}</span>
          </div>
        )}
      </div>
    </div>
  );
}
