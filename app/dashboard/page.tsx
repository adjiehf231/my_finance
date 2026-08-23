import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getTransactionsAction } from "@/features/transactions/actions/transaction-actions";
import {
  getAnalyticsSummaryAction,
  getCashflowTrendAction,
  getCategoryBreakdownAction,
  getNetWorthSummaryAction,
} from "@/features/analytics/actions/analytics-actions";
import { MetricSummaryCards } from "@/features/analytics/components/metric-summary-cards";
import { CashflowAreaChart } from "@/features/analytics/components/cashflow-area-chart";
import { CategoryDonutChart } from "@/features/analytics/components/category-donut-chart";
import { NetWorthCard } from "@/features/analytics/components/net-worth-card";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { TransactionTable } from "@/features/transactions/components/transaction-table";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard Finansial Keluarga",
  description: "Pusat monitoring arus kas, anggaran, dan kekayaan bersih keluarga.",
};

export default async function DashboardPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const userRole = familyRes.data.role;

  const [
    walletsRes,
    categoriesRes,
    recentTxRes,
    summaryRes,
    cashflowRes,
    breakdownRes,
    netWorthRes,
  ] = await Promise.all([
    getWalletsAction(family.id),
    getCategoriesAction(family.id),
    getTransactionsAction({ familyId: family.id, limit: 10, offset: 0 }),
    getAnalyticsSummaryAction(family.id, "this_month"),
    getCashflowTrendAction(family.id, "this_month"),
    getCategoryBreakdownAction(family.id, "this_month"),
    getNetWorthSummaryAction(family.id),
  ]);

  const wallets = walletsRes.data || [];
  const categories = categoriesRes.data || [];
  const recentTransactions = recentTxRes.data || [];
  const summary = summaryRes.data;
  const cashflow = cashflowRes.data || [];
  const categoryBreakdown = breakdownRes.data || [];
  const netWorth = netWorthRes.data;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Dashboard Keuangan
              </h1>
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {userRole.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Ruang Kerja: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
            </p>
          </div>

          <AddTransactionModal
            familyId={family.id}
            wallets={wallets}
            categories={categories}
          />
        </div>

        {/* 4 KPI Metrics */}
        <MetricSummaryCards
          totalWalletBalance={netWorth.totalWalletBalance}
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
          netWorth={netWorth.netWorth}
          savingsRate={summary.savingsRate}
        />

        {/* Net Worth Card */}
        <NetWorthCard netWorth={netWorth} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CashflowAreaChart data={cashflow} />
          </div>
          <div>
            <CategoryDonutChart data={categoryBreakdown} />
          </div>
        </div>

        {/* Recent Transactions Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Transaksi Terkini
            </h3>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <TransactionTable transactions={recentTransactions} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
