"use client";

import { useTranslation } from "@/lib/i18n/i18n-context";
import { ShieldCheck } from "lucide-react";

export function SettingsPrivacySection() {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
        {t("settingsPage.privacySection")}
      </h3>
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              {t("settingsPage.privacyTitle")}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {t("settingsPage.privacyDesc")}
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-500/20">
            {t("settingsPage.protected")}
          </span>
        </div>
      </div>
    </div>
  );
}
