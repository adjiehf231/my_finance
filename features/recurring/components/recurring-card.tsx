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
import {
  Repeat,
  Calendar,
  Play,
  Pause,
  MoreVertical,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
} from "lucide-react";
import {
  toggleRecurringAction,
  deleteRecurringTransactionAction,
  type RecurringWithDetails,
} from "../actions/recurring-actions";
import { EditRecurringModal } from "./edit-recurring-modal";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface RecurringCardProps {
  recurring: RecurringWithDetails;
  onUpdate?: () => void;
}

export function RecurringCard({ recurring, onUpdate }: RecurringCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { t, locale } = useTranslation();

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const res = await toggleRecurringAction(recurring.id, !recurring.is_active);
      if (res.success) {
        toast.success(
          recurring.is_active
            ? (locale === "en" ? `Bill "${recurring.name}" paused.` : `Jadwal "${recurring.name}" dijeda.`)
            : (locale === "en" ? `Bill "${recurring.name}" resumed.` : `Jadwal "${recurring.name}" diaktifkan kembali.`)
        );
        onUpdate?.();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmMsg = locale === "en"
      ? `Delete recurring bill "${recurring.name}"?`
      : `Hapus jadwal tagihan/transaksi "${recurring.name}"?`;
    if (!confirm(confirmMsg)) return;

    try {
      setIsLoading(true);
      const res = await deleteRecurringTransactionAction(recurring.id);
      if (res.success) {
        toast.success(locale === "en" ? "Recurring bill deleted" : "Jadwal transaksi berhasil dihapus");
        onUpdate?.();
      } else {
        toast.error(res.error || "Failed to delete bill");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isIncome = recurring.type === "income";

  const getFreqLabel = (freq: string) => {
    switch (freq) {
      case "daily": return t("recurring.daily");
      case "weekly": return t("recurring.weekly");
      case "monthly": return t("recurring.monthly");
      case "yearly": return t("recurring.yearly");
      default: return freq;
    }
  };

  return (
    <>
      <Card className={`rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl shadow-sm hover:shadow-2xl hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300 p-5 ${!recurring.is_active ? "opacity-60" : ""}`}>
        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isIncome
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                }`}
              >
                {isIncome ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-base font-display">
                  {recurring.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] rounded-lg font-black uppercase tracking-wider">
                    <Repeat className="h-2.5 w-2.5 mr-1" />
                    {getFreqLabel(recurring.frequency)}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {recurring.wallets?.name || t("common.wallet")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                disabled={isLoading}
                title={recurring.is_active ? (locale === "en" ? "Pause" : "Jeda") : (locale === "en" ? "Resume" : "Aktifkan")}
                className="h-8 w-8 rounded-full"
              >
                {recurring.is_active ? (
                  <Pause className="h-4 w-4 text-amber-500" />
                ) : (
                  <Play className="h-4 w-4 text-emerald-500" />
                )}
              </Button>

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
                    className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-semibold"
                  >
                    <Edit3 className="h-4 w-4 mr-2 text-blue-600" />
                    {t("common.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-rose-600 focus:text-rose-700 cursor-pointer text-xs font-semibold"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("common.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-slate-400 font-display">{t("common.amount")}:</span>
            <span
              className={`text-xl font-black font-mono tracking-tight ${
                isIncome
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(recurring.amount)}
            </span>
          </div>

          {/* Next Run Info */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{t("recurring.nextDue")}:</span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {formatDate(recurring.next_execution_date)}
            </span>
          </div>
        </CardContent>
      </Card>

      <EditRecurringModal
        recurring={recurring}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}
