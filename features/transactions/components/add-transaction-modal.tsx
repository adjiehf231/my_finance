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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, ArrowRightLeft, TrendingDown, TrendingUp, Upload, Image as ImageIcon } from "lucide-react";
import { createTransactionAction } from "../actions/transaction-actions";
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
  const [amount, setAmount] = useState("");
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
    const parsedAmount = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;

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
          <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-emerald-500/20">
            <Plus className="h-4 w-4" />
            Catat Transaksi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Catat Transaksi Baru</DialogTitle>
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
          <TabsList className="grid grid-cols-3 w-full h-12 rounded-2xl p-1 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger
              value="expense"
              className="rounded-xl font-semibold flex items-center gap-1.5 data-[state=active]:text-rose-600 dark:data-[state=active]:text-rose-400"
            >
              <TrendingDown className="h-4 w-4" />
              Pengeluaran
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="rounded-xl font-semibold flex items-center gap-1.5 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400"
            >
              <TrendingUp className="h-4 w-4" />
              Pemasukan
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              className="rounded-xl font-semibold flex items-center gap-1.5 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transfer
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nominal Input (Large Display) */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-amount">Nominal (Rupiah)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                Rp
              </span>
              <Input
                id="tx-amount"
                type="number"
                min="1"
                placeholder="0"
                className="pl-12 text-2xl font-black h-14 rounded-2xl tracking-tight"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-date">Tanggal Transaksi</Label>
            <Input
              id="tx-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          {/* Wallet Picker for Income/Expense */}
          {type !== "transfer" ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tx-wallet">Rekening / Dompet</Label>
                <Select value={walletId} onValueChange={setWalletId}>
                  <SelectTrigger id="tx-wallet">
                    <SelectValue placeholder="Pilih rekening" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-category">Kategori</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="tx-category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="tx-from-wallet">Dari Rekening</Label>
                <Select value={fromWalletId} onValueChange={setFromWalletId}>
                  <SelectTrigger id="tx-from-wallet">
                    <SelectValue placeholder="Rekening Asal" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-to-wallet">Ke Rekening</Label>
                <Select value={toWalletId} onValueChange={setToWalletId}>
                  <SelectTrigger id="tx-to-wallet">
                    <SelectValue placeholder="Rekening Tujuan" />
                  </SelectTrigger>
                  <SelectContent>
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

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-desc">Catatan / Deskripsi</Label>
            <Input
              id="tx-desc"
              placeholder="Contoh: Makan siang nasi padang, bayar wifi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Attachment Upload */}
          <div className="space-y-1.5">
            <Label>Foto Struk / Nota (Opsional)</Label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors">
                <Upload className="h-4 w-4 text-emerald-600" />
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
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
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
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className={`rounded-xl text-white font-semibold ${
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : type === "expense"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-blue-600 hover:bg-blue-700"
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
