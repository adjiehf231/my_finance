"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import type { AchievementBadge } from "@/lib/validations/gamification";

interface AchievementBadgesGridProps {
  badges: AchievementBadge[];
}

export function AchievementBadgesGrid({ badges }: AchievementBadgesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {badges.map((badge) => {
        return (
          <Card
            key={badge.id}
            className={`rounded-3xl border transition-all p-5 relative overflow-hidden flex flex-col justify-between ${
              badge.isUnlocked
                ? "border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-[#131B2E] shadow-sm hover:shadow-md"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-70"
            }`}
          >
            <CardContent className="p-0 space-y-3.5">
              {/* Icon & Unlocked Status */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    badge.isUnlocked
                      ? "bg-emerald-50 dark:bg-emerald-950/60 shadow-inner"
                      : "bg-slate-100 dark:bg-slate-800 grayscale"
                  }`}
                >
                  {badge.icon}
                </div>

                {badge.isUnlocked ? (
                  <Badge className="bg-emerald-500 text-white font-bold text-[10px] rounded-xl px-2 py-0.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Terbuka
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-slate-400 font-semibold rounded-xl flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Terkunci
                  </Badge>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress & XP */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> +{badge.xpReward} XP
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {badge.progressPercent}%
                  </span>
                </div>

                {!badge.isUnlocked && (
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
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
