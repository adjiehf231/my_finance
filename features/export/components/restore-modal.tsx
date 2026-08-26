"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Loader2,
  FileCheck2,
  AlertCircle,
  Database,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { importFamilyDataRestoreAction } from "../actions/export-actions";
import { toast } from "sonner";

interface RestoreModalProps {
  familyId: string;
}

export function RestoreModal({ familyId }: RestoreModalProps) {
  const [open, setOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewStats, setPreviewStats] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error("Hanya file backup JSON (.json) yang didukung");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        setFileContent(text);
        setPreviewStats({
          wallets: Array.isArray(parsed.wallets) ? parsed.wallets.length : 0,
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions.length : 0,
          categories: Array.isArray(parsed.categories) ? parsed.categories.length : 0,
          budgets: Array.isArray(parsed.budgets) ? parsed.budgets.length : 0,
          goals: Array.isArray(parsed.goals) ? parsed.goals.length : 0,
          debts: Array.isArray(parsed.debts) ? parsed.debts.length : 0,
          exportDate: parsed.exportDate || "Tidak diketahui",
        });
      } catch {
        toast.error("File JSON rusak atau tidak dapat dibaca");
        setFileContent(null);
        setPreviewStats(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!fileContent) return;

    try {
      setIsLoading(true);
      const res = await importFamilyDataRestoreAction(familyId, fileContent);

      if (res.success && res.data) {
        setIsRestored(true);
        toast.success("Pemulihan data berhasil diselesaikan!");
      } else {
        toast.error(res.error || "Gagal memulihkan data");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat pemulihan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFileContent(null);
    setFileName(null);
    setPreviewStats(null);
    setIsRestored(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) handleReset();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50">
          <RotateCcw className="h-4 w-4 mr-2" />
          Pulihkan Data (Restore Backup)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            Pemulihan Data (Restore Backup)
          </DialogTitle>
        </DialogHeader>

        {!isRestored ? (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-500">
              Unggah file cadangan data <strong>JSON</strong> hasil ekspor My Finance untuk memulihkan rekening, transaksi, target tabungan, kategori, dan catatan hutang ke workspace keluarga ini.
            </p>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                id="restore-file-input"
              />
              <label
                htmlFor="restore-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {fileName ? fileName : "Klik untuk memilih file backup JSON"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Format file: MyFinance_DataTakeout_*.json
                  </p>
                </div>
              </label>
            </div>

            {/* Preview Found Records */}
            {previewStats && (
              <Card className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 p-4">
                <CardContent className="p-0 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <FileCheck2 className="h-4 w-4 text-indigo-600" />
                    Data yang Ditemukan dalam File:
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center shadow-xs">
                      <span className="text-slate-400 block text-[10px]">Dompet</span>
                      <strong className="text-slate-900 dark:text-white">{previewStats.wallets}</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center shadow-xs">
                      <span className="text-slate-400 block text-[10px]">Transaksi</span>
                      <strong className="text-slate-900 dark:text-white">{previewStats.transactions}</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center shadow-xs">
                      <span className="text-slate-400 block text-[10px]">Kategori</span>
                      <strong className="text-slate-900 dark:text-white">{previewStats.categories}</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center shadow-xs">
                      <span className="text-slate-400 block text-[10px]">Anggaran</span>
                      <strong className="text-slate-900 dark:text-white">{previewStats.budgets}</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center shadow-xs">
                      <span className="text-slate-400 block text-[10px]">Target</span>
                      <strong className="text-slate-900 dark:text-white">{previewStats.goals}</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center shadow-xs">
                      <span className="text-slate-400 block text-[10px]">Hutang</span>
                      <strong className="text-slate-900 dark:text-white">{previewStats.debts}</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-2xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="button"
                disabled={!fileContent || isLoading}
                onClick={handleRestore}
                className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Mulai Pemulihan Data
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Data Berhasil Dipulihkan!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Seluruh data dari cadangan telah berhasil diimpor ke workspace Anda. Semua laporan dan histori siap digunakan.
              </p>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
                window.location.reload();
              }}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6"
            >
              Selesai & Muat Ulang
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
