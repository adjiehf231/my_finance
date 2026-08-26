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
import { updateDebtAction, type DebtWithProgress } from "../actions/debt-actions";
import { toast } from "sonner";

interface EditDebtModalProps {
  debt: DebtWithProgress;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditDebtModal({
  debt,
  open,
  onOpenChange,
  onSuccess,
}: EditDebtModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(debt.name);
  const [totalAmount, setTotalAmount] = useState(String(debt.total_amount || ""));
  const [monthlyPayment, setMonthlyPayment] = useState(String(debt.monthly_payment || ""));
  const [interestRate, setInterestRate] = useState(String(debt.interest_rate || "0"));
  const [dueDate, setDueDate] = useState(debt.due_date ? debt.due_date.split("T")[0] : "");
  const [status, setStatus] = useState<"active" | "settled">(debt.status);
  const [notes, setNotes] = useState(debt.notes || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalNum = parseFloat(totalAmount.replace(/[^0-9.-]+/g, "")) || 0;

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
      const res = await updateDebtAction({
        debtId: debt.id,
        name: name.trim(),
        totalAmount: totalNum,
        monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment.replace(/[^0-9.-]+/g, "")) : 0,
        interestRate: interestRate ? parseFloat(interestRate) : 0,
        dueDate: dueDate || null,
        status,
        notes: notes.trim() || null,
      });

      if (res.success) {
        toast.success("Data hutang/piutang berhasil diperbarui!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal memperbarui hutang/piutang");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const isPayable = debt.type === "loan_payable";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-600" />
            Edit {isPayable ? "Hutang Saya" : "Piutang Orang"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nama Pihak */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-debt-name" className="text-xs font-bold text-slate-500 uppercase">
              {isPayable ? "Pemberi Pinjaman / Bank" : "Nama Peminjam / Debitur"}
            </Label>
            <Input
              id="edit-debt-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bank Mandiri, Budi Santoso"
              className="rounded-2xl"
              required
            />
          </div>

          {/* Total Nominal */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-debt-total" className="text-xs font-bold text-slate-500 uppercase">
              Total Pokok Pinjaman (Rp)
            </Label>
            <Input
              id="edit-debt-total"
              type="text"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="50000000"
              className="rounded-2xl font-bold"
              required
            />
          </div>

          {/* Cicilan Bulanan & Bunga */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-debt-monthly" className="text-xs font-bold text-slate-500 uppercase">
                Cicilan Bulanan (Rp)
              </Label>
              <Input
                id="edit-debt-monthly"
                type="text"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                placeholder="2500000"
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-debt-interest" className="text-xs font-bold text-slate-500 uppercase">
                Bunga (%) / thn
              </Label>
              <Input
                id="edit-debt-interest"
                type="number"
                step="0.1"
                min="0"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="5.5"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Jatuh Tempo & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-debt-due" className="text-xs font-bold text-slate-500 uppercase">
                Jatuh Tempo
              </Label>
              <Input
                id="edit-debt-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Status Pelunasan
              </Label>
              <Select
                value={status}
                onValueChange={(val: any) => setStatus(val)}
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="active">Aktif (Belum Lunas)</SelectItem>
                  <SelectItem value="settled">Lunas (Selesai)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Catatan */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-debt-notes" className="text-xs font-bold text-slate-500 uppercase">
              Catatan Tambahan
            </Label>
            <Input
              id="edit-debt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: No. Kontrak KPR 12345"
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
              className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5"
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
