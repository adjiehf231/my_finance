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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, ArrowRightLeft, TrendingDown, TrendingUp, Upload, Image as ImageIcon, Sparkles } from "lucide-react";
import { createTransactionAction } from "../actions/transaction-actions";
import { suggestCategoryFromDescription } from "@/lib/ai/category-suggester";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface AddTransactionModalProps {
  familyId: string;
  wallets: Array<{ id: string; name: string; type: string; color: string }>;
  categories: Array<{ id: string; name: string; type: "income" | "expense"; color: string }>;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function AddTransactionModal({
  familyId,
  wallets,
  categories,
  onSuccess,
  triggerButton,
}: AddTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense");
  const [amount, setAmount] = useState<number | string>("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || "");
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || wallets[0]?.id || "");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const filteredCategories = categories.filter((c) =>
    type === "transfer" ? false : c.type === type
  );

  // Real-time Contextual Category Suggestion
  const suggestedCategory =
    type !== "transfer"
      ? suggestCategoryFromDescription(description, filteredCategories)
      : null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${familyId}/${Date.now()}_receipt.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("receipts")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        toast.error(`Gagal upload struk: ${error.message}`);
      } else if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("receipts").getPublicUrl(data.path);
        setAttachmentUrl(publicUrl);
        toast.success("Foto struk berhasil diunggah!");
      }
    } catch {
      toast.error("Gagal mengunggah struk.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, "")) || 0;

    if (parsedAmount <= 0) {
      toast.error("Nominal transaksi harus lebih dari 0");
      return;
    }

    if (type === "transfer" && fromWalletId === toWalletId) {
      toast.error("Rekening sumber dan tujuan tidak boleh sama");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createTransactionAction({
        familyId,
        type,
        amount: parsedAmount,
        transactionDate,
        walletId: type !== "transfer" ? walletId : null,
        fromWalletId: type === "transfer" ? fromWalletId : null,
        toWalletId: type === "transfer" ? toWalletId : null,
        categoryId: type !== "transfer" && categoryId ? categoryId : null,
        description: description.trim() || null,
        attachmentUrl: attachmentUrl || null,
      });

      if (res.success) {
        toast.success(
          type === "income"
            ? "Pemasukan berhasil dicatat!"
            : type === "expense"
            ? "Pengeluaran berhasil dicatat!"
            : "Transfer antar-dompet berhasil dicatat!"
        );
        setAmount("");
        setDescription("");
        setAttachmentUrl("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal menyimpan transaksi");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-105 transition-all">
            <Plus className="h-4 w-4 stroke-[3]" />
            Catat Transaksi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">Catat Transaksi Baru</DialogTitle>
        </DialogHeader>

        {/* Tab Segmented Switcher */}
        <Tabs
          value={type}
          onValueChange={(val: any) => {
            setType(val);
            setCategoryId("");
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full h-12 rounded-2xl p-1 bg-slate-100 dark:bg-[#07090E] border border-slate-200/40 dark:border-white/[0.04]">
            <TabsTrigger
              value="expense"
              className="rounded-xl font-bold text-xs flex items-center gap-1.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-glow-rose transition-all"
            >
              <TrendingDown className="h-4 w-4" />
              Pengeluaran
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="rounded-xl font-bold text-xs flex items-center gap-1.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-glow-emerald transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              Pemasukan
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="rounded-xl font-bold text-xs flex items-center gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nominal Input with Live Rupiah Formatter */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-amount" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Nominal Transaksi
            </Label>
            <CurrencyInput
              id="tx-amount"
              value={amount}
              onValueChange={setAmount}
              required
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-date" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">Tanggal Transaksi</Label>
            <Input
              id="tx-date"
              type="date"
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          {/* Description & Real-time AI Suggestion */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-desc" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Catatan / Deskripsi
            </Label>
            <Input
              id="tx-desc"
              placeholder="Contoh: Kopi Kenangan, Bensin Pertamax, Bayar Wifi PLN"
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Contextual Category Suggestion Pill */}
            {suggestedCategory && categoryId !== suggestedCategory.id && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setCategoryId(suggestedCategory.id)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500/20 transition-colors animate-pulse"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Saran Kategori AI: <strong>{suggestedCategory.name}</strong> (Klik untuk pilih)</span>
                </button>
              </div>
            )}
          </div>

          {/* Wallet Picker for Income/Expense */}
          {type !== "transfer" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tx-wallet" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">Rekening / Dompet</Label>
                <Select value={walletId} onValueChange={setWalletId}>
                  <SelectTrigger id="tx-wallet" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                    <SelectValue placeholder="Pilih rekening" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    {wallets.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-category" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">Kategori</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="tx-category" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    {filteredCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            /* Transfer Source & Destination */
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tx-from-wallet" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">Dari Rekening</Label>
                <Select value={fromWalletId} onValueChange={setFromWalletId}>
                  <SelectTrigger id="tx-from-wallet" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                    <SelectValue placeholder="Rekening Asal" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    {wallets.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-to-wallet" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">Ke Rekening</Label>
                <Select value={toWalletId} onValueChange={setToWalletId}>
                  <SelectTrigger id="tx-to-wallet" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                    <SelectValue placeholder="Rekening Tujuan" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                    {wallets.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Attachment Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">Foto Struk / Nota (Opsional)</Label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer border border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#07090E]/80 rounded-2xl px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/[0.04] flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">
                <Upload className="h-4 w-4 text-blue-500" />
                <span>{isUploading ? "Mengunggah..." : "Unggah Gambar"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>

              {attachmentUrl && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold">
                  <ImageIcon className="h-4 w-4" />
                  <span>Struk Terlampir</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-2xl border-slate-200/80 dark:border-white/[0.08] font-bold text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className={`rounded-2xl font-black text-xs transition-all ${
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-emerald"
                  : type === "expense"
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-glow-rose"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-glow"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Transaksi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
