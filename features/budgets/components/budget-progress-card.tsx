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
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl p-6 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 dark:hover:border-emerald-400/40 hover:-translate-y-1 transition-all duration-300 space-y-4 group">
        {/* Header with Category & Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
              style={{ backgroundColor: budget.categories.color || "#00F5A0" }}
            >
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white font-display">
                {budget.categories.name}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Limit: <span className="font-mono font-black text-slate-700 dark:text-slate-300">{formatCurrency(budget.amount_limit)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isOverbudget ? (
              <Badge className="bg-rose-500 text-white font-black text-[10px] rounded-full px-2.5 py-0.5 shadow-md shadow-rose-500/30 flex items-center gap-1 animate-pulse uppercase tracking-wider">
                <Flame className="h-3 w-3" />
                OVERBUDGET
              </Badge>
            ) : isDanger ? (
              <Badge className="bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-black text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {budget.percentage}%
              </Badge>
            ) : isWarning ? (
              <Badge className="bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-black text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {budget.percentage}%
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-black text-[10px] rounded-full px-2.5 py-0.5 flex items-center gap-1">
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
              <DropdownMenuContent align="end" className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                <DropdownMenuItem
                  onClick={() => setIsEditOpen(true)}
                  className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-semibold"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-2 text-rose-600" />
                  Edit Limit Anggaran
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-rose-600 focus:text-rose-700 cursor-pointer text-xs font-semibold"
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
          <div className="h-3 w-full bg-slate-100 dark:bg-[#06080D] rounded-full overflow-hidden p-0.5 border border-slate-200/40 dark:border-white/[0.04]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isDanger
                  ? "bg-gradient-to-r from-rose-500 to-[#FF385C] shadow-glow-rose"
                  : isWarning
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 shadow-glow"
                  : "bg-gradient-to-r from-[#00F5A0] to-teal-400 shadow-glow"
              }`}
              style={{ width: `${Math.min(100, budget.percentage)}%` }}
            />
          </div>
        </div>

        {/* Financial Numbers breakdown */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">Terpakai</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5 font-mono text-sm sm:text-base">
              {formatCurrency(budget.spent_amount)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-display">
              {budget.remaining_amount >= 0 ? "Sisa Kuota" : "Kelebihan"}
            </p>
            <p
              className={`font-black mt-0.5 font-mono text-sm sm:text-base ${
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
