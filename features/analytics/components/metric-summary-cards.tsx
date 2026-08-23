"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Saldo / Likuiditas */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-5 shadow-sm">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Saldo Dompet
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(totalWalletBalance)}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Wallet className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Pemasukan */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-5 shadow-sm">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Pemasukan
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              +{formatCurrency(totalIncome)}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Pengeluaran */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-5 shadow-sm">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Pengeluaran
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              -{formatCurrency(totalExpense)}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Net Worth */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-tr from-emerald-50/40 to-teal-50/20 dark:from-emerald-950/20 dark:to-teal-950/10 p-5 shadow-sm">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                Kekayaan Bersih (Net Worth)
              </p>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatCurrency(netWorth)}
            </h3>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
