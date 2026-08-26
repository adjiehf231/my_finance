"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TransactionFilterDrawer, TransactionFilterValues } from "./transaction-filter-drawer";
import { TransactionTable } from "./transaction-table";
import type { TransactionWithDetails } from "../actions/transaction-actions";
import { AddTransactionModal } from "./add-transaction-modal";
import { Input } from "@/components/ui/input";
import { Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TransactionsViewProps {
  familyId: string;
  transactions: TransactionWithDetails[];
  wallets: Array<{ id: string; name: string; type: string; color: string }>;
  categories: Array<{ id: string; name: string; type: "income" | "expense"; color: string }>;
  initialFilters: TransactionFilterValues;
}

export function TransactionsView({
  familyId,
  transactions,
  wallets,
  categories,
  initialFilters,
}: TransactionsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleApplyFilters = (newFilters: TransactionFilterValues) => {
    const params = new URLSearchParams();
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.walletId) params.set("walletId", newFilters.walletId);
    if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
    if (newFilters.startDate) params.set("startDate", newFilters.startDate);
    if (newFilters.endDate) params.set("endDate", newFilters.endDate);
    if (newFilters.minAmount) params.set("minAmount", String(newFilters.minAmount));
    if (newFilters.maxAmount) params.set("maxAmount", String(newFilters.maxAmount));
    if (newFilters.search) params.set("search", newFilters.search);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  const handleQuickSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = (e.target as HTMLInputElement).value;
      const params = new URLSearchParams(searchParams.toString());
      if (val.trim()) {
        params.set("search", val.trim());
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 dark:bg-[#0D111A]/70 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari transaksi cepat... (Tekan Enter)"
            defaultValue={initialFilters.search || ""}
            onKeyDown={handleQuickSearch}
            className="pl-10 h-10 rounded-2xl bg-white/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08] text-xs font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <TransactionFilterDrawer
            wallets={wallets}
            categories={categories}
            filters={initialFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
          <Link href="/categories">
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200/80 dark:border-white/[0.08] text-xs font-bold gap-1.5 bg-white/80 dark:bg-[#0D111A]/80 backdrop-blur-xl hover:border-blue-500/40"
            >
              <Tags className="h-3.5 w-3.5 text-blue-500" />
              <span>Kategori</span>
            </Button>
          </Link>
          <AddTransactionModal
            familyId={familyId}
            wallets={wallets}
            categories={categories}
            onSuccess={() => router.refresh()}
          />
        </div>
      </div>

      {/* Ledger Table */}
      <TransactionTable
        transactions={transactions}
        categories={categories}
        onUpdate={() => router.refresh()}
      />
    </div>
  );
}
