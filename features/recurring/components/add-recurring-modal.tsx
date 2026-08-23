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
import { Plus, Loader2 } from "lucide-react";
import { createRecurringTransactionAction } from "../actions/recurring-actions";
import { toast } from "sonner";

interface AddRecurringModalProps {
  familyId: string;
  wallets: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: "income" | "expense" }>;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function AddRecurringModal({
  familyId,
  wallets,
  categories,
  onSuccess,
  triggerButton,
}: AddRecurringModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;

    if (amountNum <= 0) {
      toast.error("Nominal transaksi harus lebih dari 0");
      return;
    }

    if (!name.trim()) {
      toast.error("Nama tagihan/transaksi tidak boleh kosong");
      return;
    }

    if (!walletId) {
      toast.error("Pilih rekening terkait");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createRecurringTransactionAction({
        familyId,
        walletId,
        categoryId: categoryId || null,
        name: name.trim(),
        type,
        amount: amountNum,
        frequency,
        startDate,
        endDate: endDate || null,
      });

      if (res.success) {
        toast.success(`Jadwal "${name}" berhasil dibuat!`);
        setName("");
        setAmount("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal membuat jadwal");
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
            Jadwalkan Tagihan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Jadwal Tagihan & Transaksi Berulang
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="rec-name">Nama Tagihan / Mutasi</Label>
            <Input
              id="rec-name"
              placeholder="Contoh: Tagihan Wifi Indihome, Netflix, Gaji"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-type">Jenis</Label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger id="rec-type">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Pengeluaran (Tagihan)</SelectItem>
                  <SelectItem value="income">Pemasukan (Gaji)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-freq">Frekuensi</Label>
              <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                <SelectTrigger id="rec-freq">
                  <SelectValue placeholder="Pilih frekuensi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rec-amount">Nominal Rutin (Rp)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                Rp
              </span>
              <Input
                id="rec-amount"
                type="number"
                min="1"
                placeholder="Contoh: 350000"
                className="pl-12 text-xl font-bold h-12 rounded-2xl"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-wallet">Rekening Dompet</Label>
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger id="rec-wallet">
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
              <Label htmlFor="rec-cat">Kategori</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="rec-cat">
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-start">Mulai Tanggal</Label>
              <Input
                id="rec-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-end">Selesai (Opsional)</Label>
              <Input
                id="rec-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
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
              disabled={isLoading}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Jadwalkan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
