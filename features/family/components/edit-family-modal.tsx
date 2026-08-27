"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3, Loader2, Users } from "lucide-react";
import { updateFamilyNameAction } from "../actions/family-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface EditFamilyModalProps {
  familyId: string;
  currentName: string;
  triggerButton?: React.ReactNode;
}

export function EditFamilyModal({
  familyId,
  currentName,
  triggerButton,
}: EditFamilyModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t("familyManagement.namePlaceholder"));
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateFamilyNameAction(familyId, name);

      if (res.success) {
        toast.success(t("familyManagement.successMsg"));
        setOpen(false);
      } else {
        toast.error(res.error || t("familyManagement.errorMsg"));
      }
    } catch {
      toast.error(t("familyManagement.errorMsg"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-xs font-bold gap-2 text-slate-700 dark:text-slate-200"
          >
            <Edit3 className="h-3.5 w-3.5 text-blue-500" />
            {t("familyManagement.editFamilyBtn")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            {t("familyManagement.editFamilyTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("familyManagement.editFamilyDesc")}
          </p>

          <div className="space-y-2">
            <Label htmlFor="family-name" className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {t("familyManagement.nameLabel")}
            </Label>
            <Input
              id="family-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("familyManagement.namePlaceholder")}
              className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#07090E]/80 text-sm font-semibold"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-2xl text-xs font-bold"
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim() || name.trim() === currentName}
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("familyManagement.savingBtn")}
                </>
              ) : (
                t("familyManagement.saveBtn")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
