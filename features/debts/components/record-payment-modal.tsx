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
import { CreditCard, Loader2 } from "lucide-react";
import { recordDebtPaymentAction } from "../actions/debt-actions";
import { toast } from "sonner";

interface RecordPaymentModalProps {
  debtId: string;
  debtName: string;
  type: "debt_receivable" | "loan_payable";
  remainingAmount: number;
  familyId: string;
  wallets: Array<{ id: string; name: string; current_balance: number }>;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function RecordPaymentModal({
  debtId,
  debtName,
  type,
  remainingAmount,
  familyId,
  wallets,
  onSuccess,
  triggerButton,
}: RecordPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const isLoan = type === "loan_payable";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;

    if (amountNum <= 0) {
      toast.error("Nominal pembayaran harus lebih dari 0");
      return;
    }

    if (amountNum > remainingAmount) {
      toast.error("Nominal melebihi sisa pokok");
      return;
    }

    if (!walletId) {
      toast.error("Pilih rekening");
      return;
    }

    try {
      setIsLoading(true);
      const res = await recordDebtPaymentAction({
        debtId,
        familyId,
        walletId,
        amount: amountNum,
        paymentDate: new Date().toISOString().split("T")[0],
        notes: notes.trim() || null,
      });

      if (res.success) {
        toast.success(
          isLoan
            ? `Pembayaran cicilan Rp ${amountNum.toLocaleString("id-ID")} berhasil dicatat!`
            : `Penerimaan piutang Rp ${amountNum.toLocaleString("id-ID")} berhasil dicatat!`
        );
        setAmount("");
        setNotes("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal mencatat pembayaran");
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
          <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 shadow-sm">
            <CreditCard className="h-4 w-4" />
            {isLoan ? "Bayar Cicilan" : "Terima Pembayaran"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isLoan ? `Bayar Cicilan Hutang: ${debtName}` : `Terima Piutang: ${debtName}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="pay-wallet">{isLoan ? "Bayar Dari Rekening" : "Masuk Ke Rekening"}</Label>
            <Select value={walletId} onValueChange={setWalletId}>
              <SelectTrigger id="pay-wallet">
                <SelectValue placeholder="Pilih rekening" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name} (Saldo: Rp {Number(w.current_balance || 0).toLocaleString("id-ID")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="pay-amount">Nominal Pembayaran (Rp)</Label>
              <button
                type="button"
                onClick={() => setAmount(String(remainingAmount))}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                Bayar Lunas (Rp {remainingAmount.toLocaleString("id-ID")})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                Rp
              </span>
              <Input
                id="pay-amount"
                type="number"
                min="1"
                max={remainingAmount}
                placeholder="Contoh: 1000000"
                className="pl-12 text-xl font-bold h-12 rounded-2xl"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pay-notes">Catatan (Opsional)</Label>
            <Input
              id="pay-notes"
              placeholder="Contoh: Cicilan ke-3, pelunasan transfer BCA"
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
                  Memproses...
                </>
              ) : (
                "Konfirmasi Pembayaran"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
