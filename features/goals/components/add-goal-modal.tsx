"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { createGoalAction } from "../actions/goal-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface AddGoalModalProps {
  familyId: string;
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

const PRESET_COLORS = [
  "#2563EB", // Royal Sapphire
  "#3B82F6", // Blue
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#E11D48", // Rose
];

export function AddGoalModal({
  familyId,
  onSuccess,
  triggerButton,
}: AddGoalModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t, locale } = useTranslation();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | string>("");
  const [targetDate, setTargetDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [color, setColor] = useState("#2563EB");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = typeof targetAmount === "number" ? targetAmount : parseFloat(String(targetAmount).replace(/[^0-9.-]+/g, "")) || 0;

    if (targetNum <= 0) {
      toast.error(locale === "en" ? "Target amount must be > 0" : "Nominal target harus lebih dari 0");
      return;
    }

    if (!name.trim()) {
      toast.error(locale === "en" ? "Goal name cannot be empty" : "Nama target tidak boleh kosong");
      return;
    }

    try {
      setIsLoading(true);
      const res = await createGoalAction({
        familyId,
        name: name.trim(),
        targetAmount: targetNum,
        targetDate: targetDate || null,
        priority,
        color,
        icon: "target",
        description: description.trim() || null,
      });

      if (res.success) {
        toast.success(locale === "en" ? `Goal "${name}" created successfully!` : `Target "${name}" berhasil dibuat!`);
        setName("");
        setTargetAmount("");
        setDescription("");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to create goal");
      }
    } catch {
      toast.error("System error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-105 transition-all">
            <Plus className="h-4 w-4 stroke-[3]" />
            {t("goals.addGoal")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white font-display">
            {t("goals.addModalTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="goal-name" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("goals.nameLabel")}
            </Label>
            <Input
              id="goal-name"
              placeholder={t("goals.namePlaceholder")}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-target" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("goals.targetAmount")}
            </Label>
            <CurrencyInput
              id="goal-target"
              value={targetAmount}
              onValueChange={setTargetAmount}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="goal-date" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("goals.deadline")}
              </Label>
              <Input
                id="goal-date"
                type="date"
                className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="goal-priority" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {locale === "en" ? "Priority" : "Prioritas"}
              </Label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                <SelectTrigger id="goal-priority" className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                  <SelectValue placeholder="Prioritas" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  <SelectItem value="low">{locale === "en" ? "Low" : "Rendah"}</SelectItem>
                  <SelectItem value="medium">{locale === "en" ? "Medium" : "Sedang"}</SelectItem>
                  <SelectItem value="high">{locale === "en" ? "High (Important)" : "Tinggi (Penting)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {locale === "en" ? "Accent Color" : "Warna Aksen"}
            </Label>
            <div className="flex items-center gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-desc" className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("common.description")}
            </Label>
            <Input
              id="goal-desc"
              placeholder={locale === "en" ? "E.g. Set aside 500k monthly from salary" : "Contoh: Sisihkan 500rb per bulan dari gaji"}
              className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-2xl text-xs font-bold"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-5 shadow-glow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("goals.saveGoalBtn")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
