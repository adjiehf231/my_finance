import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getDebtsAction } from "@/features/debts/actions/debt-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { DebtCard } from "@/features/debts/components/debt-card";
import { AddDebtModal } from "@/features/debts/components/add-debt-modal";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditCard, HandCoins, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pelacakan Hutang & Piutang",
  description: "Pantau kewajiban pinjaman dan piutang keluarga beserta pembayaran cicilan.",
};

export default async function DebtsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const [walletsRes, debtsRes] = await Promise.all([
    getWalletsAction(family.id),
    getDebtsAction(
      family.id,
      params.type === "loan_payable" || params.type === "debt_receivable"
        ? params.type
        : undefined
    ),
  ]);

  const wallets = (walletsRes.data || []).map((w) => ({
    id: w.id,
    name: w.name,
    current_balance: Number(w.current_balance || 0),
  }));

  const debts = debtsRes.data || [];

  const totalLoans = debts
    .filter((d) => d.type === "loan_payable")
    .reduce((acc, d) => acc + d.remaining_amount, 0);

  const totalReceivables = debts
    .filter((d) => d.type === "debt_receivable")
    .reduce((acc, d) => acc + d.remaining_amount, 0);

  return (
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="debts.title"
        subtitleKey="debts.subtitle"
        icon={CreditCard}
        familyName={family.name}
      >
        <AddDebtModal familyId={family.id} />
      </PageHeader>

      {/* 2 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] p-6 bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                Total Hutang Yang Harus Dibayar
              </p>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
                {formatCurrency(totalLoans, family.currency)}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] p-6 bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <HandCoins className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                Total Piutang Yang Akan Diterima
              </p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                {formatCurrency(totalReceivables, family.currency)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/[0.08] pb-3">
        <Link href="/debts">
          <Button
            variant={!params.type ? "default" : "ghost"}
            className="rounded-2xl text-xs font-bold"
          >
            Semua
          </Button>
        </Link>
        <Link href="/debts?type=loan_payable">
          <Button
            variant={params.type === "loan_payable" ? "default" : "ghost"}
            className="rounded-2xl text-xs font-bold"
          >
            Hutang Saya
          </Button>
        </Link>
        <Link href="/debts?type=debt_receivable">
          <Button
            variant={params.type === "debt_receivable" ? "default" : "ghost"}
            className="rounded-2xl text-xs font-bold"
          >
            Piutang Teman
          </Button>
        </Link>
      </div>

      {/* Debts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Daftar Kewajiban & Tagihan ({debts.length})
          </h3>
        </div>

        {debts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] p-12 text-center bg-white/50 dark:bg-[#0E131F]/50 backdrop-blur-xl">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                Bebas Hutang & Piutang
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 font-medium">
                Tidak ada data kewajiban hutang atau piutang yang aktif saat ini.
              </p>
              <AddDebtModal familyId={family.id} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {debts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                familyId={family.id}
                wallets={wallets}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
