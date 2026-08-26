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
import { Plus, Loader2 } from "lucide-react";
import { createDebtAction } from "../actions/debt-actions";
import { toast } from "sonner";

interface AddDebtModalProps {
  familyId: string;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function AddDebtModal({
  familyId,
  onSuccess,
  triggerButton,
}: AddDebtModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"loan_payable" | "debt_receivable">("loan_payable");
  const [totalAmount, setTotalAmount] = useState<number | string>("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | string>("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalNum = typeof totalAmount === "number" ? totalAmount : parseFloat(String(totalAmount).replace(/[^0-9.-]+/g, "")) || 0;
    const monthlyNum = typeof monthlyPayment === "number" ? monthlyPayment : parseFloat(String(monthlyPayment).replace(/[^0-9.-]+/g, "")) || 0;

    if (totalNum <= 0) {
      toast.error("Total nominal harus lebih dari 0");
      return;
    }

    if (!name.trim()) {
      toast.error("Nama pihak/pinjaman tidak boleh kosong");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createDebtAction({
        familyId,
        name: name.trim(),
        type,
        totalAmount: totalNum,
        interestRate: 0,
        monthlyPayment: monthlyNum,
        startDate,
        dueDate: dueDate || null,
        notes: notes.trim() || null,
      });

      if (res.success) {
        toast.success(
          type === "loan_payable"
            ? `Hutang "${name}" berhasil dicatat!`
            : `Piutang "${name}" berhasil dicatat!`
        );
        setName("");
        setTotalAmount("");
        setMonthlyPayment("");
        setNotes("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal mencatat hutang/piutang");
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
            Catat Hutang / Piutang
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            Catat Kewajiban Hutang & Piutang
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="debt-type" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Jenis Kewajiban
            </Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger id="debt-type" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                <SelectItem value="loan_payable">Hutang (Kita Berhutang ke Pihak Lain)</SelectItem>
                <SelectItem value="debt_receivable">Piutang (Orang Lain Berhutang ke Kita)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-name" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Nama Pihak / Deskripsi Pinjaman
            </Label>
            <Input
              id="debt-name"
              placeholder="Contoh: KPR Bank Mandiri, Pinjam Teman Budi"
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-total" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Total Pokok Pinjaman
            </Label>
            <CurrencyInput
              id="debt-total"
              value={totalAmount}
              onValueChange={setTotalAmount}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-monthly" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Estimasi Cicilan Bulanan (Opsional)
            </Label>
            <CurrencyInput
              id="debt-monthly"
              value={monthlyPayment}
              onValueChange={setMonthlyPayment}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="debt-start" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                Tanggal Pinjam
              </Label>
              <Input
                id="debt-start"
                type="date"
                className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="debt-due" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                Jatuh Tempo (Opsional)
              </Label>
              <Input
                id="debt-due"
                type="date"
                className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-notes" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Catatan Tambahan
            </Label>
            <Input
              id="debt-notes"
              placeholder="Contoh: Bunga 0%, jaminan BPKB"
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
                "Simpan Data"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
