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
import { Loader2, Edit3 } from "lucide-react";
import {
  updateRecurringTransactionAction,
  type RecurringWithDetails,
} from "../actions/recurring-actions";
import { toast } from "sonner";

interface EditRecurringModalProps {
  recurring: RecurringWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditRecurringModal({
  recurring,
  open,
  onOpenChange,
  onSuccess,
}: EditRecurringModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(recurring.name);
  const [amount, setAmount] = useState(String(recurring.amount || ""));
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    recurring.frequency
  );
  const [endDate, setEndDate] = useState(
    recurring.end_date ? recurring.end_date.split("T")[0] : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;

    if (amountNum <= 0) {
      toast.error("Nominal transaksi harus lebih dari 0");
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateRecurringTransactionAction({
        recurringId: recurring.id,
        name,
        amount: amountNum,
        frequency,
        endDate: endDate || null,
      });

      if (res.success) {
        toast.success("Jadwal transaksi berhasil diperbarui!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal memperbarui jadwal");
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
            Edit Jadwal Transaksi
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-rec-name" className="text-xs font-bold text-slate-500 uppercase">
              Nama Tagihan / Jadwal
            </Label>
            <Input
              id="edit-rec-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Tagihan WiFi Indihome"
              className="rounded-2xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-rec-amount" className="text-xs font-bold text-slate-500 uppercase">
              Nominal Transaksi (Rp)
            </Label>
            <Input
              id="edit-rec-amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="350000"
              className="rounded-2xl font-bold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Frekuensi Berulang
            </Label>
            <Select
              value={frequency}
              onValueChange={(val: any) => setFrequency(val)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="daily">Harian (Setiap Hari)</SelectItem>
                <SelectItem value="weekly">Mingguan (Setiap Minggu)</SelectItem>
                <SelectItem value="monthly">Bulanan (Setiap Bulan)</SelectItem>
                <SelectItem value="yearly">Tahunan (Setiap Tahun)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-rec-end" className="text-xs font-bold text-slate-500 uppercase">
              Tanggal Berakhir (Opsional)
            </Label>
            <Input
              id="edit-rec-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-2xl"
            />
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
              disabled={isLoading}
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
