"use client";

import { useTranslation } from "@/lib/i18n/i18n-context";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, CreditCard, Wallet } from "lucide-react";
import { WalletCard } from "@/features/wallets/components/wallet-card";
import { AddWalletModal } from "@/features/wallets/components/add-wallet-modal";
import type { WalletItem } from "@/features/wallets/actions/wallet-actions";

type WalletRow = WalletItem;

interface WalletsClientSectionProps {
  wallets: WalletRow[];
  totalBalance: number;
  currency: string;
  familyId: string;
}

export function WalletsClientSection({
  wallets,
  totalBalance,
  currency,
  familyId,
}: WalletsClientSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Total Liquidity Summary Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-700 text-white shadow-xl shadow-blue-600/15 p-6 sm:p-8 border border-white/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-100 flex items-center gap-1.5 mb-1 font-display">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              {t("walletsPage.liquidityLabel")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
              {formatCurrency(totalBalance, currency)}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/15 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-sm">
              <CreditCard className="h-3.5 w-3.5 text-cyan-300" />
              {t("walletsPage.activeAccounts", { count: wallets.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-display">
            {t("walletsPage.accountListTitle")}
          </h3>
        </div>

        {wallets.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] p-12 text-center bg-white/50 dark:bg-[#0D111A]/50 backdrop-blur-xl">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 font-display">
                {t("walletsPage.emptyTitle")}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 font-medium">
                {t("walletsPage.emptySubtitle")}
              </p>
              <AddWalletModal familyId={familyId} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
