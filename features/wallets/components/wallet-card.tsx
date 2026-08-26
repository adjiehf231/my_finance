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
  Copy,
  Check,
  Edit3,
} from "lucide-react";
import { archiveWalletAction, type WalletItem } from "../actions/wallet-actions";
import { EditWalletModal } from "./edit-wallet-modal";
import { toast } from "sonner";

interface WalletCardProps {
  wallet: WalletItem | {
    id: string;
    name: string;
    type: string;
    account_number?: string | null;
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wallet.account_number) {
      navigator.clipboard.writeText(wallet.account_number);
      setCopied(true);
      toast.success("Nomor rekening/akun berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <>
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-xl shadow-sm hover:shadow-lg hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 overflow-hidden relative group">
        {/* Top decorative color bar */}
        <div
          className="h-1.5 w-full transition-all"
          style={{ backgroundColor: wallet.color || "#10B981" }}
        />

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                style={{ backgroundColor: wallet.color || "#10B981" }}
              >
                {getWalletIcon(wallet.type)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {wallet.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {getWalletTypeLabel(wallet.type)}
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-44 shadow-xl border border-slate-200 dark:border-slate-800">
                <DropdownMenuItem
                  onClick={() => setIsEditOpen(true)}
                  className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                  Edit Rekening
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleArchive}
                  disabled={isArchiving}
                  className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer text-xs"
                >
                  <Archive className="h-3.5 w-3.5 mr-2" />
                  Arsipkan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Account Number Display with instant 1-click copy */}
          {wallet.account_number && (
            <div className="mt-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/80 px-3 py-1.5 rounded-2xl text-xs font-mono text-slate-600 dark:text-slate-300">
              <span className="truncate tracking-wider font-semibold">{wallet.account_number}</span>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0 ml-2 p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800"
                title="Salin nomor rekening"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          )}

          {/* Balance Display */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
              Saldo Saat Ini
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              {formatCurrency(wallet.current_balance, wallet.currency)}
            </p>
          </div>
        </CardContent>
      </Card>

      <EditWalletModal
        wallet={wallet as WalletItem}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}
