"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import type { AchievementBadge } from "@/lib/validations/gamification";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface AchievementBadgesGridProps {
  badges: AchievementBadge[];
}

export function AchievementBadgesGrid({ badges }: AchievementBadgesGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {badges.map((badge) => {
        return (
          <Card
            key={badge.id}
            className={`rounded-3xl border transition-all p-5 relative overflow-hidden flex flex-col justify-between ${
              badge.isUnlocked
                ? "border-blue-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#0D111A]/90 backdrop-blur-2xl shadow-sm hover:shadow-xl hover:border-blue-500/40"
                : "border-slate-200/80 dark:border-white/[0.04] bg-slate-50/50 dark:bg-[#07090E]/60 opacity-70"
            }`}
          >
            <CardContent className="p-0 space-y-3.5">
              {/* Icon & Unlocked Status */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    badge.isUnlocked
                      ? "bg-blue-50 dark:bg-blue-950/60 shadow-inner"
                      : "bg-slate-100 dark:bg-[#07090E] grayscale"
                  }`}
                >
                  {badge.icon}
                </div>

                {badge.isUnlocked ? (
                  <Badge className="bg-emerald-500 text-white font-black text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {t("gamification.unlocked")}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-slate-400 font-bold rounded-full flex items-center gap-1 border-slate-300 dark:border-white/[0.1]">
                    <Lock className="h-3 w-3" /> {t("gamification.locked")}
                  </Badge>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white font-display">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                  {badge.description}
                </p>
              </div>

              {/* Progress & XP */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-500 flex items-center gap-1 font-mono">
                    <Sparkles className="h-3 w-3" /> +{badge.xpReward} XP
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold font-mono">
                    {badge.progressPercent}%
                  </span>
                </div>

                {!badge.isUnlocked && (
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-[#07090E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all shadow-glow"
                      style={{ width: `${badge.progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
