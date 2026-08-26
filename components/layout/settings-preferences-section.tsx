"use client";

import { useTranslation } from "@/lib/i18n/i18n-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ExportModal } from "@/features/export/components/export-modal";
import { RestoreModal } from "@/features/export/components/restore-modal";
import { Download, Globe, SunMoon } from "lucide-react";

interface SettingsPreferencesSectionProps {
  familyId: string;
}

export function SettingsPreferencesSection({ familyId }: SettingsPreferencesSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Section 1: Preferences & Interface */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          {t("settingsPage.uiSection")}
        </h3>
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm divide-y divide-slate-100 dark:divide-white/[0.06] space-y-4">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {t("settingsPage.languageTitle")}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {t("settingsPage.languageDesc")}
              </p>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Theme */}
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SunMoon className="h-4 w-4 text-amber-500" />
                {t("settingsPage.themeTitle")}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {t("settingsPage.themeDesc")}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Section 2: Data Center & Backup */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          {t("settingsPage.dataSection")}
        </h3>
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t("settingsPage.exportTitle")}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-medium">
                {t("settingsPage.exportDesc")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RestoreModal familyId={familyId} />
              <ExportModal familyId={familyId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
