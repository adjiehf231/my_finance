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
import { toast } from "sonner";

interface EditWalletModalProps {
  wallet: WalletItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
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

export function EditWalletModal({
  wallet,
  open,
  onOpenChange,
  onSuccess,
}: EditWalletModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(wallet.name);
  const [type, setType] = useState<"cash" | "bank" | "ewallet" | "credit_card" | "investment" | "other">(
    (wallet.type as any) || "bank"
  );
  const [color, setColor] = useState(wallet.color || "#10B981");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama dompet tidak boleh kosong");
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateWalletAction({
        walletId: wallet.id,
        name: name.trim(),
        type,
        color,
      });

      if (res.success) {
        toast.success("Rekening/dompet berhasil diperbarui!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal memperbarui dompet");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-emerald-600" />
            Edit Rekening & Dompet
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nama Dompet */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-wallet-name" className="text-xs font-bold text-slate-500 uppercase">
              Nama Rekening / Dompet
            </Label>
            <Input
              id="edit-wallet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: BCA Utama, GoPay, Kas Rumah"
              className="rounded-2xl"
              required
            />
          </div>

          {/* Tipe Dompet */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Jenis Akun
            </Label>
            <Select
              value={type}
              onValueChange={(val: any) => setType(val)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="bank">Rekening Bank</SelectItem>
                <SelectItem value="ewallet">E-Wallet (GoPay, OVO, Dana)</SelectItem>
                <SelectItem value="cash">Uang Tunai (Cash)</SelectItem>
                <SelectItem value="credit_card">Kartu Kredit / Paylater</SelectItem>
                <SelectItem value="investment">Investasi / Reksadana</SelectItem>
                <SelectItem value="other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pilihan Warna */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Warna Kartu
            </Label>
            <div className="flex items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c ? "scale-110 ring-2 ring-slate-900 dark:ring-white ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5"
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
