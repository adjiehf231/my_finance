"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowUpRight, ArrowDownRight, Wallet, HandCoins, CreditCard } from "lucide-react";
import type { NetWorthSummary } from "../actions/analytics-actions";

interface NetWorthCardProps {
  netWorth: NetWorthSummary;
}

export function NetWorthCard({ netWorth }: NetWorthCardProps) {
  return (
    <Card className="rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-8 border-none relative overflow-hidden shadow-xl shadow-slate-950/20">
      <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Kekayaan Bersih Keluarga (Net Worth)
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              {formatCurrency(netWorth.netWorth)}
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-semibold self-start sm:self-auto">
            Aset Bersih Real-Time
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
              <Wallet className="h-3.5 w-3.5 text-blue-400" />
              <span>Saldo Dompet</span>
            </div>
            <p className="font-bold text-base text-white">
              {formatCurrency(netWorth.totalWalletBalance)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
              <HandCoins className="h-3.5 w-3.5 text-emerald-400" />
              <span>Piutang Berjalan</span>
            </div>
            <p className="font-bold text-base text-emerald-400">
              +{formatCurrency(netWorth.totalReceivables)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
              <CreditCard className="h-3.5 w-3.5 text-rose-400" />
              <span>Hutang Kewajiban</span>
            </div>
            <p className="font-bold text-base text-rose-400">
              -{formatCurrency(netWorth.totalLiabilities)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
