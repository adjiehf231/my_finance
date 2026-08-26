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
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { upsertBudgetAction } from "../actions/budget-actions";
import { toast } from "sonner";

interface UpsertBudgetModalProps {
  familyId: string;
  periodMonth: string; // "YYYY-MM-01"
  expenseCategories: Array<{ id: string; name: string; color: string }>;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function UpsertBudgetModal({
  familyId,
  periodMonth,
  expenseCategories,
  onSuccess,
  triggerButton,
}: UpsertBudgetModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryId, setCategoryId] = useState(expenseCategories[0]?.id || "");
  const [amountLimit, setAmountLimit] = useState<number | string>("");
  const [notifyThreshold, setNotifyThreshold] = useState("80");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = typeof amountLimit === "number" ? amountLimit : parseFloat(String(amountLimit).replace(/[^0-9.-]+/g, "")) || 0;

    if (limitNum <= 0) {
      toast.error("Batas anggaran harus lebih dari 0");
      return;
    }

    if (!categoryId) {
      toast.error("Pilih kategori pengeluaran");
      return;
    }

    try {
      setIsLoading(true);
      const res = await upsertBudgetAction({
        familyId,
        categoryId,
        periodMonth,
        amountLimit: limitNum,
        notifyThreshold: parseInt(notifyThreshold) || 80,
      });

      if (res.success) {
        toast.success("Batas anggaran berhasil ditetapkan!");
        setAmountLimit("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal menyimpan anggaran");
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
            Atur Anggaran
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            Atur Batas Anggaran Bulanan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="budget-cat" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Kategori Pengeluaran
            </Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="budget-cat" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                {expenseCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="budget-amount" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Batas Maksimal Pengeluaran
            </Label>
            <CurrencyInput
              id="budget-amount"
              value={amountLimit}
              onValueChange={setAmountLimit}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="budget-threshold" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Peringatan Bahaya Pada Pemakaian (%)
            </Label>
            <Select value={notifyThreshold} onValueChange={setNotifyThreshold}>
              <SelectTrigger id="budget-threshold" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                <SelectValue placeholder="Pilih batas" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                <SelectItem value="70">70% Dari Limit</SelectItem>
                <SelectItem value="80">80% Dari Limit (Direkomendasikan)</SelectItem>
                <SelectItem value="90">90% Dari Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-2xl text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 shadow-glow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Anggaran"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
