"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MessageSquare, Copy, Check, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { DebtWithProgress } from "../actions/debt-actions";

interface DebtReminderButtonProps {
  debt: DebtWithProgress;
  triggerButton?: React.ReactNode;
}

export function formatWhatsAppDebtMessage(debt: DebtWithProgress): string {
  const isReceivable = debt.type === "debt_receivable";
  const amountStr = formatCurrency(debt.remaining_amount);
  const dueDateStr = debt.due_date ? ` dengan jatuh tempo pada ${formatDate(debt.due_date)}` : "";

  if (isReceivable) {
    return `Halo *${debt.name}*, semoga sehat selalu. 

Sekadar mengingatkan catatan tagihan piutang sebesar *${amountStr}*${dueDateStr}. 

Mohon konfirmasinya bila pembayaran telah dilakukan ya. Terima kasih banyak! 🙏
_Dikirim via MyFinance Family App_`;
  }

  return `Pengingat Jatuh Tempo Kewajiban:
Hutang: *${debt.name}*
Sisa Nominal: *${amountStr}*
${debt.due_date ? `Jatuh Tempo: *${formatDate(debt.due_date)}*` : ""}

Catatan: ${debt.notes || "Harap selesaikan sebelum tanggal jatuh tempo."}
_MyFinance Financial Planner_`;
}

export function DebtReminderButton({ debt, triggerButton }: DebtReminderButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const message = formatWhatsAppDebtMessage(debt);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Pesan pengingat berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin pesan.");
    }
  };

  const handleOpenWhatsApp = () => {
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <button
            type="button"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Kirim Pengingat</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            Pengingat Tagihan & Hutang
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/80 dark:border-white/[0.08]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display mb-2">
              Pratinjau Pesan Pengingat:
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium whitespace-pre-line leading-relaxed">
              {message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="rounded-2xl border-slate-200/80 dark:border-white/[0.08] font-bold text-xs flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Salin Pesan</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={handleOpenWhatsApp}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-glow-emerald"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Buka WhatsApp</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
