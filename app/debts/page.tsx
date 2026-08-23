import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getDebtsAction } from "@/features/debts/actions/debt-actions";
import { DebtCard } from "@/features/debts/components/debt-card";
import { AddDebtModal } from "@/features/debts/components/add-debt-modal";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, HandCoins, ShieldCheck } from "lucide-react";
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
                Hutang & Piutang
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
              </p>
            </div>
          </div>

          <AddDebtModal familyId={family.id} />
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="rounded-3xl border border-rose-100 dark:border-rose-950/40 bg-gradient-to-tr from-rose-50/50 to-white dark:from-rose-950/20 dark:to-[#131B2E] p-6 shadow-sm">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Total Sisa Hutang Kewajiban
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-300 mt-1">
                  {formatCurrency(totalLoans)}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-emerald-100 dark:border-emerald-950/40 bg-gradient-to-tr from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-[#131B2E] p-6 shadow-sm">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Total Sisa Piutang Berjalan
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                  {formatCurrency(totalReceivables)}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                <HandCoins className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
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
      </div>
    </div>
  );
}
