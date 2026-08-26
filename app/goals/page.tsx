import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getGoalsAction } from "@/features/goals/actions/goal-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { GoalCard } from "@/features/goals/components/goal-card";
import { AddGoalModal } from "@/features/goals/components/add-goal-modal";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, PiggyBank } from "lucide-react";

export const metadata: Metadata = {
  title: "Target Tabungan & Impian Finansial",
  description: "Rencanakan tabungan dana darurat, liburan, dan aset bersama keluarga.",
};

export default async function GoalsPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const [walletsRes, goalsRes] = await Promise.all([
    getWalletsAction(family.id),
    getGoalsAction(family.id),
  ]);

  const wallets = (walletsRes.data || []).map((w) => ({
    id: w.id,
    name: w.name,
    current_balance: Number(w.current_balance || 0),
  }));

  const goals = goalsRes.data || [];

  const totalTarget = goals.reduce((acc, g) => acc + g.target_amount, 0);
  const totalCollected = goals.reduce((acc, g) => acc + g.current_amount, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  return (
    <AppLayout>
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Target Tabungan Impian
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
              </p>
            </div>
          </div>

          <AddGoalModal familyId={family.id} />
        </div>

        {/* Goals Overview Banner */}
        <Card className="rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-6 sm:p-8 border-none relative overflow-hidden shadow-xl shadow-blue-500/10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Total Akumulasi Tabungan Impian
              </p>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  {formatCurrency(totalCollected)}
                </h2>
                <span className="text-sm text-blue-200">
                  dari target {formatCurrency(totalTarget)}
                </span>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 self-start sm:self-auto">
              <Sparkles className="h-8 w-8 text-amber-300" />
              <div>
                <p className="text-xs text-blue-100">Pencapaian Kolektif</p>
                <p className="text-xl font-black">{overallPercentage}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Goals Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Daftar Target Tabungan ({goals.length})
            </h3>
          </div>

          {goals.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 p-12 text-center">
              <CardContent className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Belum Ada Target Tabungan
                </h4>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Buat target untuk dana darurat, liburan keluarga, atau impian finansial masa depan.
                </p>
                <AddGoalModal familyId={family.id} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
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
