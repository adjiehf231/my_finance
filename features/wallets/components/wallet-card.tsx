"use client";

import { useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import { archiveWalletAction, reconcileWalletBalanceAction, type WalletItem } from "../actions/wallet-actions";
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
  const [isReconciling, setIsReconciling] = useState(false);
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

  const handleReconcile = async () => {
    try {
      setIsReconciling(true);
      const res = await reconcileWalletBalanceAction(wallet.id);
      if (res.success) {
        if (res.discrepancy === 0) {
          toast.success(`Saldo "${wallet.name}" sudah 100% akurat dan sesuai buku kas.`);
        } else {
          toast.success(
            `Rekonsiliasi selesai! Selisih ${formatCurrency(res.discrepancy || 0)} berhasil disesuaikan.`
          );
        }
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal melakukan rekonsiliasi");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat rekonsiliasi");
    } finally {
      setIsReconciling(false);
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
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl shadow-sm hover:shadow-2xl hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group p-6">
        {/* Top holographic accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 transition-all"
          style={{ backgroundColor: wallet.color || "#2563EB" }}
        />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
              style={{ backgroundColor: wallet.color || "#2563EB" }}
            >
              {getWalletIcon(wallet.type)}
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight font-display">
                {wallet.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border-none">
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
            <DropdownMenuContent align="end" className="rounded-2xl w-48 shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
              <DropdownMenuItem
                onClick={() => setIsEditOpen(true)}
                className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-semibold"
              >
                <Edit3 className="h-3.5 w-3.5 mr-2 text-blue-600" />
                Edit Rekening
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleReconcile}
                disabled={isReconciling}
                className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-semibold"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-2 text-cyan-600 ${isReconciling ? "animate-spin" : ""}`} />
                Rekonsiliasi Saldo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleArchive}
                disabled={isArchiving}
                className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer text-xs font-semibold"
              >
                <Archive className="h-3.5 w-3.5 mr-2" />
                Arsipkan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Account Number Display with instant 1-click copy */}
        {wallet.account_number && (
          <div className="mt-3 flex items-center justify-between bg-slate-50/80 dark:bg-[#07090E]/80 border border-slate-200/60 dark:border-white/[0.06] px-3.5 py-2 rounded-2xl text-xs font-mono text-slate-600 dark:text-slate-300">
            <span className="truncate tracking-wider font-bold">{wallet.account_number}</span>
            <button
              type="button"
              onClick={handleCopyAccount}
              className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors shrink-0 ml-2 p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/[0.08]"
              title="Salin nomor rekening"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-blue-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}

        {/* Balance Display */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/[0.06]">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 font-display">
            Saldo Saat Ini
          </p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {formatCurrency(wallet.current_balance, wallet.currency)}
          </p>
        </div>
      </div>

      <EditWalletModal
        wallet={wallet as WalletItem}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}
