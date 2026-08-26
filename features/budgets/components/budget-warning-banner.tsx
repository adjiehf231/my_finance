"use client";

import Link from "next/link";
import { AlertTriangle, Flame, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { BudgetWithSpending } from "../actions/budget-actions";

interface BudgetWarningBannerProps {
  budgets: BudgetWithSpending[];
}

export function BudgetWarningBanner({ budgets }: BudgetWarningBannerProps) {
  // Find critical budgets (overbudget or >= notify_threshold e.g. 80%)
  const criticalBudgets = budgets.filter(
    (b) => b.percentage >= (b.notify_threshold || 80) || b.status === "overbudget"
  );

  if (criticalBudgets.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {criticalBudgets.map((b) => {
        const isOverbudget = b.percentage >= 100 || b.status === "overbudget";

        return (
          <div
            key={b.id}
            className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 backdrop-blur-xl border ${
              isOverbudget
                ? "bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30 text-rose-900 dark:text-rose-200 shadow-sm"
                : "bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-sm"
            }`}
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                  isOverbudget
                    ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                    : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                }`}
              >
                {isOverbudget ? (
                  <Flame className="h-5 w-5 animate-pulse" />
                ) : (
                  <AlertTriangle className="h-5 w-5 animate-bounce" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm tracking-tight font-display">
                    {isOverbudget ? "Peringatan Overbudget!" : "Peringatan Batas Anggaran!"}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      isOverbudget
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {b.percentage}% Terpakai
                  </span>
                </div>
                <p className="text-xs mt-0.5 font-medium opacity-90">
                  Anggaran kategori <strong className="font-bold">{b.categories?.name}</strong> telah menghabiskan{" "}
                  <span className="font-mono font-bold">{formatCurrency(b.spent_amount)}</span> dari limit{" "}
                  <span className="font-mono font-bold">{formatCurrency(b.amount_limit)}</span>.
                </p>
              </div>
            </div>

            <Link
              href="/budgeting"
              className={`self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm shrink-0 ${
                isOverbudget
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950"
              }`}
            >
              <span>Sesuaikan Anggaran</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
