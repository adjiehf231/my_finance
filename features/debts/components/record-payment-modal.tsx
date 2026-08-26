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
import { CreditCard, Loader2 } from "lucide-react";
import { recordDebtPaymentAction } from "../actions/debt-actions";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/i18n-context";
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
  const { t, locale } = useTranslation();

  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [amount, setAmount] = useState<number | string>("");
  const [notes, setNotes] = useState("");

  const isLoan = type === "loan_payable";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, "")) || 0;

    if (amountNum <= 0) {
      toast.error(locale === "en" ? "Payment amount must be > 0" : "Nominal pembayaran harus lebih dari 0");
      return;
    }

    if (amountNum > remainingAmount) {
      toast.error(locale === "en" ? "Amount exceeds remaining balance" : "Nominal melebihi sisa pokok");
      return;
    }

    if (!walletId) {
      toast.error(locale === "en" ? "Select wallet" : "Pilih rekening");
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
            ? (locale === "en" ? `Installment payment of ${formatCurrency(amountNum)} recorded!` : `Pembayaran cicilan ${formatCurrency(amountNum)} berhasil dicatat!`)
            : (locale === "en" ? `Receivable collection of ${formatCurrency(amountNum)} recorded!` : `Penerimaan piutang ${formatCurrency(amountNum)} berhasil dicatat!`)
        );
        setAmount("");
        setNotes("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to record payment");
      }
    } catch {
      toast.error("System error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button size="sm" className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <CreditCard className="h-4 w-4" />
            {isLoan ? t("debts.payDebt") : t("debts.receivePayment")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            {isLoan ? `${t("debts.payDebt")}: ${debtName}` : `${t("debts.receivePayment")}: ${debtName}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="pay-wallet" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {isLoan ? t("transactions.fromWallet") : t("transactions.toWallet")}
            </Label>
            <Select value={walletId} onValueChange={setWalletId}>
              <SelectTrigger id="pay-wallet" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                <SelectValue placeholder="Pilih rekening" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                {wallets.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name} (Saldo: {formatCurrency(Number(w.current_balance || 0))})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="pay-amount" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("debts.paymentAmount")}
              </Label>
              <button
                type="button"
                onClick={() => setAmount(remainingAmount)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                {locale === "en" ? `Pay in Full (${formatCurrency(remainingAmount)})` : `Bayar Lunas (${formatCurrency(remainingAmount)})`}
              </button>
            </div>
            <CurrencyInput
              id="pay-amount"
              value={amount}
              onValueChange={setAmount}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pay-notes" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("debts.notesLabel")}
            </Label>
            <Input
              id="pay-notes"
              placeholder={locale === "en" ? "E.g. Installment #3 via bank transfer" : "Contoh: Cicilan ke-3, pelunasan transfer BCA"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-2xl text-xs font-bold"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-5 shadow-glow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("common.confirm")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
