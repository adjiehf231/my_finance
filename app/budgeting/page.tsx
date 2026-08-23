import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getBudgetsAction } from "@/features/budgets/actions/budget-actions";
import { BudgetProgressCard } from "@/features/budgets/components/budget-progress-card";
import { UpsertBudgetModal } from "@/features/budgets/components/upsert-budget-modal";
import { MonthSelector } from "@/features/budgets/components/month-selector";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PieChart, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
                Anggaran Bulanan
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <MonthSelector currentPeriod={currentPeriod} />
            <UpsertBudgetModal
              familyId={family.id}
              periodMonth={currentPeriod}
              expenseCategories={expenseCategories}
            />
          </div>
        </div>

        {/* Overall Budget Health Banner */}
        <Card className="rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 border-none relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ringkasan Total Anggaran Periode Ini
              </p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  {formatCurrency(summary.totalSpent)}
                </h2>
                <span className="text-sm text-slate-400">
                  dari limit {formatCurrency(summary.totalBudget)}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3">
              {summary.overallPercentage > 100 ? (
                <ShieldAlert className="h-8 w-8 text-rose-400" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              )}
              <div>
                <p className="text-xs text-slate-300">Realisasi Pengeluaran</p>
                <p className="text-xl font-black">
                  {summary.overallPercentage}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Budgets Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Batas Anggaran Kategori ({budgets.length})
            </h3>
          </div>

          {budgets.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 p-12 text-center">
              <CardContent className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
                  <PieChart className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Belum Ada Anggaran Ditetapkan
                </h4>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Tentukan batas pengeluaran untuk pos makanan, transportasi, dan kebutuhan rumah tangga.
                </p>
                <UpsertBudgetModal
                  familyId={family.id}
                  periodMonth={currentPeriod}
                  expenseCategories={expenseCategories}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {budgets.map((b) => (
                <BudgetProgressCard key={b.id} budget={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
