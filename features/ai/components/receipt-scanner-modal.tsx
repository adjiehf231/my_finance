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
  Store,
  Calendar,
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
            className="rounded-2xl border-slate-200/80 dark:border-white/[0.08] text-slate-900 dark:text-white bg-white/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] flex items-center gap-2 font-bold text-xs shadow-sm hover:scale-105 transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            Scan Struk AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl rounded-3xl p-6 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Scan className="h-5 w-5 text-emerald-500" />
            Smart OCR Receipt Scanner
          </DialogTitle>
        </DialogHeader>

        {!ocrResult ? (
          <div className="py-8 text-center space-y-4">
            <label className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-white/[0.1] rounded-3xl hover:bg-slate-50 dark:hover:bg-white/[0.02] hover:border-emerald-500/40 transition-all group">
              {isScanning ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                  <p className="font-black text-sm text-slate-900 dark:text-white font-display">
                    Memindai nota belanja dengan Gemini 1.5 Flash...
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Mengekstrak nama toko, tanggal, item produk, dan total bayar
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="h-7 w-7" />
                  </div>
                  <p className="font-black text-sm text-slate-900 dark:text-white font-display">
                    Klik untuk Ambil Foto atau Unggah Struk
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
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
            <div className="p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/5 border border-emerald-500/20 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-display">
                    <Store className="h-3.5 w-3.5" /> Toko / Merchant
                  </p>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5 font-display">
                    {ocrResult.merchantName}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-700 dark:text-emerald-300 font-display">
                    Total Transaksi
                  </p>
                  <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                    {formatCurrency(ocrResult.totalAmount)}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-emerald-500/20 font-medium">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  Tanggal: {formatDate(ocrResult.transactionDate)}
                </span>
                <Badge className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                  {ocrResult.categorySuggestion}
                </Badge>
              </div>
            </div>

            {/* Items List */}
            {ocrResult.items.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">
                  Rincian Item Produk ({ocrResult.items.length})
                </p>
                <div className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs font-medium">
                  {ocrResult.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                Potong Saldo Dari Rekening:
              </label>
              <select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                className="w-full h-12 px-3 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#06080D]/80 text-xs font-bold text-slate-900 dark:text-white"
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
                className="rounded-2xl font-bold text-xs"
              >
                Scan Ulang
              </Button>
              <Button
                onClick={handleSaveTransaction}
                disabled={isSaving}
                className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-glow"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 stroke-[3]" />
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
