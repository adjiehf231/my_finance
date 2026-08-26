"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/features/categories/components/category-badge";
import { ReceiptPreviewDialog } from "./receipt-preview-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  MoreVertical,
  Trash2,
  Receipt,
  Layers,
} from "lucide-react";
import { deleteTransactionAction, type TransactionWithDetails } from "../actions/transaction-actions";
import { EditTransactionModal } from "./edit-transaction-modal";
import { Edit3 } from "lucide-react";
import { toast } from "sonner";

interface TransactionTableProps {
  transactions: TransactionWithDetails[];
  categories?: Array<{ id: string; name: string; type: "income" | "expense"; color: string }>;
  onUpdate?: () => void;
}

export function TransactionTable({ transactions, categories = [], onUpdate }: TransactionTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithDetails | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus transaksi ini? Saldo dompet akan disesuaikan otomatis.")) return;

    try {
      setIsDeleting(id);
      const res = await deleteTransactionAction(id);
      if (res.success) {
        toast.success("Transaksi berhasil dihapus");
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal menghapus transaksi");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center bg-white dark:bg-[#131B2E] rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Layers className="h-7 w-7" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Tidak Ada Transaksi Ditemukan
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mt-1">
          Belum ada mutasi yang sesuai dengan filter pencarian ini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
      {/* Desktop Ledger Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-4 px-6">Tanggal & Tipe</th>
              <th className="py-4 px-6">Keterangan</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6">Rekening</th>
              <th className="py-4 px-6 text-right">Nominal</th>
              <th className="py-4 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {transactions.map((tx) => {
              const isIncome = tx.type === "income";
              const isTransfer = tx.type === "transfer";

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : isTransfer
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : isTransfer ? (
                          <ArrowRightLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {formatDate(tx.transaction_date)}
                        </p>
                        <p className="text-xs text-slate-400 capitalize">
                          {tx.type}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {tx.description || (isTransfer ? "Transfer Antar-Dompet" : "-")}
                    </p>
                    <p className="text-xs text-slate-400">
                      Oleh: {tx.users?.full_name || "Anggota"}
                    </p>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {isTransfer ? (
                      <span className="text-xs text-slate-400 italic">Transfer</span>
                    ) : (
                      <CategoryBadge category={tx.categories} />
                    )}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                    {isTransfer ? (
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>{tx.from_wallet?.name}</span>
                        <ArrowRightLeft className="h-3 w-3 text-slate-400" />
                        <span>{tx.to_wallet?.name}</span>
                      </div>
                    ) : (
                      <span className="font-medium">{tx.wallets?.name || "-"}</span>
                    )}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <span
                      className={`font-black text-base tracking-tight ${
                        isIncome
                          ? "text-emerald-600 dark:text-emerald-400"
                          : isTransfer
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isIncome ? "+" : isTransfer ? "" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {tx.attachment_url && (
                        <ReceiptPreviewDialog url={tx.attachment_url} />
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl">
                          <DropdownMenuItem
                            onClick={() => setEditingTransaction(tx)}
                            className="text-slate-700 dark:text-slate-200 cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4 mr-2 text-emerald-600" />
                            Edit Transaksi
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(tx.id)}
                            disabled={isDeleting === tx.id}
                            className="text-rose-600 focus:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Card Stream */}
      <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
        {transactions.map((tx) => {
          const isIncome = tx.type === "income";
          const isTransfer = tx.type === "transfer";

          return (
            <div key={tx.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : isTransfer
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : isTransfer ? (
                      <ArrowRightLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {tx.description || (isTransfer ? "Transfer Dana" : "Tanpa Judul")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(tx.transaction_date)} • {isTransfer ? `${tx.from_wallet?.name} ➔ ${tx.to_wallet?.name}` : tx.wallets?.name}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-base tracking-tight ${
                      isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : isTransfer
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncome ? "+" : isTransfer ? "" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div>
                  {!isTransfer && <CategoryBadge category={tx.categories} />}
                </div>

                <div className="flex items-center gap-2">
                  {tx.attachment_url && (
                    <ReceiptPreviewDialog
                      url={tx.attachment_url}
                      triggerButton={
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs rounded-lg">
                          <Receipt className="h-3 w-3 mr-1 text-emerald-600" /> Nota
                        </Button>
                      }
                    />
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTransaction(tx)}
                    className="h-7 px-2 text-xs rounded-lg"
                  >
                    <Edit3 className="h-3 w-3 mr-1 text-emerald-600" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(tx.id)}
                    disabled={isDeleting === tx.id}
                    className="h-7 px-2 text-xs text-rose-500 rounded-lg"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          categories={categories}
          open={!!editingTransaction}
          onOpenChange={(open) => {
            if (!open) setEditingTransaction(null);
          }}
          onSuccess={() => {
            setEditingTransaction(null);
            onUpdate?.();
          }}
        />
      )}
    </div>
  );
}
