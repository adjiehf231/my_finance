import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getGoalsAction } from "@/features/goals/actions/goal-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { GoalCard } from "@/features/goals/components/goal-card";
import { AddGoalModal } from "@/features/goals/components/add-goal-modal";
import { formatCurrency } from "@/lib/utils";
import { Target, Sparkles } from "lucide-react";

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
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="goals.title"
        subtitleKey="goals.subtitle"
        iconName="goals"
        familyName={family.name}
      >
        <AddGoalModal familyId={family.id} />
      </PageHeader>

      {/* Goals Overview Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-600 text-white p-6 sm:p-8 border border-white/20 relative overflow-hidden shadow-xl shadow-blue-500/10">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-widest text-blue-100 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Total Akumulasi Tabungan Impian
            </p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
                {formatCurrency(totalCollected)}
              </h2>
              <span className="text-sm font-semibold text-blue-100">
                dari target {formatCurrency(totalTarget)}
              </span>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-xl border border-white/20 px-5 py-3.5 rounded-2xl flex items-center gap-3 self-start sm:self-auto shadow-sm">
            <Sparkles className="h-7 w-7 text-amber-300" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-100">Pencapaian Kolektif</p>
              <p className="text-xl font-black font-mono">{overallPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Daftar Target Tabungan ({goals.length})
          </h3>
        </div>

        {goals.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] p-12 text-center bg-white/50 dark:bg-[#0E131F]/50 backdrop-blur-xl">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                Belum Ada Target Tabungan
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 font-medium">
                Buat target untuk dana darurat, liburan keluarga, atau impian finansial masa depan.
              </p>
              <AddGoalModal familyId={family.id} />
            </div>
          </div>
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
