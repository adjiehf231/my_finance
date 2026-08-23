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
import {
  Wallet as WalletIcon,
  Building2,
  Smartphone,
  CreditCard,
  TrendingUp,
  MoreVertical,
  Archive,
  Layers,
} from "lucide-react";
import { archiveWalletAction } from "../actions/wallet-actions";
import { toast } from "sonner";

interface WalletCardProps {
  wallet: {
    id: string;
    name: string;
    type: string;
    current_balance: number;
    initial_balance: number;
    color: string;
    icon: string;
    currency: string;
  };
  onUpdate?: () => void;
}

export function WalletCard({ wallet, onUpdate }: WalletCardProps) {
  const [isArchiving, setIsArchiving] = useState(false);

  const getWalletIcon = (type: string) => {
    switch (type) {
      case "bank":
        return <Building2 className="h-5 w-5" />;
      case "ewallet":
        return <Smartphone className="h-5 w-5" />;
      case "credit_card":
        return <CreditCard className="h-5 w-5" />;
      case "investment":
        return <TrendingUp className="h-5 w-5" />;
      case "cash":
        return <WalletIcon className="h-5 w-5" />;
      default:
        return <Layers className="h-5 w-5" />;
    }
  };

  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case "bank":
        return "Bank";
      case "ewallet":
        return "E-Wallet";
      case "credit_card":
        return "Kartu Kredit";
      case "investment":
        return "Investasi";
      case "cash":
        return "Tunai";
      default:
        return "Lainnya";
    }
  };

  const handleArchive = async () => {
    if (!confirm(`Yakin ingin mengarsipkan dompet "${wallet.name}"?`)) return;

    try {
      setIsArchiving(true);
      const res = await archiveWalletAction(wallet.id);
      if (res.success) {
        toast.success(`Dompet "${wallet.name}" berhasil diarsipkan`);
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal mengarsipkan dompet");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
      {/* Top decorative color bar */}
      <div
        className="h-1.5 w-full transition-all"
        style={{ backgroundColor: wallet.color || "#10B981" }}
      />

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: wallet.color || "#10B981" }}
            >
              {getWalletIcon(wallet.type)}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                {wallet.name}
              </h4>
              <Badge variant="secondary" className="mt-1 text-[11px] font-medium">
                {getWalletTypeLabel(wallet.type)}
              </Badge>
            </div>
          </div>

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
                onClick={handleArchive}
                disabled={isArchiving}
                className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40"
              >
                <Archive className="h-4 w-4 mr-2" />
                Arsipkan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Balance Display */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Saldo Saat Ini
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(wallet.current_balance, wallet.currency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
