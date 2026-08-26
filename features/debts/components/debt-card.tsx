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
import { DebtReminderButton } from "./debt-reminder-button";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  HandCoins,
  MessageSquare,
  Edit3,
} from "lucide-react";
import { deleteDebtAction, type DebtWithProgress } from "../actions/debt-actions";
import { toast } from "sonner";
import { EditDebtModal } from "./edit-debt-modal";

interface DebtCardProps {
  debt: DebtWithProgress;
  familyId: string;
  wallets: Array<{ id: string; name: string; current_balance: number }>;
  onUpdate?: () => void;
}

export function DebtCard({ debt, familyId, wallets, onUpdate }: DebtCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { t, locale } = useTranslation();

  const isLoan = debt.type === "loan_payable";
  const isSettled = debt.status === "settled" || debt.remaining_amount === 0;

  const handleDelete = async () => {
    const confirmMsg = locale === "en"
      ? `Delete ${isLoan ? "loan" : "receivable"} record "${debt.name}"?`
      : `Hapus data ${isLoan ? "hutang" : "piutang"} "${debt.name}"?`;
    if (!confirm(confirmMsg)) return;

    try {
      setIsDeleting(true);
      const res = await deleteDebtAction(debt.id);
      if (res.success) {
        toast.success(locale === "en" ? "Record deleted successfully" : "Data berhasil dihapus");
        onUpdate?.();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  isLoan
                    ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                    : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                }`}
              >
                {isLoan ? <CreditCard className="h-6 w-6" /> : <HandCoins className="h-6 w-6" />}
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white font-display">
                  {debt.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-black rounded-lg ${
                      isLoan
                        ? "border-rose-200 text-rose-600 bg-rose-50 dark:bg-rose-950/40"
                        : "border-emerald-200 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                    }`}
                  >
                    {isLoan ? t("debts.loanBadge") : t("debts.receivableBadge")}
                  </Badge>

                  {debt.due_date && !isSettled && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {t("debts.tempoDate", { date: formatDate(debt.due_date) })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isSettled ? (
                <Badge className="bg-emerald-500 text-white font-bold text-xs rounded-xl px-2.5 py-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {t("debts.settled")}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs font-black rounded-xl">
                  {debt.percentage_paid}% {locale === "en" ? "Paid" : "Terbayar"}
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
                <DropdownMenuContent align="end" className="rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08]">
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-bold"
                  >
                    <Edit3 className="h-4 w-4 mr-2 text-blue-600" />
                    {t("common.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-rose-600 focus:text-rose-700 cursor-pointer text-xs font-bold"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("common.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
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
          <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100 dark:border-white/[0.06]">
            <div>
              <p className="text-slate-400 font-display">{isLoan ? t("debts.remainingDebt") : t("debts.remainingReceivable")}</p>
              <p
                className={`font-black text-sm mt-0.5 font-mono ${
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
              <p className="text-slate-400 font-display">{t("debts.totalPrincipal")}</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                {formatCurrency(debt.total_amount)}
              </p>
            </div>
          </div>
        </CardContent>

        {/* Action Footer */}
        {!isSettled && (
          <div className="pt-4 mt-2 grid grid-cols-2 gap-2">
            <DebtReminderButton
              debt={debt}
              triggerButton={
                <button
                  type="button"
                  className="py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-emerald-500/20"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t("debtReminder.waButton")}
                </button>
              }
            />

            {wallets.length > 0 && (
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
                    className="py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    + {isLoan ? t("debts.payDebt") : t("debts.receivePayment")}
                  </button>
                }
              />
            )}
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
