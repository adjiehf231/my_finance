"use client";

import { formatCurrency } from "@/lib/utils";
import { Sparkles, Wallet, HandCoins, CreditCard, TrendingUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import type { NetWorthSummary } from "../actions/analytics-actions";

interface NetWorthCardProps {
  netWorth: NetWorthSummary;
}

export function NetWorthCard({ netWorth }: NetWorthCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#0D111A] to-[#0A1224] text-white p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden shadow-2xl shadow-blue-950/20">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-cyan-500/0 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute left-0 bottom-0 w-60 h-60 bg-gradient-to-tr from-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 font-display">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              {t("dashboard.netWorthTitle")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1 font-mono text-white">
              {formatCurrency(netWorth.netWorth)}
            </h2>
          </div>

          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] px-4 py-2 rounded-2xl text-xs font-black text-slate-200 self-start sm:self-auto flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span>{t("dashboard.netWorthBadge")}</span>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              <div className="h-6 w-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Wallet className="h-3.5 w-3.5" />
              </div>
              <span>{t("dashboard.walletBalance")}</span>
            </div>
            <p className="font-black text-lg text-white font-mono">
              {formatCurrency(netWorth.totalWalletBalance)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 mb-1.5 uppercase tracking-wider">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <HandCoins className="h-3.5 w-3.5" />
              </div>
              <span>{t("dashboard.activeReceivables")}</span>
            </div>
            <p className="font-black text-lg text-emerald-400 font-mono">
              +{formatCurrency(netWorth.totalReceivables)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-2 text-[11px] font-bold text-rose-400 mb-1.5 uppercase tracking-wider">
              <div className="h-6 w-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <CreditCard className="h-3.5 w-3.5" />
              </div>
              <span>{t("dashboard.activeLiabilities")}</span>
            </div>
            <p className="font-black text-lg text-rose-400 font-mono">
              -{formatCurrency(netWorth.totalLiabilities)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
