import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { WalletCard } from "@/features/wallets/components/wallet-card";
import { AddWalletModal } from "@/features/wallets/components/add-wallet-modal";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Sparkles, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Dompet & Rekening Keuangan",
  description: "Kelola daftar rekening bank, e-wallet, uang tunai, dan kartu kredit keluarga.",
};

export default async function WalletsPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const walletsRes = await getWalletsAction(family.id);
  const wallets = walletsRes.data || [];
  const totalBalance = walletsRes.totalBalance || 0;

  return (
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="wallets.title"
        subtitleKey="wallets.subtitle"
        icon={Wallet}
        familyName={family.name}
      >
        <AddWalletModal familyId={family.id} />
      </PageHeader>

      {/* Total Liquidity Summary Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl shadow-emerald-600/15 p-6 sm:p-8 border border-white/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-100 flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Total Likuiditas Saldo Kas Keluarga
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
              {formatCurrency(totalBalance, family.currency)}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/15 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-sm">
              <CreditCard className="h-3.5 w-3.5 text-emerald-300" />
              {wallets.length} Rekening Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Daftar Rekening & Sumber Dana
          </h3>
        </div>

        {wallets.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] p-12 text-center bg-white/50 dark:bg-[#0E131F]/50 backdrop-blur-xl">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                Belum Ada Dompet Terdaftar
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 font-medium">
                Tambahkan rekening bank, dompet digital, atau kas tunai pertamamu untuk mulai mencatat.
              </p>
              <AddWalletModal familyId={family.id} />
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
    </AppLayout>
  );
}
