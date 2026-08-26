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
import { createWalletAction } from "../actions/wallet-actions";
import { toast } from "sonner";

interface AddWalletModalProps {
  familyId: string;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

const PRESET_COLORS = [
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F43F5E", // Rose
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
  const [initialBalance, setInitialBalance] = useState("0");
  const [color, setColor] = useState("#10B981");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama dompet tidak boleh kosong");
      return;
    }

    try {
      setIsLoading(true);
      const parsedBalance = parseFloat(initialBalance.replace(/[^0-9.-]+/g, "")) || 0;

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
        setInitialBalance("0");
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
          <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Tambah Dompet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Tambah Rekening / Dompet Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="wallet-name">Nama Rekening / Dompet</Label>
            <Input
              id="wallet-name"
              placeholder="Contoh: BCA Tabungan, Dompet Tunai, GoPay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-type">Tipe Rekening</Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger id="wallet-type">
                <SelectValue placeholder="Pilih tipe rekening" />
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="wallet-account-number">
              Nomor Rekening / No. HP / No. Akun (Opsional)
            </Label>
            <Input
              id="wallet-account-number"
              placeholder="Contoh: 1234567890 atau 081234567890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wallet-balance">Saldo Awal (Rp)</Label>
            <Input
              id="wallet-balance"
              type="number"
              min="0"
              placeholder="0"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Pilih Warna Kartu</Label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-emerald-500 scale-110"
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
                "Simpan Rekening"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
