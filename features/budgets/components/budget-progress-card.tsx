"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { Tag, AlertTriangle, CheckCircle2, MoreVertical, Trash2, Edit3, Flame } from "lucide-react";
import { deleteBudgetAction, type BudgetWithSpending } from "../actions/budget-actions";
import { EditBudgetModal } from "./edit-budget-modal";
import { toast } from "sonner";

interface BudgetProgressCardProps {
  budget: BudgetWithSpending;
  onUpdate?: () => void;
}

export function BudgetProgressCard({ budget, onUpdate }: BudgetProgressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus batas anggaran untuk kategori "${budget.categories.name}"?`)) return;

    try {
      setIsDeleting(true);
      const res = await deleteBudgetAction({ budgetId: budget.id });
      if (res.success) {
        toast.success("Batas anggaran berhasil dihapus");
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal menghapus anggaran");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOverbudget = budget.status === "overbudget";
  const isDanger = budget.status === "danger" || isOverbudget;
  const isWarning = budget.status === "warning";

  return (
    <>
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 space-y-4 group">
        {/* Header with Category & Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform"
              style={{ backgroundColor: budget.categories.color || "#EF4444" }}
            >
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {budget.categories.name}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Limit: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatCurrency(budget.amount_limit)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isOverbudget ? (
              <Badge className="bg-rose-500 text-white font-extrabold text-[10px] rounded-full px-2.5 py-0.5 shadow-sm shadow-rose-500/30 flex items-center gap-1 animate-pulse">
                <Flame className="h-3 w-3" />
                OVERBUDGET
              </Badge>
            ) : isDanger ? (
              <Badge className="bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {budget.percentage}%
              </Badge>
            ) : isWarning ? (
              <Badge className="bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {budget.percentage}%
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {budget.percentage}%
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                <DropdownMenuItem
                  onClick={() => setIsEditOpen(true)}
                  className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-2 text-rose-600" />
                  Edit Limit Anggaran
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-rose-600 focus:text-rose-700 cursor-pointer text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Hapus Anggaran
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                isDanger
                  ? "bg-gradient-to-r from-rose-500 to-rose-600"
                  : isWarning
                  ? "bg-gradient-to-r from-amber-500 to-amber-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500"
              }`}
              style={{ width: `${Math.min(100, budget.percentage)}%` }}
            />
          </div>
        </div>

        {/* Financial Numbers breakdown */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Terpakai</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5 font-mono text-sm">
              {formatCurrency(budget.spent_amount)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {budget.remaining_amount >= 0 ? "Sisa Kuota" : "Kelebihan"}
            </p>
            <p
              className={`font-black mt-0.5 font-mono text-sm ${
                budget.remaining_amount >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatCurrency(Math.abs(budget.remaining_amount))}
            </p>
          </div>
        </div>
      </div>

      <EditBudgetModal
        budget={budget}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}
