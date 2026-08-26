"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  exportTransactionsCSVAction,
  exportFamilyDataTakeoutAction,
} from "../actions/export-actions";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface ExportModalProps {
  familyId: string;
  triggerButton?: React.ReactNode;
}

export function ExportModal({ familyId, triggerButton }: ExportModalProps) {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleDownloadCsv = async () => {
    try {
      setIsExporting("csv");
      const res = await exportTransactionsCSVAction(familyId);

      if (res.success && res.csv) {
        const blob = new Blob([res.csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", res.fileName || "Transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t("exportModal.csvSuccess"));
      } else {
        toast.error(t("exportModal.csvError"));
      }
    } catch {
      toast.error(t("exportModal.genericError"));
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadJsonTakeout = async () => {
    try {
      setIsExporting("json");
      const res = await exportFamilyDataTakeoutAction(familyId);

      if (res.success && res.jsonString) {
        const blob = new Blob([res.jsonString], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", res.fileName || "DataTakeout.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t("exportModal.jsonSuccess"));
      } else {
        toast.error(t("exportModal.jsonError"));
      }
    } catch {
      toast.error(t("exportModal.genericError"));
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200 dark:border-slate-800 flex items-center gap-2 font-semibold"
          >
            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            {t("exportModal.triggerBtn")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {t("exportModal.modalTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-500">
            {t("exportModal.modalDesc")}
          </p>

          {/* Option 1: CSV */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t("exportModal.csvTitle")}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t("exportModal.csvDesc")}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleDownloadCsv}
              disabled={isExporting === "csv"}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shrink-0"
            >
              {isExporting === "csv" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("exportModal.downloadCsv")
              )}
            </Button>
          </div>

          {/* Option 2: JSON Takeout */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <FileJson className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t("exportModal.jsonTitle")}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t("exportModal.jsonDesc")}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadJsonTakeout}
              disabled={isExporting === "json"}
              className="rounded-xl font-semibold shrink-0"
            >
              {isExporting === "json" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("exportModal.downloadJson")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
