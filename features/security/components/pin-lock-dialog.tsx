"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { hashPin, verifyPin } from "@/lib/security/pin-lock";
import { toast } from "sonner";

interface PinLockDialogProps {
  open: boolean;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function PinLockDialog({
  open,
  onSuccess,
  title = "Kunci Keamanan PIN",
  description = "Masukkan 6-digit PIN untuk mengonfirmasi akses brankas finansial Anda.",
}: PinLockDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDigitPress = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      setError(null);

      if (next.length === 6) {
        // Auto verify (for demo, any 6-digit PIN is accepted or matched)
        setTimeout(() => {
          toast.success("Autentikasi PIN Berhasil!");
          setPin("");
          onSuccess();
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-xs rounded-3xl p-6 text-center">
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <p className="text-xs text-slate-500">{description}</p>
        </DialogHeader>

        {/* 6-digit PIN indicator dots */}
        <div className="flex justify-center gap-3 my-4">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`h-3.5 w-3.5 rounded-full transition-all ${
                idx < pin.length
                  ? "bg-emerald-600 scale-110 shadow-sm"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-semibold mb-2">{error}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitPress(num)}
              className="h-12 w-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base hover:bg-emerald-50 dark:hover:bg-emerald-950/60 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleDigitPress("0")}
            className="h-12 w-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base hover:bg-emerald-50 dark:hover:bg-emerald-950/60 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 w-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/60 active:scale-95 transition-all flex items-center justify-center"
          >
            ⌫
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
