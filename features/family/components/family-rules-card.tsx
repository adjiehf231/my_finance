"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ShieldCheck, AlertCircle, HeartHandshake } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function FamilyRulesCard() {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <HeartHandshake className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white font-display">
            {t("familyManagement.rulesTitle")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t("familyManagement.rulesSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        {/* Guideline 1 */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#07090E]/70 border border-slate-200/70 dark:border-white/[0.06] space-y-1.5">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>{t("familyManagement.rules1Title")}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {t("familyManagement.rules1Desc")}
          </p>
        </div>

        {/* Guideline 2 */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#07090E]/70 border border-slate-200/70 dark:border-white/[0.06] space-y-1.5">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <AlertCircle className="h-4 w-4" />
            <span>{t("familyManagement.rules2Title")}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {t("familyManagement.rules2Desc")}
          </p>
        </div>

        {/* Guideline 3 */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#07090E]/70 border border-slate-200/70 dark:border-white/[0.06] space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <Sparkles className="h-4 w-4" />
            <span>{t("familyManagement.rules3Title")}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {t("familyManagement.rules3Desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
