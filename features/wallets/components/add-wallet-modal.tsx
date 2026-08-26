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

  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "bank" | "ewallet" | "credit_card" | "investment" | "other">("bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [initialBalance, setInitialBalance] = useState<number | string>("");
  const [color, setColor] = useState("#2563EB");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama dompet tidak boleh kosong");
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
        toast.success(`Dompet "${name}" berhasil ditambahkan!`);
        setName("");
        setAccountNumber("");
        setInitialBalance("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal menambahkan dompet");
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
            Tambah Dompet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            Tambah Rekening / Dompet Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="wallet-name" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Nama Rekening / Dompet
            </Label>
            <Input
              id="wallet-name"
              placeholder="Contoh: BCA Tabungan, Dompet Tunai, GoPay"
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-type" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Tipe Rekening
            </Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger id="wallet-type" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                <SelectValue placeholder="Pilih tipe rekening" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                <SelectItem value="bank">Rekening Bank (BCA, Mandiri, BRI, dll)</SelectItem>
                <SelectItem value="ewallet">E-Wallet (GoPay, OVO, ShopeePay, Dana)</SelectItem>
                <SelectItem value="cash">Uang Tunai / Kas Fisik</SelectItem>
                <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                <SelectItem value="investment">Investasi / Reksadana / Saham</SelectItem>
                <SelectItem value="other">Lain-lain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-account-number" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Nomor Rekening / No. HP / No. Akun (Opsional)
            </Label>
            <Input
              id="wallet-account-number"
              placeholder="Contoh: 1234567890 atau 081234567890"
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-balance" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Saldo Awal
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
              Pilih Warna Kartu
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
                "Simpan Rekening"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
