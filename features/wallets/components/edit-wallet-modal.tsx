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
import { updateWalletAction, type WalletItem } from "../actions/wallet-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface EditWalletModalProps {
  wallet: WalletItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
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

export function EditWalletModal({
  wallet,
  open,
  onOpenChange,
  onSuccess,
}: EditWalletModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t, locale } = useTranslation();

  const [name, setName] = useState(wallet.name);
  const [type, setType] = useState<"cash" | "bank" | "ewallet" | "credit_card" | "investment" | "other">(
    (wallet.type as any) || "bank"
  );
  const [accountNumber, setAccountNumber] = useState(wallet.account_number || "");
  const [color, setColor] = useState(wallet.color || "#2563EB");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(locale === "en" ? "Wallet name cannot be empty" : "Nama dompet tidak boleh kosong");
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateWalletAction({
        walletId: wallet.id,
        name: name.trim(),
        type,
        accountNumber: accountNumber.trim() || null,
        color,
      });

      if (res.success) {
        toast.success(locale === "en" ? "Wallet updated successfully!" : "Rekening/dompet berhasil diperbarui!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to update wallet");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            {t("wallets.editModalTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nama Dompet */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-wallet-name" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.nameLabel")}
            </Label>
            <Input
              id="edit-wallet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("wallets.namePlaceholder")}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              required
            />
          </div>

          {/* Tipe Dompet */}
          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.typeLabel")}
            </Label>
            <Select
              value={type}
              onValueChange={(val: any) => setType(val)}
            >
              <SelectTrigger className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                <SelectValue />
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

          {/* Nomor Rekening / No. HP */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-wallet-account-number" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.accNumLabel")}
            </Label>
            <Input
              id="edit-wallet-account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={t("wallets.accNumPlaceholder")}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
            />
          </div>

          {/* Pilihan Warna */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("wallets.cardColorLabel")}
            </Label>
            <div className="flex items-center gap-3 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c ? "scale-110 ring-2 ring-blue-500 ring-offset-2" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl text-xs font-bold"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 shadow-glow"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("wallets.saveChangesBtn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
