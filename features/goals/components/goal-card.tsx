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
import { formatCurrency } from "@/lib/utils";
import { AddContributionModal } from "./add-contribution-modal";
import { EditGoalModal } from "./edit-goal-modal";
import {
  Target,
  Clock,
  Sparkles,
  Award,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import { deleteGoalAction, type GoalWithProgress } from "../actions/goal-actions";
import { toast } from "sonner";

interface GoalCardProps {
  goal: GoalWithProgress;
  familyId: string;
  wallets: Array<{ id: string; name: string; current_balance: number }>;
  onUpdate?: () => void;
}

export function GoalCard({ goal, familyId, wallets, onUpdate }: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus target tabungan "${goal.name}"?`)) return;

    try {
      setIsDeleting(true);
      const res = await deleteGoalAction(goal.id);
      if (res.success) {
        toast.success(`Target "${goal.name}" berhasil dihapus`);
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal menghapus target");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const isCompleted = goal.percentage >= 100 || goal.status === "completed";

  return (
    <>
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] shadow-sm hover:shadow-md transition-all p-5 relative overflow-hidden flex flex-col justify-between">
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: goal.color || "#3B82F6" }}
        />

        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: goal.color || "#3B82F6" }}
              >
                {isCompleted ? <Award className="h-6 w-6" /> : <Target className="h-6 w-6" />}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {goal.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg border ${
                      goal.priority === "high"
                        ? "border-rose-300 text-rose-600 bg-rose-50 dark:bg-rose-950/40"
                        : goal.priority === "medium"
                        ? "border-blue-300 text-blue-600 bg-blue-50 dark:bg-blue-950/40"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    Prioritas {goal.priority}
                  </Badge>

                  {goal.days_left !== null && goal.days_left > 0 && !isCompleted && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {goal.days_left} hari lagi
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isCompleted && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl px-2.5 py-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Tercapai!
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl w-40">
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4 mr-2 text-blue-600" />
                    Edit Target
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-rose-600 focus:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus Target
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        {/* Progress Bar & Percent */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Pencapaian</span>
            <span
              className="font-bold"
              style={{ color: goal.color || "#3B82F6" }}
            >
              {goal.percentage}%
            </span>
          </div>

          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, goal.percentage)}%`,
                backgroundColor: goal.color || "#3B82F6",
              }}
            />
          </div>
        </div>

        {/* Financial Numbers */}
        <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <p className="text-slate-400">Terkumpul</p>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(goal.current_amount)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-400">Target</p>
            <p className="font-black text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(goal.target_amount)}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Action Footer */}
      {!isCompleted && wallets.length > 0 && (
        <div className="pt-4 mt-2">
          <AddContributionModal
            goalId={goal.id}
            goalName={goal.name}
            familyId={familyId}
            wallets={wallets}
            onSuccess={onUpdate}
            triggerButton={
              <button
                type="button"
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                + Setor Tabungan
              </button>
            }
          />
        </div>
      )}
    </Card>

    <EditGoalModal
      goal={goal}
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
      onSuccess={onUpdate}
    />
  </>
  );
}
