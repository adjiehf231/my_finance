"use client";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Saldo / Likuiditas Aktif */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-6 shadow-sm hover:shadow-2xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-1">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-2xl group-hover:bg-blue-500/30 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 font-display">
            {t("dashboard.totalBalance")}
          </span>
          <div className="h-11 w-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {formatCurrency(totalWalletBalance)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {t("dashboard.liquidity")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Pemasukan Bulan Ini */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-6 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 dark:hover:border-emerald-400/40 transition-all duration-300 group hover:-translate-y-1">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl group-hover:bg-emerald-500/30 transition-all pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 font-display">
            {t("dashboard.monthlyIncome")}
          </span>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-all">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
            +{formatCurrency(totalIncome)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t("dashboard.cashInflow")}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pengeluaran Bulan Ini */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-6 shadow-sm hover:shadow-2xl hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all duration-300 group hover:-translate-y-1">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-2xl group-hover:bg-rose-500/30 transition-all pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 font-display">
            {t("dashboard.monthlyExpense")}
          </span>
          <div className="h-11 w-11 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono">
            -{formatCurrency(totalExpense)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-rose-700 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {t("dashboard.cashOutflow")}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Net Worth & Savings Rate */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 dark:border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 dark:from-blue-950/40 dark:via-[#0D111A] dark:to-cyan-950/30 backdrop-blur-2xl p-6 shadow-sm hover:shadow-2xl hover:border-blue-500/60 transition-all duration-300 group hover:-translate-y-1">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-blue-500/20 dark:bg-blue-400/20 blur-2xl group-hover:bg-blue-500/40 transition-all pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400 font-display">
            {t("dashboard.netWorth")}
          </span>
          <div className="h-11 w-11 rounded-2xl bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-all">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300 tracking-tight font-mono">
            {formatCurrency(netWorth)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-blue-800 dark:text-blue-200 bg-blue-500/20 dark:bg-blue-400/20 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
              <Percent className="h-3 w-3" />
              {t("dashboard.savingsPercent", { rate: savingsRate })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
