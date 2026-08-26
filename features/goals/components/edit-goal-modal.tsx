"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Edit3 } from "lucide-react";
import { updateGoalAction, type GoalWithProgress } from "../actions/goal-actions";
import { toast } from "sonner";

interface EditGoalModalProps {
  goal: GoalWithProgress;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

export function EditGoalModal({
  goal,
  open,
  onOpenChange,
  onSuccess,
}: EditGoalModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(goal.name);
  const [targetAmount, setTargetAmount] = useState(String(goal.target_amount || ""));
  const [targetDate, setTargetDate] = useState(
    goal.target_date ? goal.target_date.split("T")[0] : ""
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(goal.priority);
  const [status, setStatus] = useState<"in_progress" | "completed" | "cancelled">(
    goal.status
  );
  const [color, setColor] = useState(goal.color || "#3B82F6");
  const [description, setDescription] = useState(goal.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseFloat(targetAmount.replace(/[^0-9.-]+/g, "")) || 0;

    if (targetNum <= 0) {
      toast.error("Target nominal harus lebih dari 0");
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateGoalAction({
        goalId: goal.id,
        name: name.trim(),
        targetAmount: targetNum,
        targetDate: targetDate || null,
        priority,
        status,
        color,
        description: description || null,
      });

      if (res.success) {
        toast.success("Target impian berhasil diperbarui!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Gagal memperbarui target");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            Edit Target Tabungan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nama Target */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-goal-name" className="text-xs font-bold text-slate-500 uppercase">
              Nama Target Tabungan
            </Label>
            <Input
              id="edit-goal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dana Darurat, Liburan Jepang"
              className="rounded-2xl"
              required
            />
          </div>

          {/* Target Nominal */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-goal-target" className="text-xs font-bold text-slate-500 uppercase">
              Target Nominal (Rp)
            </Label>
            <Input
              id="edit-goal-target"
              type="text"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="10000000"
              className="rounded-2xl font-bold"
              required
            />
          </div>

          {/* Tenggat Waktu & Prioritas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-goal-date" className="text-xs font-bold text-slate-500 uppercase">
                Tenggat Target
              </Label>
              <Input
                id="edit-goal-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Prioritas
              </Label>
              <Select
                value={priority}
                onValueChange={(val: any) => setPriority(val)}
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="low">Rendah</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Status Target
            </Label>
            <Select
              value={status}
              onValueChange={(val: any) => setStatus(val)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="in_progress">Sedang Berjalan</SelectItem>
                <SelectItem value="completed">Tercapai (Selesai)</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pilihan Warna */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Warna Target
            </Label>
            <div className="flex items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    color === c ? "scale-110 ring-2 ring-slate-900 dark:ring-white ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
