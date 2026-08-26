"use client";

import { useState, useOptimistic, startTransition } from "react";
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
  Edit3,
} from "lucide-react";
import { deleteTransactionAction, type TransactionWithDetails } from "../actions/transaction-actions";
import { EditTransactionModal } from "./edit-transaction-modal";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface TransactionTableProps {
  transactions: TransactionWithDetails[];
  categories?: Array<{ id: string; name: string; type: "income" | "expense"; color: string }>;
  onUpdate?: () => void;
}

type OptimisticAction = { type: "delete"; id: string };

export function TransactionTable({ transactions, categories = [], onUpdate }: TransactionTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithDetails | null>(null);
  const { t, locale } = useTranslation();

  // Zero-Latency Optimistic State
  const [optimisticTransactions, setOptimisticTransactions] = useOptimistic(
    transactions,
    (state: TransactionWithDetails[], action: OptimisticAction) => {
      if (action.type === "delete") {
        return state.filter((t) => t.id !== action.id);
      }
      return state;
    }
  );

  const handleDelete = async (id: string) => {
    if (!confirm(t("transactions.deleteConfirm"))) return;

    startTransition(async () => {
      // 0ms instant UI update
      setOptimisticTransactions({ type: "delete", id });

      try {
        setIsDeleting(id);
        const res = await deleteTransactionAction(id);
        if (res.success) {
          toast.success(t("transactions.deleteSuccess"));
          onUpdate?.();
        } else {
          toast.error(res.error || t("transactions.deleteError"));
          onUpdate?.();
        }
      } catch {
        toast.error("System error");
        onUpdate?.();
      } finally {
        setIsDeleting(null);
      }
    });
  };

  if (optimisticTransactions.length === 0) {
    return (
      <div className="py-16 text-center bg-white/80 dark:bg-[#0D111A]/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/[0.08] p-8 shadow-sm">
        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400">
          <Layers className="h-7 w-7" />
        </div>
        <h4 className="text-base font-black text-slate-900 dark:text-white font-display">
          {t("transactions.noTransactions")}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mt-1 font-medium">
          {t("transactions.noTransactionsSubtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
      {/* Desktop Ledger Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/70 dark:bg-[#07090E]/60 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.06] font-display">
            <tr>
              <th className="py-4 px-6">{t("transactions.dateAndType")}</th>
              <th className="py-4 px-6">{t("common.description")}</th>
              <th className="py-4 px-6">{t("common.category")}</th>
              <th className="py-4 px-6">{t("transactions.account")}</th>
              <th className="py-4 px-6 text-right">{t("common.amount")}</th>
              <th className="py-4 px-4 text-center">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {optimisticTransactions.map((tx) => {
              const isIncome = tx.type === "income";
              const isTransfer = tx.type === "transfer";

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          isIncome
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : isTransfer
                            ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                            : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
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
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                          {formatDate(tx.transaction_date)}
                        </p>
                        <p className="text-[11px] text-slate-400 capitalize font-medium">
                          {tx.type === "income" ? t("transactions.income") : tx.type === "expense" ? t("transactions.expense") : t("transactions.transfer")}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {tx.description || (isTransfer ? t("transactions.transfer") : "-")}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {t("transactions.byMember")}: {tx.users?.full_name || (locale === "en" ? "Member" : "Anggota")}
                    </p>
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap">
                    {isTransfer ? (
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-500/20">
                        {t("transactions.transfer")}
                      </span>
                    ) : (
                      <CategoryBadge category={tx.categories} />
                    )}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                    {isTransfer ? (
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span>{tx.from_wallet?.name}</span>
                        <ArrowRightLeft className="h-3 w-3 text-slate-400" />
                        <span>{tx.to_wallet?.name}</span>
                      </div>
                    ) : (
                      <span className="font-bold bg-slate-100 dark:bg-[#07090E] border border-slate-200/60 dark:border-white/[0.06] px-2.5 py-1 rounded-xl font-mono">
                        {tx.wallets?.name || "-"}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <span
                      className={`font-black text-sm sm:text-base tracking-tight font-mono ${
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
                            className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl w-40 shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                          <DropdownMenuItem
                            onClick={() => setEditingTransaction(tx)}
                            className="text-slate-700 dark:text-slate-200 cursor-pointer text-xs font-semibold"
                          >
                            <Edit3 className="h-3.5 w-3.5 mr-2 text-blue-600" />
                            {t("common.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(tx.id)}
                            disabled={isDeleting === tx.id}
                            className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer text-xs font-semibold"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            {t("common.delete")}
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
      <div className="md:hidden divide-y divide-slate-100 dark:divide-white/[0.04]">
        {optimisticTransactions.map((tx) => {
          const isIncome = tx.type === "income";
          const isTransfer = tx.type === "transfer";

          return (
            <div key={tx.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isIncome
                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : isTransfer
                        ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                        : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
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
                    <p className="font-black text-sm text-slate-900 dark:text-white leading-tight font-display">
                      {tx.description || (isTransfer ? t("transactions.transfer") : (locale === "en" ? "Untitled" : "Tanpa Judul"))}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">
                      {formatDate(tx.transaction_date)} • {isTransfer ? `${tx.from_wallet?.name} ➔ ${tx.to_wallet?.name}` : tx.wallets?.name}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-sm tracking-tight font-mono block ${
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
                  {!isTransfer ? (
                    <CategoryBadge category={tx.categories} />
                  ) : (
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-500/20">
                      {t("transactions.transfer")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {tx.attachment_url && (
                    <ReceiptPreviewDialog
                      url={tx.attachment_url}
                      triggerButton={
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs rounded-xl border-slate-200 dark:border-white/[0.08] font-bold">
                          <Receipt className="h-3 w-3 mr-1 text-blue-600" /> {t("transactions.receipt")}
                        </Button>
                      }
                    />
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTransaction(tx)}
                    className="h-7 px-2 text-xs rounded-xl border-slate-200 dark:border-white/[0.08] font-bold"
                  >
                    <Edit3 className="h-3 w-3 mr-1 text-blue-600" /> {t("common.edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(tx.id)}
                    disabled={isDeleting === tx.id}
                    className="h-7 px-2 text-xs text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold"
                  >
                    {t("common.delete")}
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
