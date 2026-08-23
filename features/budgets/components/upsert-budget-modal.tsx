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
  const [amountLimit, setAmountLimit] = useState("");
  const [notifyThreshold, setNotifyThreshold] = useState("80");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(amountLimit.replace(/[^0-9.-]+/g, "")) || 0;

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
          <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-emerald-500/20">
            <Plus className="h-4 w-4" />
            Atur Anggaran
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Atur Batas Anggaran Bulanan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="budget-cat">Kategori Pengeluaran</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="budget-cat">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="budget-amount">Batas Maksimal Pengeluaran (Rp)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                Rp
              </span>
              <Input
                id="budget-amount"
                type="number"
                min="1"
                placeholder="Contoh: 1500000"
                className="pl-12 text-xl font-bold h-12 rounded-2xl"
                value={amountLimit}
                onChange={(e) => setAmountLimit(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="budget-threshold">Peringatan Bahaya Pada Pemakaian (%)</Label>
            <Select value={notifyThreshold} onValueChange={setNotifyThreshold}>
              <SelectTrigger id="budget-threshold">
                <SelectValue placeholder="Pilih batas" />
              </SelectTrigger>
              <SelectContent>
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
                "Simpan Anggaran"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
