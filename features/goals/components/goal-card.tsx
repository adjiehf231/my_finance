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
import { useTranslation } from "@/lib/i18n/i18n-context";
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
  const { t, locale } = useTranslation();

  const handleDelete = async () => {
    const confirmMsg = locale === "en"
      ? `Delete savings goal "${goal.name}"?`
      : `Hapus target tabungan "${goal.name}"?`;
    if (!confirm(confirmMsg)) return;

    try {
      setIsDeleting(true);
      const res = await deleteGoalAction(goal.id);
      if (res.success) {
        toast.success(locale === "en" ? `Goal "${goal.name}" deleted` : `Target "${goal.name}" berhasil dihapus`);
        onUpdate?.();
      } else {
        toast.error(res.error || "Failed to delete goal");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const isCompleted = goal.percentage >= 100 || goal.status === "completed";

  return (
    <>
      <Card className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl shadow-sm hover:shadow-2xl hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300 p-5 relative overflow-hidden flex flex-col justify-between group">
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: goal.color || "#2563EB" }}
        />

        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                style={{ backgroundColor: goal.color || "#2563EB" }}
              >
                {isCompleted ? <Award className="h-6 w-6" /> : <Target className="h-6 w-6" />}
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900 dark:text-white font-display">
                  {goal.name}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${
                      goal.priority === "high"
                        ? "border-rose-300 text-rose-600 bg-rose-50 dark:bg-rose-950/40"
                        : goal.priority === "medium"
                        ? "border-blue-300 text-blue-600 bg-blue-50 dark:bg-blue-950/40"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {locale === "en" ? `${goal.priority} priority` : `Prioritas ${goal.priority}`}
                  </Badge>

                  {goal.days_left !== null && goal.days_left > 0 && !isCompleted && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {goal.days_left} {locale === "en" ? "days left" : "hari lagi"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isCompleted && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl px-2.5 py-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> {t("goals.achieved")}
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
                <DropdownMenuContent align="end" className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-semibold"
                  >
                    <Edit3 className="h-4 w-4 mr-2 text-blue-600" />
                    {t("common.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-rose-600 focus:text-rose-700 cursor-pointer text-xs font-semibold"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("common.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

        {/* Progress Bar & Percent */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400 font-display">{t("goals.progress")}</span>
            <span
              className="font-mono font-black"
              style={{ color: goal.color || "#2563EB" }}
            >
              {goal.percentage}%
            </span>
          </div>

          <div className="h-3 w-full bg-slate-100 dark:bg-[#07090E] rounded-full overflow-hidden p-0.5 border border-slate-200/40 dark:border-white/[0.04]">
            <div
              className="h-full rounded-full transition-all duration-700 shadow-glow"
              style={{
                width: `${Math.min(100, goal.percentage)}%`,
                backgroundColor: goal.color || "#2563EB",
              }}
            />
          </div>
        </div>

        {/* Financial Numbers */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">{t("goals.currentAmount")}</p>
            <p className="font-black text-slate-900 dark:text-white mt-0.5 font-mono text-sm sm:text-base">
              {formatCurrency(goal.current_amount)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">{t("goals.targetAmount")}</p>
            <p className="font-black text-slate-900 dark:text-slate-100 mt-0.5 font-mono text-sm sm:text-base">
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
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                + {t("goals.addContribution")}
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
