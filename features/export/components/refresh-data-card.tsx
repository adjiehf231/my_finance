"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { refreshFamilyDataAction } from "../actions/export-actions";
import { toast } from "sonner";

export function RefreshDataCard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await refreshFamilyDataAction();
      if (res.success) {
        setLastRefreshed(res.timestamp);
        toast.success(`Data sistem berhasil disegarkan pada ${res.timestamp}`);
      } else {
        toast.error("Gagal menyegarkan data sistem");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat menyegarkan data");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm">
      <CardContent className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
            <RefreshCw className={`h-6 w-6 ${isRefreshing ? "animate-spin" : ""}`} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Segarkan & Sinkronkan Data
              <Sparkles className="h-4 w-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Perbarui cache server dan sinkronkan mutasi transaksi, saldo dompet, serta grafik analitik.
            </p>
            {lastRefreshed && (
              <p className="text-[11px] text-teal-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Terakhir disegarkan pukul: {lastRefreshed}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 shrink-0"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyinkronkan...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Segarkan Sekarang
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
