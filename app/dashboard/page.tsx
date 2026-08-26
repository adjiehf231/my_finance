import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getTransactionsAction } from "@/features/transactions/actions/transaction-actions";
import { getBudgetsAction } from "@/features/budgets/actions/budget-actions";
import {
  getAnalyticsSummaryAction,
  getCashflowTrendAction,
  getCategoryBreakdownAction,
  getNetWorthSummaryAction,
} from "@/features/analytics/actions/analytics-actions";
import {
  getFinancialHealthAdviceAction,
  getWeeklyFinancialDigestAction,
} from "@/features/ai/actions/ai-actions";
import { MetricSummaryCards } from "@/features/analytics/components/metric-summary-cards";
import { CashflowAreaChart } from "@/features/analytics/components/cashflow-area-chart";
import { CategoryDonutChart } from "@/features/analytics/components/category-donut-chart";
import { NetWorthCard } from "@/features/analytics/components/net-worth-card";
import { AIAdvisorCard } from "@/features/ai/components/ai-advisor-card";
import { AIWeeklyDigestCard } from "@/features/ai/components/ai-weekly-digest-card";
import { BudgetWarningBanner } from "@/features/budgets/components/budget-warning-banner";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { ReceiptScannerModal } from "@/features/ai/components/receipt-scanner-modal";
import { TransactionTable } from "@/features/transactions/components/transaction-table";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowRight } from "lucide-react";
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

  const currentPeriodMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-01`;

  const [
    walletsRes,
    categoriesRes,
    recentTxRes,
    summaryRes,
    cashflowRes,
    breakdownRes,
    netWorthRes,
    adviceRes,
    budgetsRes,
    digestRes,
  ] = await Promise.all([
    getWalletsAction(family.id),
    getCategoriesAction(family.id),
    getTransactionsAction({ familyId: family.id, limit: 10, offset: 0 }),
    getAnalyticsSummaryAction(family.id, "this_month"),
    getCashflowTrendAction(family.id, "this_month"),
    getCategoryBreakdownAction(family.id, "this_month"),
    getNetWorthSummaryAction(family.id),
    getFinancialHealthAdviceAction(family.id),
    getBudgetsAction(family.id, currentPeriodMonth),
    getWeeklyFinancialDigestAction(family.id),
  ]);

  const wallets = walletsRes.data || [];
  const categories = categoriesRes.data || [];
  const recentTransactions = recentTxRes.data || [];
  const summary = summaryRes.data;
  const cashflow = cashflowRes.data || [];
  const categoryBreakdown = breakdownRes.data || [];
  const netWorth = netWorthRes.data;
  const advice = adviceRes.data;
  const budgets = budgetsRes.data || [];
  const digest = digestRes.data;

  return (
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="dashboard.title"
        subtitleKey="dashboard.welcome"
        iconName="dashboard"
        badgeText={userRole}
        familyName={family.name}
      >
        <ReceiptScannerModal
          familyId={family.id}
          wallets={wallets}
          categories={categories}
        />
        <AddTransactionModal
          familyId={family.id}
          wallets={wallets}
          categories={categories}
        />
      </PageHeader>

      {/* Smart Budget Warning Banners */}
      <BudgetWarningBanner budgets={budgets} />

      {/* 4 KPI Metrics */}
      <MetricSummaryCards
        totalWalletBalance={netWorth.totalWalletBalance}
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
        netWorth={netWorth.netWorth}
        savingsRate={summary.savingsRate}
      />

      {/* AI Financial Advisor & Weekly Digest Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {advice && <AIAdvisorCard advice={advice} />}
        {digest && <AIWeeklyDigestCard digest={digest} />}
      </div>

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
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-display">
              Mutasi Transaksi Terkini
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              10 catatan transaksi terakhir dalam ruang kerja keluarga
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 dark:bg-blue-400/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 transition-all hover:scale-105"
          >
            Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <TransactionTable transactions={recentTransactions} />
      </div>
    </AppLayout>
  );
}
