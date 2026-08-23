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
  Wallet,
  Play,
  Pause,
  MoreVertical,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import {
  toggleRecurringAction,
  deleteRecurringTransactionAction,
  type RecurringWithDetails,
} from "../actions/recurring-actions";
import { toast } from "sonner";

interface RecurringCardProps {
  recurring: RecurringWithDetails;
  onUpdate?: () => void;
}

export function RecurringCard({ recurring, onUpdate }: RecurringCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const res = await toggleRecurringAction(recurring.id, !recurring.is_active);
      if (res.success) {
        toast.success(
          recurring.is_active
            ? `Jadwal "${recurring.name}" dijeda.`
            : `Jadwal "${recurring.name}" diaktifkan kembali.`
        );
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal mengubah status jadwal");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus jadwal tagihan/transaksi "${recurring.name}"?`)) return;

    try {
      setIsLoading(true);
      const res = await deleteRecurringTransactionAction(recurring.id);
      if (res.success) {
        toast.success("Jadwal transaksi berhasil dihapus");
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal menghapus jadwal");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const isIncome = recurring.type === "income";

  return (
    <Card className={`rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] shadow-sm hover:shadow-md transition-all p-5 ${!recurring.is_active ? "opacity-60" : ""}`}>
      <CardContent className="p-0 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isIncome
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              }`}
            >
              {isIncome ? (
                <ArrowDownLeft className="h-5 w-5" />
              ) : (
                <ArrowUpRight className="h-5 w-5" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {recurring.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] capitalize font-semibold rounded-lg">
                  <Repeat className="h-3 w-3 mr-1 text-emerald-600" />
                  {recurring.frequency}
                </Badge>
                <span className="text-xs text-slate-400">
                  {recurring.wallets?.name || "Dompet"}
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
              title={recurring.is_active ? "Jeda Jadwal" : "Aktifkan Jadwal"}
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
              <DropdownMenuContent align="end" className="rounded-2xl">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-rose-600 focus:text-rose-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Jadwal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-baseline justify-between pt-1">
          <span className="text-xs text-slate-400">Nominal Eksekusi:</span>
          <span
            className={`text-xl font-black tracking-tight ${
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
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Eksekusi Berikutnya:</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {formatDate(recurring.next_execution_date)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
