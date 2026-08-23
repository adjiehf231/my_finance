"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Receipt, ExternalLink } from "lucide-react";

interface ReceiptPreviewDialogProps {
  url: string;
  triggerButton?: React.ReactNode;
}

export function ReceiptPreviewDialog({
  url,
  triggerButton,
}: ReceiptPreviewDialogProps) {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-900 rounded-xl"
          >
            <Receipt className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            Nota
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold">
              Bukti Struk / Nota Transaksi
            </DialogTitle>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
            >
              Buka Tab Baru <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </DialogHeader>

        <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center max-h-[70vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Struk Transaksi"
            className="w-full h-auto object-contain rounded-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
