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
import { upsertBudgetAction, type BudgetWithSpending } from "../actions/budget-actions";
import { toast } from "sonner";

interface EditBudgetModalProps {
  budget: BudgetWithSpending;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditBudgetModal({
  budget,
  open,
  onOpenChange,
  onSuccess,
}: EditBudgetModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [amountLimit, setAmountLimit] = useState(String(budget.amount_limit || ""));
  const [notifyThreshold, setNotifyThreshold] = useState(
    String(budget.notify_threshold || "80")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(amountLimit.replace(/[^0-9.-]+/g, "")) || 0;

    if (limitNum <= 0) {
      toast.error("Batas anggaran harus lebih dari 0");
      return;
    }

    try {
      setIsLoading(true);
      const res = await upsertBudgetAction({
        familyId: budget.family_id,
        categoryId: budget.category_id,
        periodMonth: budget.period_month,
        amountLimit: limitNum,
        notifyThreshold: parseInt(notifyThreshold) || 80,
      });

      if (res.success) {
        toast.success("Batas anggaran berhasil diperbarui!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal memperbarui batas anggaran");
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
            <Edit3 className="h-5 w-5 text-rose-600" />
            Edit Batas Anggaran
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Info Kategori */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-xl shrink-0"
              style={{ backgroundColor: budget.categories.color || "#EF4444" }}
            />
            <div>
              <p className="text-xs text-slate-400">Kategori Anggaran</p>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {budget.categories.name}
              </p>
            </div>
          </div>

          {/* Batas Nominal */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-budget-limit" className="text-xs font-bold text-slate-500 uppercase">
              Batas Maksimal Pengeluaran (Rp)
            </Label>
            <Input
              id="edit-budget-limit"
              type="text"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              placeholder="1500000"
              className="rounded-2xl font-bold"
              required
            />
          </div>

          {/* Ambang Batas Notifikasi */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Kirim Notifikasi Peringatan Saat
            </Label>
            <Select
              value={notifyThreshold}
              onValueChange={setNotifyThreshold}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="50">Mencapai 50% kuota</SelectItem>
                <SelectItem value="75">Mencapai 75% kuota</SelectItem>
                <SelectItem value="80">Mencapai 80% kuota (Standar)</SelectItem>
                <SelectItem value="90">Mencapai 90% kuota (Kritis)</SelectItem>
                <SelectItem value="100">Mencapai 100% (Habis)</SelectItem>
              </SelectContent>
            </Select>
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
              className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5"
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
