import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
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
import { TimeframeSelector } from "@/features/analytics/components/timeframe-selector";
import { type TimeframeType } from "@/lib/validations/analytics";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Laporan & Analisis Finansial Mendalam",
  description: "Visualisasi tren arus kas, alokasi kategori, dan proyeksi finansial keluarga.",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ timeframe?: string }>;
}) {
  const params = await searchParams;
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const timeframe: TimeframeType =
    params.timeframe === "last_3_months" ||
    params.timeframe === "last_6_months" ||
    params.timeframe === "this_year"
      ? params.timeframe
      : "this_month";

  const [summaryRes, cashflowRes, breakdownRes, netWorthRes] = await Promise.all([
    getAnalyticsSummaryAction(family.id, timeframe),
    getCashflowTrendAction(family.id, timeframe),
    getCategoryBreakdownAction(family.id, timeframe),
    getNetWorthSummaryAction(family.id),
  ]);

  const summary = summaryRes.data;
  const cashflow = cashflowRes.data || [];
  const categoryBreakdown = breakdownRes.data || [];
  const netWorth = netWorthRes.data;

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
                Laporan & Grafik Finansial
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
              </p>
            </div>
          </div>

          <TimeframeSelector currentTimeframe={timeframe} />
        </div>

        {/* 4 Key Metrics */}
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
      </div>
    </div>
  );
}
