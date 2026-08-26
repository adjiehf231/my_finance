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
import { createRecurringTransactionAction } from "../actions/recurring-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface AddRecurringModalProps {
  familyId: string;
  wallets: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: "income" | "expense" }>;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export function AddRecurringModal({
  familyId,
  wallets,
  categories,
  onSuccess,
  triggerButton,
}: AddRecurringModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, locale } = useTranslation();

  const [name, setName] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState<number | string>("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, "")) || 0;

    if (amountNum <= 0) {
      toast.error(locale === "en" ? "Amount must be > 0" : "Nominal transaksi harus lebih dari 0");
      return;
    }

    if (!name.trim()) {
      toast.error(locale === "en" ? "Bill name cannot be empty" : "Nama tagihan/transaksi tidak boleh kosong");
      return;
    }

    if (!walletId) {
      toast.error(locale === "en" ? "Select linked wallet" : "Pilih rekening terkait");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createRecurringTransactionAction({
        familyId,
        walletId,
        categoryId: categoryId || null,
        name: name.trim(),
        type,
        amount: amountNum,
        frequency,
        startDate,
        endDate: endDate || null,
      });

      if (res.success) {
        toast.success(locale === "en" ? `Recurring bill "${name}" scheduled successfully!` : `Jadwal "${name}" berhasil dibuat!`);
        setName("");
        setAmount("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to schedule bill");
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
          <Button className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-105 transition-all">
            <Plus className="h-4 w-4 stroke-[3]" />
            {t("recurring.addRecurring")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            {t("recurring.addModalTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="rec-name" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("recurring.nameLabel")}
            </Label>
            <Input
              id="rec-name"
              placeholder={t("recurring.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-type" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("common.category")}
              </Label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger id="rec-type" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  <SelectItem value="expense">{t("transactions.expense")}</SelectItem>
                  <SelectItem value="income">{t("transactions.income")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-freq" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("recurring.frequencyLabel")}
              </Label>
              <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                <SelectTrigger id="rec-freq" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                  <SelectValue placeholder="Pilih frekuensi" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  <SelectItem value="daily">{t("recurring.daily")}</SelectItem>
                  <SelectItem value="weekly">{t("recurring.weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("recurring.monthly")}</SelectItem>
                  <SelectItem value="yearly">{t("recurring.yearly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rec-amount" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("common.amount")}
            </Label>
            <CurrencyInput
              id="rec-amount"
              value={amount}
              onValueChange={setAmount}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-wallet" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("common.wallet")}
              </Label>
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger id="rec-wallet" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                  <SelectValue placeholder="Pilih rekening" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-cat" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("common.category")}
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="rec-cat" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rec-start" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("recurring.startDateLabel")}
              </Label>
              <Input
                id="rec-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-end" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {locale === "en" ? "End Date (Optional)" : "Selesai (Opsional)"}
              </Label>
              <Input
                id="rec-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              />
            </div>
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
                t("recurring.addRecurring")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
