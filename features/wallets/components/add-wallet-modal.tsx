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
import { createWalletAction } from "../actions/wallet-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface AddWalletModalProps {
  familyId: string;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

const PRESET_COLORS = [
  "#2563EB", // Royal Sapphire
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#E11D48", // Rose
  "#64748B", // Slate
];

export function AddWalletModal({
  familyId,
  onSuccess,
  triggerButton,
}: AddWalletModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, locale } = useTranslation();

  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "bank" | "ewallet" | "credit_card" | "investment" | "other">("bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [initialBalance, setInitialBalance] = useState<number | string>("");
  const [color, setColor] = useState("#2563EB");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(locale === "en" ? "Wallet name cannot be empty" : "Nama dompet tidak boleh kosong");
      return;
    }

    try {
      setIsLoading(true);
      const parsedBalance = typeof initialBalance === "number" ? initialBalance : parseFloat(String(initialBalance).replace(/[^0-9.-]+/g, "")) || 0;

      const res = await createWalletAction({
        familyId,
        name: name.trim(),
        type,
        accountNumber: accountNumber.trim() || undefined,
        initialBalance: parsedBalance,
        currency: "IDR",
        color,
        icon: "wallet",
      });

      if (res.success) {
        toast.success(locale === "en" ? `Wallet "${name}" added successfully!` : `Dompet "${name}" berhasil ditambahkan!`);
        setName("");
        setAccountNumber("");
        setInitialBalance("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to add wallet");
      }
    } catch {
      toast.error("An error occurred");
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
            {t("wallets.addWallet")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            {t("wallets.addModalTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="wallet-name" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.nameLabel")}
            </Label>
            <Input
              id="wallet-name"
              placeholder={t("wallets.namePlaceholder")}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-type" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.typeLabel")}
            </Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger id="wallet-type" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                <SelectValue placeholder={t("wallets.typePlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                <SelectItem value="bank">{t("wallets.types.bank")}</SelectItem>
                <SelectItem value="ewallet">{t("wallets.types.ewallet")}</SelectItem>
                <SelectItem value="cash">{t("wallets.types.cash")}</SelectItem>
                <SelectItem value="credit_card">{t("wallets.types.credit_card")}</SelectItem>
                <SelectItem value="investment">{t("wallets.types.investment")}</SelectItem>
                <SelectItem value="other">{t("wallets.types.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-account-number" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.accNumLabel")}
            </Label>
            <Input
              id="wallet-account-number"
              placeholder={t("wallets.accNumPlaceholder")}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-balance" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.initialBalanceLabel")}
            </Label>
            <CurrencyInput
              id="wallet-balance"
              value={initialBalance}
              onValueChange={setInitialBalance}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.cardColorLabel")}
            </Label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
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
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 shadow-glow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("wallets.savingBtn")}
                </>
              ) : (
                t("wallets.saveBtn")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
