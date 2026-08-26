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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Saldo / Likuiditas Aktif */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-2xl group-hover:bg-blue-500/25 transition-all" />
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("dashboard.totalBalance")}
          </span>
          <div className="h-10 w-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {formatCurrency(totalWalletBalance)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Likuiditas Aktif
            </span>
          </div>
        </div>
      </div>

      {/* 2. Pemasukan Bulan Ini */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl group-hover:bg-emerald-500/25 transition-all" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("dashboard.monthlyIncome")}
          </span>
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
            +{formatCurrency(totalIncome)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Kas Masuk
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pengeluaran Bulan Ini */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm hover:shadow-xl hover:border-rose-500/40 dark:hover:border-rose-500/30 transition-all duration-300 group hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-2xl group-hover:bg-rose-500/25 transition-all" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {t("dashboard.monthlyExpense")}
          </span>
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono">
            -{formatCurrency(totalExpense)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Realisasi Belanja
            </span>
          </div>
        </div>
      </div>

      {/* 4. Net Worth & Savings Rate */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-indigo-500/10 dark:from-emerald-950/40 dark:via-[#0E131F] dark:to-indigo-950/30 backdrop-blur-2xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 blur-2xl group-hover:bg-emerald-500/30 transition-all" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
            Kekayaan Bersih
          </span>
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight font-mono">
            {formatCurrency(netWorth)}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-200/60 dark:bg-emerald-900/60 border border-emerald-300/60 dark:border-emerald-700/60 px-2.5 py-0.5 rounded-full">
              <Percent className="h-3 w-3" />
              Tabungan {savingsRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
