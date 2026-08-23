import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { WalletCard } from "@/features/wallets/components/wallet-card";
import { AddWalletModal } from "@/features/wallets/components/add-wallet-modal";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Dompet & Rekening
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Ruang Kerja: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
              </p>
            </div>
          </div>

          <AddWalletModal familyId={family.id} />
        </div>

        {/* Total Liquidity Summary Banner */}
        <Card className="rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/10 p-6 sm:p-8 border-none relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-emerald-100 mb-1">
                Total Likuiditas Saldo Keluarga
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                {formatCurrency(totalBalance, family.currency)}
              </h2>
            </div>
            <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-semibold self-start sm:self-auto">
              {wallets.length} Rekening Aktif
            </div>
          </div>
        </Card>

        {/* Wallets Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Daftar Rekening
            </h3>
          </div>

          {wallets.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 p-12 text-center">
              <CardContent className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
                  <Wallet className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Belum Ada Dompet
                </h4>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Tambahkan rekening bank, dompet digital, atau kas tunai pertamamu untuk mulai mencatat.
                </p>
                <AddWalletModal familyId={family.id} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
