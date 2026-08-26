import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { Tag, AlertTriangle, CheckCircle2, MoreVertical, Trash2, Edit3 } from "lucide-react";
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
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] shadow-sm hover:shadow-md transition-all p-5">
        <CardContent className="p-0 space-y-4">
          {/* Header with Category & Status Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: budget.categories.color || "#EF4444" }}
              >
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {budget.categories.name}
                </h4>
                <p className="text-xs text-slate-400">
                  Limit: {formatCurrency(budget.amount_limit)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isOverbudget ? (
                <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] rounded-xl px-2.5 py-0.5 animate-pulse">
                  OVERBUDGET
                </Badge>
              ) : isDanger ? (
                <Badge className="bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-semibold text-[11px] rounded-xl px-2.5 py-0.5 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {budget.percentage}% (Bahaya)
                </Badge>
              ) : isWarning ? (
                <Badge className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-semibold text-[11px] rounded-xl px-2.5 py-0.5 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {budget.percentage}% (Waspada)
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] rounded-xl px-2.5 py-0.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {budget.percentage}% (Aman)
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
                    <Edit3 className="h-4 w-4 mr-2 text-rose-600" />
                    Edit Limit Anggaran
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-rose-600 focus:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Anggaran
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDanger
                    ? "bg-rose-500"
                    : isWarning
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, budget.percentage)}%` }}
              />
            </div>
          </div>

          {/* Financial Numbers breakdown */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div>
              <p className="text-slate-400">Terpakai</p>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(budget.spent_amount)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-400">
                {budget.remaining_amount >= 0 ? "Sisa Kuota" : "Kelebihan"}
              </p>
              <p
                className={`font-black mt-0.5 ${
                  budget.remaining_amount >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {formatCurrency(Math.abs(budget.remaining_amount))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditBudgetModal
        budget={budget}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}
