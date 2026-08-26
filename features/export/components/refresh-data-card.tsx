"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { refreshFamilyDataAction } from "../actions/export-actions";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function RefreshDataCard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await refreshFamilyDataAction();
      if (res.success) {
        setLastRefreshed(res.timestamp);
        toast.success(t("refreshCard.successMsg", { time: res.timestamp }));
      } else {
        toast.error(t("refreshCard.errorMsg"));
      }
    } catch {
      toast.error(t("refreshCard.errorMsg"));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm">
      <CardContent className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <RefreshCw className={`h-6 w-6 ${isRefreshing ? "animate-spin" : ""}`} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              {t("refreshCard.title")}
              <Sparkles className="h-4 w-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("refreshCard.subtitle")}
            </p>
            {lastRefreshed && (
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {t("refreshCard.lastRefreshed", { time: lastRefreshed })}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 shrink-0"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("refreshCard.syncing")}
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("refreshCard.btn")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
