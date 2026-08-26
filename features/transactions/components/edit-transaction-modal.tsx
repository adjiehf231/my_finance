"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Loader2, Edit3, Upload, Image as ImageIcon } from "lucide-react";
import { updateTransactionAction, type TransactionWithDetails } from "../actions/transaction-actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface EditTransactionModalProps {
  transaction: TransactionWithDetails;
  categories: Array<{ id: string; name: string; type: "income" | "expense"; color: string }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditTransactionModal({
  transaction,
  categories,
  open,
  onOpenChange,
  onSuccess,
}: EditTransactionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [amount, setAmount] = useState(String(transaction.amount || ""));
  const [transactionDate, setTransactionDate] = useState(
    transaction.transaction_date ? transaction.transaction_date.split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [categoryId, setCategoryId] = useState(transaction.category_id || "");
  const [description, setDescription] = useState(transaction.description || "");
  const [attachmentUrl, setAttachmentUrl] = useState(transaction.attachment_url || "");

  const filteredCategories = categories.filter((c) =>
    transaction.type === "transfer" ? false : c.type === transaction.type
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
      const fileName = `${transaction.family_id}/${Date.now()}_receipt.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("receipts")
        .upload(fileName, file, { upsert: true });

      if (error) {
        toast.error("Gagal mengupload struk: " + error.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(data.path);

      setAttachmentUrl(publicUrlData.publicUrl);
      toast.success("Foto struk berhasil diunggah!");
    } catch {
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Nominal transaksi harus lebih dari 0");
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateTransactionAction({
        transactionId: transaction.id,
        amount: numericAmount,
        transactionDate,
        categoryId: categoryId || undefined,
        description: description || undefined,
        attachmentUrl: attachmentUrl || undefined,
      });

      if (res.success) {
        toast.success("Transaksi berhasil diperbarui!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal memperbarui transaksi");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-emerald-600" />
            Edit Transaksi
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nominal */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-amount" className="text-xs font-bold text-slate-500 uppercase">
              Nominal Transaksi (Rp)
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                Rp
              </span>
              <Input
                id="edit-amount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.000"
                className="pl-11 rounded-2xl font-bold text-lg"
                required
              />
            </div>
          </div>

          {/* Tanggal */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-date" className="text-xs font-bold text-slate-500 uppercase">
              Tanggal Transaksi
            </Label>
            <Input
              id="edit-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="rounded-2xl"
              required
            />
          </div>

          {/* Kategori (If not transfer) */}
          {transaction.type !== "transfer" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Kategori
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl max-h-56">
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Keterangan */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc" className="text-xs font-bold text-slate-500 uppercase">
              Keterangan / Catatan
            </Label>
            <Input
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Belanja mingguan supermarket"
              className="rounded-2xl"
            />
          </div>

          {/* Struk Lampiran Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Foto Struk / Nota Pembayaran
            </Label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-colors">
                <Upload className="h-4 w-4" />
                <span>{isUploading ? "Mengunggah..." : "Unggah Struk"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
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

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
