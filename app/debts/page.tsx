import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getDebtsAction } from "@/features/debts/actions/debt-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { DebtCard } from "@/features/debts/components/debt-card";
import { AddDebtModal } from "@/features/debts/components/add-debt-modal";
import { Card, CardContent } from "@/components/ui/card";
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
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hutang & Piutang
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
            </p>
          </div>
        </div>

        <AddDebtModal familyId={family.id} />
      </div>

      {/* 2 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800/80 p-6 bg-white dark:bg-[#131B2E] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Total Hutang Yang Harus Dibayar
              </p>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
                {formatCurrency(totalLoans, family.currency)}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800/80 p-6 bg-white dark:bg-[#131B2E] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <HandCoins className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                Total Piutang Yang Akan Diterima
              </p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatCurrency(totalReceivables, family.currency)}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Daftar Kewajiban ({debts.length})
          </h3>
        </div>

        {debts.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 p-12 text-center">
            <CardContent className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Bebas Hutang & Piutang
              </h4>
              <p className="text-sm text-slate-500 max-w-sm mb-6">
                Tidak ada data hutang atau piutang yang aktif saat ini.
              </p>
              <AddDebtModal familyId={family.id} />
            </CardContent>
          </Card>
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
