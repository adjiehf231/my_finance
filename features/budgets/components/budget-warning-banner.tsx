"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/i18n-context";

export interface BudgetWarningItem {
  id: string;
  categoryName: string;
  categoryColor?: string;
  limitAmount: number;
  spentAmount: number;
  percentage: number;
  status: "warning" | "overbudget";
}

interface BudgetWarningBannerProps {
  budgets?: any[];
  warnings?: BudgetWarningItem[];
}

export function BudgetWarningBanner({ budgets = [], warnings }: BudgetWarningBannerProps) {
  const { t } = useTranslation();

  // If warnings prop is not passed directly, derive from budgets list
  const derivedWarnings: BudgetWarningItem[] = warnings || budgets
    .filter((b) => {
      const spent = b.spent_amount || b.spentAmount || 0;
      const limit = b.limit_amount || b.limitAmount || 0;
      return limit > 0 && spent >= limit * 0.8;
    })
    .map((b) => {
      const spent = b.spent_amount || b.spentAmount || 0;
      const limit = b.limit_amount || b.limitAmount || 0;
      const percentage = Math.round((spent / limit) * 100);
      const isOver = spent >= limit;
      return {
        id: b.id,
        categoryName: b.categories?.name || b.categoryName || "Kategori",
        categoryColor: b.categories?.color || b.categoryColor || "#3b82f6",
        limitAmount: limit,
        spentAmount: spent,
        percentage,
        status: (isOver ? "overbudget" : "warning") as "warning" | "overbudget",
      };
    });

  if (derivedWarnings.length === 0) return null;

  const overbudgets = derivedWarnings.filter((w) => w.status === "overbudget");
  const nearLimits = derivedWarnings.filter((w) => w.status === "warning");

  return (
    <div className="space-y-3">
      {/* Overbudget Critical Banners */}
      {overbudgets.map((b) => (
        <div
          key={b.id}
          className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent backdrop-blur-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-rose-950/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-rose-600 dark:text-rose-400 font-display">
                  {t("budgetWarning.overbudgetTitle")}
                </h4>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full">
                  {t("budgetWarning.used", { percent: b.percentage })}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                {t("budgetWarning.desc", {
                  category: b.categoryName,
                  spent: formatCurrency(b.spentAmount),
                  limit: formatCurrency(b.limitAmount),
                })}
              </p>
            </div>
          </div>

          <Link
            href="/budgeting"
            className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-glow-rose transition-all shrink-0"
          >
            <span>{t("budgetWarning.adjustBtn")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ))}

      {/* Near Limit Warning Banners (>= 80%) */}
      {nearLimits.map((b) => (
        <div
          key={b.id}
          className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent backdrop-blur-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-amber-600 dark:text-amber-400 font-display">
                  {t("budgetWarning.warningTitle")}
                </h4>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  {t("budgetWarning.used", { percent: b.percentage })}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                {t("budgetWarning.desc", {
                  category: b.categoryName,
                  spent: formatCurrency(b.spentAmount),
                  limit: formatCurrency(b.limitAmount),
                })}
              </p>
            </div>
          </div>

          <Link
            href="/budgeting"
            className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <span>{t("budgetWarning.adjustBtn")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}
