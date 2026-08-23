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
import { PiggyBank, Loader2 } from "lucide-react";
import { addGoalContributionAction } from "../actions/goal-actions";
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

  const [walletId, setWalletId] = useState(wallets[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;

    if (amountNum <= 0) {
      toast.error("Nominal setoran harus lebih dari 0");
      return;
    }

    if (!walletId) {
      toast.error("Pilih rekening sumber");
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
        toast.success(`Setoran Rp ${amountNum.toLocaleString("id-ID")} berhasil ditambahkan!`);
        setAmount("");
        setNotes("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal menambahkan setoran");
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
            <PiggyBank className="h-4 w-4" />
            Setor Tabungan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Setor Dana ke: {goalName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="contrib-wallet">Dari Rekening / Dompet</Label>
            <Select value={walletId} onValueChange={setWalletId}>
              <SelectTrigger id="contrib-wallet">
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
            <Label htmlFor="contrib-amount">Nominal Setoran (Rp)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                Rp
              </span>
              <Input
                id="contrib-amount"
                type="number"
                min="1"
                placeholder="Contoh: 500000"
                className="pl-12 text-xl font-bold h-12 rounded-2xl"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contrib-notes">Catatan (Opsional)</Label>
            <Input
              id="contrib-notes"
              placeholder="Contoh: Tabungan dari bonus bulanan"
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
                "Konfirmasi Setoran"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
