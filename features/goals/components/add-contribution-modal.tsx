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
import { PiggyBank, Loader2 } from "lucide-react";
import { addGoalContributionAction } from "../actions/goal-actions";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface AddContributionModalProps {
  goalId: string;
  goalName: string;
  familyId: string;
  wallets: Array<{ id: string; name: string; current_balance: number }>;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function AddContributionModal({
  goalId,
  goalName,
  familyId,
  wallets,
  onSuccess,
  triggerButton,
}: AddContributionModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, locale } = useTranslation();

  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [amount, setAmount] = useState<number | string>("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, "")) || 0;

    if (amountNum <= 0) {
      toast.error(locale === "en" ? "Deposit amount must be > 0" : "Nominal setoran harus lebih dari 0");
      return;
    }

    if (!walletId) {
      toast.error(locale === "en" ? "Select source wallet" : "Pilih rekening sumber");
      return;
    }

    try {
      setIsLoading(true);
      const res = await addGoalContributionAction({
        goalId,
        familyId,
        walletId,
        amount: amountNum,
        contributionDate: new Date().toISOString().split("T")[0],
        notes: notes.trim() || null,
      });

      if (res.success) {
        toast.success(
          locale === "en"
            ? `Contribution of ${formatCurrency(amountNum)} added successfully!`
            : `Setoran ${formatCurrency(amountNum)} berhasil ditambahkan!`
        );
        setAmount("");
        setNotes("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to add contribution");
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
          <Button size="sm" className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <PiggyBank className="h-4 w-4" />
            {t("goals.addContribution")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            {t("goals.addContribModalTitle")}: {goalName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="contrib-wallet" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("goals.walletSourceLabel")}
            </Label>
            <Select value={walletId} onValueChange={setWalletId}>
              <SelectTrigger id="contrib-wallet" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
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
            <Label htmlFor="contrib-amount" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("common.amount")}
            </Label>
            <CurrencyInput
              id="contrib-amount"
              value={amount}
              onValueChange={setAmount}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contrib-notes" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("common.description")}
            </Label>
            <Input
              id="contrib-notes"
              placeholder={locale === "en" ? "E.g. Bonus savings deposit" : "Contoh: Tabungan dari bonus bulanan"}
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
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 shadow-glow-emerald"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("goals.saveContribBtn")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
