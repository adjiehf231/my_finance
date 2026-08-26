"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RecordPaymentModal } from "./record-payment-modal";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  HandCoins,
} from "lucide-react";
import { deleteDebtAction, type DebtWithProgress } from "../actions/debt-actions";
import { toast } from "sonner";

import { EditDebtModal } from "./edit-debt-modal";
import { Edit3 } from "lucide-react";

interface DebtCardProps {
  debt: DebtWithProgress;
  familyId: string;
  wallets: Array<{ id: string; name: string; current_balance: number }>;
  onUpdate?: () => void;
}

export function DebtCard({ debt, familyId, wallets, onUpdate }: DebtCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isLoan = debt.type === "loan_payable";
  const isSettled = debt.status === "settled" || debt.remaining_amount === 0;

  const handleDelete = async () => {
    if (!confirm(`Hapus data ${isLoan ? "hutang" : "piutang"} "${debt.name}"?`)) return;

    try {
      setIsDeleting(true);
      const res = await deleteDebtAction(debt.id);
      if (res.success) {
        toast.success("Data berhasil dihapus");
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal menghapus");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isLoan
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                {isLoan ? <CreditCard className="h-6 w-6" /> : <HandCoins className="h-6 w-6" />}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {debt.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-bold rounded-lg ${
                      isLoan
                        ? "border-rose-200 text-rose-600 bg-rose-50 dark:bg-rose-950/40"
                        : "border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                    }`}
                  >
                    {isLoan ? "Hutang Pinjaman" : "Piutang Diberikan"}
                  </Badge>

                  {debt.due_date && !isSettled && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Tempo: {formatDate(debt.due_date)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSettled ? (
                <Badge className="bg-emerald-500 text-white font-bold text-xs rounded-xl px-2.5 py-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Lunas
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs font-semibold rounded-xl">
                  {debt.percentage_paid}% Terbayar
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4 mr-2 text-indigo-600" />
                    Edit Data
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-rose-600 focus:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isSettled
                  ? "bg-emerald-500"
                  : isLoan
                  ? "bg-rose-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, debt.percentage_paid)}%` }}
            />
          </div>
        </div>

        {/* Numbers breakdown */}
        <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <p className="text-slate-400">{isLoan ? "Sisa Hutang" : "Sisa Piutang"}</p>
            <p
              className={`font-black text-sm mt-0.5 ${
                isSettled
                  ? "text-emerald-600"
                  : isLoan
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatCurrency(debt.remaining_amount)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-400">Total Pokok</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(debt.total_amount)}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Action Footer */}
      {!isSettled && wallets.length > 0 && (
        <div className="pt-4 mt-2">
          <RecordPaymentModal
            debtId={debt.id}
            debtName={debt.name}
            type={debt.type}
            remainingAmount={debt.remaining_amount}
            familyId={familyId}
            wallets={wallets}
            onSuccess={onUpdate}
            triggerButton={
              <button
                type="button"
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                + {isLoan ? "Bayar Cicilan" : "Terima Setoran"}
              </button>
            }
          />
        </div>
      )}
    </Card>

    <EditDebtModal
      debt={debt}
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
      onSuccess={onUpdate}
    />
  </>
  );
}
