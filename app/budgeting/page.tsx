import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getBudgetsAction } from "@/features/budgets/actions/budget-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { BudgetProgressCard } from "@/features/budgets/components/budget-progress-card";
import { BudgetWarningBanner } from "@/features/budgets/components/budget-warning-banner";
import { UpsertBudgetModal } from "@/features/budgets/components/upsert-budget-modal";
import { MonthSelector } from "@/features/budgets/components/month-selector";
import { formatCurrency } from "@/lib/utils";
import { PieChart, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Perencanaan Anggaran Bulanan",
  description: "Atur batas limit anggaran belanja bulanan per kategori keluarga.",
};

export default async function BudgetingPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;

  // Default to current month: "YYYY-MM-01"
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const currentPeriod = params.month || defaultMonth;

  const [categoriesRes, budgetsRes] = await Promise.all([
    getCategoriesAction(family.id, "expense"),
    getBudgetsAction(family.id, currentPeriod),
  ]);

  const expenseCategories = categoriesRes.data || [];
  const budgets = budgetsRes.data || [];
  const summary = budgetsRes.summary || { totalBudget: 0, totalSpent: 0, overallPercentage: 0 };

  return (
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="budgeting.title"
        subtitleKey="budgeting.subtitle"
        iconName="budgeting"
        familyName={family.name}
      >
        <MonthSelector currentPeriod={currentPeriod} />
        <UpsertBudgetModal
          familyId={family.id}
          periodMonth={currentPeriod}
          expenseCategories={expenseCategories}
        />
      </PageHeader>

      {/* Smart Budget Warning Banners */}
      <BudgetWarningBanner budgets={budgets} />

      {/* Overall Budget Health Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#0D111A] to-[#0A1224] text-white p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden shadow-xl shadow-slate-950/20">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Ringkasan Realisasi Total Anggaran Periode Ini
            </p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
                {formatCurrency(summary.totalSpent)}
              </h2>
              <span className="text-sm font-semibold text-slate-400">
                dari batas limit {formatCurrency(summary.totalBudget)}
              </span>
            </div>
          </div>

          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] px-5 py-3.5 rounded-2xl flex items-center gap-3.5 self-start sm:self-auto">
            {summary.overallPercentage > 100 ? (
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-display">
                Realisasi Pengeluaran
              </p>
              <p className="text-xl font-black font-mono">
                {summary.overallPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-display">
            Batas Anggaran Kategori ({budgets.length})
          </h3>
        </div>

        {budgets.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] p-12 text-center bg-white/50 dark:bg-[#0D111A]/50 backdrop-blur-xl">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <PieChart className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 font-display">
                Belum Ada Batas Anggaran Ditetapkan
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 font-medium">
                Tentukan batas pengeluaran untuk pos makanan, transportasi, dan kebutuhan rumah tangga.
              </p>
              <UpsertBudgetModal
                familyId={family.id}
                periodMonth={currentPeriod}
                expenseCategories={expenseCategories}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((b) => (
              <BudgetProgressCard key={b.id} budget={b} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
