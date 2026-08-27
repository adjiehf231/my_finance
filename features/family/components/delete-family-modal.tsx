"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteFamilyWorkspaceAction } from "../actions/family-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface DeleteFamilyModalProps {
  familyId: string;
  familyName: string;
  triggerButton?: React.ReactNode;
}

export function DeleteFamilyModal({
  familyId,
  familyName,
  triggerButton,
}: DeleteFamilyModalProps) {
  const [open, setOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { t, locale } = useTranslation();

  const isNameMatching = confirmName.trim().toLowerCase() === familyName.trim().toLowerCase();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameMatching) {
      toast.error(t("familyManagement.deleteNameMismatch"));
      return;
    }

    try {
      setIsDeleting(true);
      const res = await deleteFamilyWorkspaceAction(familyId, confirmName);

      if (res.success) {
        toast.success(t("familyManagement.deleteSuccess"));
        setOpen(false);
        router.push("/onboarding");
      } else {
        toast.error(res.error || t("familyManagement.deleteError"));
      }
    } catch {
      toast.error(t("familyManagement.deleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("familyManagement.deleteFamilyBtn")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border-rose-200 dark:border-rose-900/30">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <div className="h-9 w-9 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            {t("familyManagement.deleteModalTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleDelete} className="space-y-4 pt-1">
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-medium">
            {t("familyManagement.deleteModalDesc")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-family-name" className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {t("familyManagement.deleteConfirmPrompt", { name: familyName })}
            </Label>
            <Input
              id="confirm-family-name"
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={familyName}
              className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#07090E]/80 text-sm font-semibold"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-2xl text-xs font-bold"
              disabled={isDeleting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isDeleting || !isNameMatching}
              className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 gap-1.5 shadow-md shadow-rose-600/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t("familyManagement.deletingBtn")}
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("familyManagement.deleteConfirmBtn")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
