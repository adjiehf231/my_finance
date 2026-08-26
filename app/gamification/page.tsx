import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getFamilyGamificationAction } from "@/features/gamification/actions/gamification-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { LevelProgressCard } from "@/features/gamification/components/level-progress-card";
import { AchievementBadgesGrid } from "@/features/gamification/components/achievement-badges-grid";
import { Trophy, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Level Keuangan & Lencana Pencapaian",
  description: "Gamifikasi finansial keluarga, raih level tertinggi dan buka seluruh achievement badges.",
};

export default async function GamificationPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const gamificationRes = await getFamilyGamificationAction(family.id);

  if (!gamificationRes.success || !gamificationRes.data) {
    redirect("/dashboard");
  }

  const { level, badges, unlockedCount, totalBadges } = gamificationRes.data;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Level & Lencana Keuangan
            <Trophy className="h-6 w-6 text-amber-500" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tingkatkan kedisiplinan dan kolaborasi finansial keluarga {family.name}
          </p>
        </div>
      </div>

      {/* Level Progress Hero Card */}
      <LevelProgressCard
        level={level}
        unlockedCount={unlockedCount}
        totalBadges={totalBadges}
      />

      {/* Badges Grid Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Lencana Pencapaian Finansial ({unlockedCount}/{totalBadges})
          </h3>
        </div>

        <AchievementBadgesGrid badges={badges} />
      </div>
    </AppLayout>
  );
}
