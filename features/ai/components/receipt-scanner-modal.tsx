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
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { scanReceiptWithAIAction } from "../actions/ai-actions";
import { createTransactionAction } from "@/features/transactions/actions/transaction-actions";
import {
  Scan,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  Receipt,
  Store,
  Calendar,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import type { ReceiptOcrResponse } from "@/lib/validations/ai";

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<ReceiptOcrResponse | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviewImage(base64);

      try {
        setIsScanning(true);
        const res = await scanReceiptWithAIAction(base64, file.type || "image/jpeg");
        if (res.success && res.data) {
          setOcrResult(res.data);
          toast.success("Nota struk berhasil dipindai oleh AI!");
        } else {
          toast.error("Gagal mengekstrak struk");
        }
      } catch {
        toast.error("Terjadi kesalahan sistem saat pemindaian");
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTransaction = async () => {
    if (!ocrResult) return;

    if (!selectedWalletId) {
      toast.error("Pilih dompet / rekening untuk pembayaran");
      return;
    }

    // Match category
    const matchedCat = categories.find(
      (c) =>
        c.type === "expense" &&
        c.name.toLowerCase().includes(ocrResult.categorySuggestion.toLowerCase())
    ) || categories.find((c) => c.type === "expense");

    try {
      setIsSaving(true);
      const res = await createTransactionAction({
        familyId,
        type: "expense",
        amount: ocrResult.totalAmount || 0,
        transactionDate: ocrResult.transactionDate,
        walletId: selectedWalletId,
        categoryId: matchedCat?.id || null,
        description: `Belanja di ${ocrResult.merchantName}`,
        attachmentUrl: previewImage,
      });

      if (res.success) {
        toast.success("Transaksi struk berhasil dicatat ke keuangan!");
        setOpen(false);
        setOcrResult(null);
        setPreviewImage(null);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal mencatat transaksi");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            className="rounded-2xl border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 font-semibold shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Scan Struk AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Scan className="h-5 w-5 text-emerald-600" />
            Smart OCR Receipt Scanner
          </DialogTitle>
        </DialogHeader>

        {!ocrResult ? (
          <div className="py-8 text-center space-y-4">
            <label className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-all group">
              {isScanning ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    Memindai nota belanja dengan Gemini 1.5 Flash...
                  </p>
                  <p className="text-xs text-slate-400">
                    Mengekstrak nama toko, tanggal, item produk, dan total bayar
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="h-7 w-7" />
                  </div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    Klik untuk Ambil Foto atau Unggah Struk
                  </p>
                  <p className="text-xs text-slate-400">
                    Mendukung format JPG, PNG, WebP (Maksimal 5MB)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isScanning}
              />
            </label>
          </div>
        ) : (
          /* Extracted Data Preview */
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/60 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5" /> Toko / Merchant
                  </p>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {ocrResult.merchantName}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Total Transaksi
                  </p>
                  <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatCurrency(ocrResult.totalAmount)}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Tanggal: {formatDate(ocrResult.transactionDate)}
                </span>
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {ocrResult.categorySuggestion}
                </Badge>
              </div>
            </div>

            {/* Items List */}
            {ocrResult.items.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Item Produk ({ocrResult.items.length})
                </p>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {ocrResult.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Potong Saldo Dari Rekening:
              </label>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                className="w-full h-11 px-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] text-xs font-semibold text-slate-900 dark:text-white"
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
                onClick={() => setOcrResult(null)}
                className="rounded-xl"
              >
                Scan Ulang
              </Button>
              <Button
                onClick={handleSaveTransaction}
                disabled={isSaving}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Simpan Transaksi Ini
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
