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
  const [totalAmount, setTotalAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

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
      const res = await createDebtAction({
        familyId,
        name: name.trim(),
        type,
        totalAmount: totalNum,
        interestRate: 0,
        monthlyPayment: parseFloat(monthlyPayment) || 0,
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
          <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-emerald-500/20">
            <Plus className="h-4 w-4" />
            Catat Hutang / Piutang
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Catat Kewajiban Hutang & Piutang
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="debt-type">Jenis Kewajiban</Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger id="debt-type">
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loan_payable">Hutang (Kita Berhutang ke Pihak Lain)</SelectItem>
                <SelectItem value="debt_receivable">Piutang (Orang Lain Berhutang ke Kita)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-name">Nama Pihak / Deskripsi Pinjaman</Label>
            <Input
              id="debt-name"
              placeholder="Contoh: KPR Bank Mandiri, Pinjam Teman Budi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-total">Total Pokok Pinjaman (Rp)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                Rp
              </span>
              <Input
                id="debt-total"
                type="number"
                min="1"
                placeholder="Contoh: 10000000"
                className="pl-12 text-xl font-bold h-12 rounded-2xl"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-monthly">Estimasi Cicilan Bulanan (Rp) (Opsional)</Label>
            <Input
              id="debt-monthly"
              type="number"
              min="0"
              placeholder="Contoh: 1000000"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="debt-start">Tanggal Pinjam</Label>
              <Input
                id="debt-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="debt-due">Jatuh Tempo (Opsional)</Label>
              <Input
                id="debt-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-notes">Catatan Tambahan</Label>
            <Input
              id="debt-notes"
              placeholder="Contoh: Bunga 0%, jaminan BPKB"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
                "Simpan Data"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
