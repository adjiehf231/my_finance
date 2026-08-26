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
import { formatCurrency, formatDate } from "@/lib/utils";
import { scanBatchReceiptsAction, createBatchTransactionsAction } from "../actions/ai-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  Scan,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface ScannedItemEntry {
  id: string;
  merchantName: string;
  transactionDate: string;
  totalAmount: number;
  categorySuggestion: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  previewUrl?: string;
}

interface ReceiptScannerModalProps {
  familyId: string;
  wallets: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: string }>;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function ReceiptScannerModal({
  familyId,
  wallets,
  categories,
  onSuccess,
  triggerButton,
}: ReceiptScannerModalProps) {
  const [open, setOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [batchResults, setBatchResults] = useState<ScannedItemEntry[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || "");
  const { t, locale } = useTranslation();

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 5) {
      toast.error(locale === "en" ? "Maximum 5 receipts per batch" : "Maksimal 5 foto struk sekaligus dalam 1 batch");
      return;
    }

    try {
      setIsScanning(true);
      const readPromises = Array.from(files).map(
        (file) =>
          new Promise<{ base64Data: string; mimeType: string }>((resolve, reject) => {
            if (file.size > 5 * 1024 * 1024) {
              reject(new Error(`File ${file.name} > 5MB`));
              return;
            }
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                base64Data: reader.result as string,
                mimeType: file.type || "image/jpeg",
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );

      const encodedImages = await Promise.all(readPromises);
      const res = await scanBatchReceiptsAction(encodedImages);

      if (res.success && res.results) {
        const parsedEntries: ScannedItemEntry[] = res.results.map((r, idx) => ({
          id: `scan-${Date.now()}-${idx}`,
          merchantName: r.data?.merchantName || `Receipt ${idx + 1}`,
          transactionDate: r.data?.transactionDate || new Date().toISOString().split("T")[0],
          totalAmount: r.data?.totalAmount || 0,
          categorySuggestion: r.data?.categorySuggestion || "Makanan & Minuman",
          items: r.data?.items || [],
          previewUrl: encodedImages[idx]?.base64Data,
        }));

        setBatchResults(parsedEntries);
        toast.success(
          locale === "en"
            ? `Successfully scanned ${parsedEntries.length} receipts with Gemini AI!`
            : `Berhasil memindai ${parsedEntries.length} nota struk dengan Gemini AI!`
        );
      } else {
        toast.error("Failed to process receipt OCR");
      }
    } catch (err: any) {
      toast.error(err.message || "Error processing receipts");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRemoveEntry = (id: string) => {
    setBatchResults((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBatchSave = async () => {
    if (batchResults.length === 0) return;

    if (!selectedWalletId) {
      toast.error(locale === "en" ? "Select payment account" : "Pilih dompet / rekening untuk pembayaran");
      return;
    }

    try {
      setIsSaving(true);
      const transactions = batchResults.map((item) => {
        const matchedCat = categories.find(
          (c) =>
            c.type === "expense" &&
            c.name.toLowerCase().includes(item.categorySuggestion.toLowerCase())
        ) || categories.find((c) => c.type === "expense");

        return {
          amount: item.totalAmount,
          transactionDate: item.transactionDate,
          categoryId: matchedCat?.id || null,
          description: `Belanja di ${item.merchantName}`,
          attachmentUrl: item.previewUrl,
        };
      });

      const res = await createBatchTransactionsAction({
        familyId,
        walletId: selectedWalletId,
        transactions,
      });

      if (res.success) {
        toast.success(
          locale === "en"
            ? `Recorded ${res.count} transactions to ledger!`
            : `Berhasil mencatat ${res.count} transaksi dari batch struk!`
        );
        setOpen(false);
        setBatchResults([]);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to save transactions");
      }
    } catch {
      toast.error("System error");
    } finally {
      setIsSaving(false);
    }
  };

  const grandTotal = batchResults.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200/80 dark:border-white/[0.08] text-slate-900 dark:text-white bg-white/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] flex items-center gap-2 font-bold text-xs shadow-sm hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{t("ai.scanTitle")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-between font-display">
            <span className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-blue-500" />
              {t("batchOcr.title")}
            </span>
            {batchResults.length > 0 && (
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                {t("batchOcr.scannedCount", { count: batchResults.length })}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {batchResults.length === 0 ? (
          <div className="py-8 text-center space-y-4">
            <label className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-white/[0.1] rounded-3xl hover:bg-slate-50 dark:hover:bg-white/[0.02] hover:border-blue-500/40 transition-all group">
              {isScanning ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                  <p className="font-black text-sm text-slate-900 dark:text-white font-display">
                    {t("batchOcr.scanningText")}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {t("batchOcr.scanningSubtitle")}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="h-7 w-7" />
                  </div>
                  <p className="font-black text-sm text-slate-900 dark:text-white font-display">
                    {t("batchOcr.uploadPrompt")}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {t("batchOcr.uploadSubtitle")}
                  </p>
                </div>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleMultipleFiles}
                disabled={isScanning}
              />
            </label>
          </div>
        ) : (
          /* Batch Review Queue */
          <div className="space-y-4 pt-2">
            {/* Grand Total Summary */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 font-display">
                  {t("batchOcr.totalBatch")}
                </p>
                <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(grandTotal)}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {t("batchOcr.readyToSave", { count: batchResults.length })}
              </span>
            </div>

            {/* Individual Receipt Cards */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {batchResults.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white font-display">
                        {item.merchantName}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {formatDate(item.transactionDate)} • {item.categorySuggestion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-base font-mono text-slate-900 dark:text-white">
                      {formatCurrency(item.totalAmount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Wallet Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("batchOcr.walletLabel")}
              </label>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                className="w-full h-12 px-3 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#07090E]/80 text-xs font-bold text-slate-900 dark:text-white"
              >
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBatchResults([])}
                className="rounded-2xl font-bold text-xs"
              >
                {t("batchOcr.scanNew")}
              </Button>
              <Button
                onClick={handleBatchSave}
                disabled={isSaving}
                className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-glow"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    {t("batchOcr.savingAll", { count: batchResults.length })}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                    {t("batchOcr.saveAll", { count: batchResults.length })}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
