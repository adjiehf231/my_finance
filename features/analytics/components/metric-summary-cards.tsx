"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Percent,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface MetricSummaryCardsProps {
  totalWalletBalance: number;
  totalIncome: number;
  totalExpense: number;
  netWorth: number;
  savingsRate?: number;
}

export function MetricSummaryCards({
  totalWalletBalance,
  totalIncome,
  totalExpense,
  netWorth,
  savingsRate = 0,
}: MetricSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Saldo / Likuiditas */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-xl p-5 shadow-sm hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200 group">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {t("dashboard.totalBalance")}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {formatCurrency(totalWalletBalance)}
            </h3>
            <span className="inline-flex items-center text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
              Saldo Likuid Aktif
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Pemasukan */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-xl p-5 shadow-sm hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 group">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {t("dashboard.monthlyIncome")}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              +{formatCurrency(totalIncome)}
            </h3>
            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              Bulan Berjalan
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Pengeluaran */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-xl p-5 shadow-sm hover:border-rose-500/40 hover:shadow-md hover:shadow-rose-500/5 transition-all duration-200 group">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              {t("dashboard.monthlyExpense")}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono">
              -{formatCurrency(totalExpense)}
            </h3>
            <span className="inline-flex items-center text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
              Realisasi Pengeluaran
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Net Worth */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-indigo-500/10 backdrop-blur-xl p-5 shadow-sm hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200 group">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
              Kekayaan Bersih (Net Worth)
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
              {formatCurrency(netWorth)}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
              <Percent className="h-2.5 w-2.5" />
              Tabungan {savingsRate}%
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
