"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Zap } from "lucide-react";
import type { FamilyLevel } from "@/lib/validations/gamification";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface LevelProgressCardProps {
  level: FamilyLevel;
  unlockedCount: number;
  totalBadges: number;
}

export function LevelProgressCard({
  level,
  unlockedCount,
  totalBadges,
}: LevelProgressCardProps) {
  const { t, locale } = useTranslation();

  return (
    <Card className="rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 border-none relative overflow-hidden shadow-xl shadow-blue-500/20">
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <Trophy className="h-7 w-7 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100 font-display">
                  Level {level.currentLevel}
                </span>
                <Badge className="bg-amber-400/90 text-slate-950 font-black text-[10px] rounded-lg px-2">
                  LEVEL {level.currentLevel}
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5 font-display">
                {level.levelName}
              </h2>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2.5 self-start sm:self-auto text-xs">
            <Award className="h-4 w-4 text-amber-300" />
            <span className="font-bold">
              {locale === "en"
                ? `${unlockedCount} of ${totalBadges} Badges Unlocked`
                : `${unlockedCount} dari ${totalBadges} Lencana Terbuka`}
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-100">
            <span className="flex items-center gap-1 font-mono">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              {t("gamification.totalXp")}: {level.currentXp} XP
            </span>
            <span className="font-mono">
              {locale === "en"
                ? `Next Tier Target: ${level.nextLevelXp} XP`
                : `Target Level Berikutnya: ${level.nextLevelXp} XP`}
            </span>
          </div>

          <div className="h-3.5 w-full bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(100, level.progressPercent)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
