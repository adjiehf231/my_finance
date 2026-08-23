"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Lightbulb, ShieldCheck, AlertCircle } from "lucide-react";
import type { FinancialAdviceResponse } from "@/lib/validations/ai";

interface AIAdvisorCardProps {
  advice: FinancialAdviceResponse;
}

export function AIAdvisorCard({ advice }: AIAdvisorCardProps) {
  const isExcellent = advice.healthScore >= 85;
  const isGood = advice.healthScore >= 70 && advice.healthScore < 85;
  const isFair = advice.healthScore >= 50 && advice.healthScore < 70;

  return (
    <Card className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-tr from-white via-emerald-50/20 to-teal-50/30 dark:from-[#131B2E] dark:via-emerald-950/20 dark:to-teal-950/10 p-6 shadow-sm relative overflow-hidden">
      <CardContent className="p-0 space-y-5">
        {/* Header with Health Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Sparkles className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  AI Financial Health Advisor
                </h3>
                <Badge
                  className={`text-[10px] uppercase font-bold rounded-xl px-2.5 py-0.5 ${
                    isExcellent
                      ? "bg-emerald-500 text-white"
                      : isGood
                      ? "bg-teal-500 text-white"
                      : isFair
                      ? "bg-amber-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {advice.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Didukung oleh Google Gemini 1.5 Flash Free Tier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-[#0B0F17] px-4 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm self-start sm:self-auto">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Skor Kesehatan</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none mt-0.5">
                {advice.healthScore}<span className="text-xs font-normal text-slate-400">/100</span>
              </p>
            </div>
            <ShieldCheck className="h-7 w-7 text-emerald-500" />
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {advice.summary}
        </p>

        {/* 3 Recommendations */}
        <div className="space-y-2 pt-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Rekomendasi Strategis AI
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {advice.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5 flex flex-col justify-between"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-normal">
                    {rec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Tip Banner */}
        {advice.savingsTip && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="font-medium">{advice.savingsTip}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
