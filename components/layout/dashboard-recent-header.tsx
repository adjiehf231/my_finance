"use client";

import { useTranslation } from "@/lib/i18n/i18n-context";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DashboardRecentHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-display">
          {t("dashboardPage.recentTxTitle")}
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          {t("dashboardPage.recentTxSubtitle")}
        </p>
      </div>
      <Link
        href="/transactions"
        className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 dark:bg-blue-400/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 transition-all hover:scale-105"
      >
        {t("dashboardPage.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
