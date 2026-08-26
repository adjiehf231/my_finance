"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, RotateCcw, Search, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export interface TransactionFilterValues {
  type?: "income" | "expense" | "transfer";
  walletId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

interface TransactionFilterDrawerProps {
  wallets: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: "income" | "expense" }>;
  filters: TransactionFilterValues;
  onApplyFilters: (newFilters: TransactionFilterValues) => void;
  onResetFilters: () => void;
}

export function TransactionFilterDrawer({
  wallets,
  categories,
  filters,
  onApplyFilters,
  onResetFilters,
}: TransactionFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Local form state
  const [type, setType] = useState<string>(filters.type || "all");
  const [walletId, setWalletId] = useState<string>(filters.walletId || "all");
  const [categoryId, setCategoryId] = useState<string>(filters.categoryId || "all");
  const [startDate, setStartDate] = useState<string>(filters.startDate || "");
  const [endDate, setEndDate] = useState<string>(filters.endDate || "");
  const [minAmount, setMinAmount] = useState<number | string>(filters.minAmount || "");
  const [maxAmount, setMaxAmount] = useState<number | string>(filters.maxAmount || "");
  const [search, setSearch] = useState<string>(filters.search || "");

  // Count active filters
  const activeCount = [
    type !== "all",
    walletId !== "all",
    categoryId !== "all",
    !!startDate,
    !!endDate,
    !!minAmount && Number(minAmount) > 0,
    !!maxAmount && Number(maxAmount) > 0,
    !!search.trim(),
  ].filter(Boolean).length;

  const handleApply = () => {
    onApplyFilters({
      type: type !== "all" ? (type as any) : undefined,
      walletId: walletId !== "all" ? walletId : undefined,
      categoryId: categoryId !== "all" ? categoryId : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minAmount: typeof minAmount === "number" && minAmount > 0 ? minAmount : undefined,
      maxAmount: typeof maxAmount === "number" && maxAmount > 0 ? maxAmount : undefined,
      search: search.trim() || undefined,
    });
    setOpen(false);
  };

  const handleReset = () => {
    setType("all");
    setWalletId("all");
    setCategoryId("all");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setSearch("");
    onResetFilters();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`rounded-2xl text-xs font-bold flex items-center gap-2 border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0D111A]/80 backdrop-blur-xl hover:border-blue-500/40 transition-all ${
            activeCount > 0
              ? "border-blue-500/40 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>{t("transactions.filterBtn")}</span>
          {activeCount > 0 && (
            <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center font-mono shadow-sm">
              {activeCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-between font-display">
            <span className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-500" />
              {t("transactions.filterDrawerTitle")}
            </span>
            {activeCount > 0 && (
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                {t("transactions.activeFilters", { count: activeCount })}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("common.search")}
            </Label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("transactions.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
              />
            </div>
          </div>

          {/* Transaction Type Tabs */}
          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("transactions.dateAndType")}
            </Label>
            <Tabs value={type} onValueChange={setType} className="w-full">
              <TabsList className="grid grid-cols-4 w-full h-11 rounded-2xl p-1 bg-slate-100 dark:bg-[#07090E] border border-slate-200/40 dark:border-white/[0.04]">
                <TabsTrigger value="all" className="rounded-xl text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#0D111A] data-[state=active]:shadow-sm">
                  {t("common.all")}
                </TabsTrigger>
                <TabsTrigger value="expense" className="rounded-xl text-xs font-bold data-[state=active]:bg-rose-500 data-[state=active]:text-white">
                  {t("transactions.expense")}
                </TabsTrigger>
                <TabsTrigger value="income" className="rounded-xl text-xs font-bold data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  {t("transactions.income")}
                </TabsTrigger>
                <TabsTrigger value="transfer" className="rounded-xl text-xs font-bold data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  {t("transactions.transfer")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("common.date")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1 font-medium">{t("transactions.startDate")}</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1 font-medium">{t("transactions.endDate")}</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                />
              </div>
            </div>
          </div>

          {/* Amount Range Picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              {t("common.amount")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1 font-medium">{t("transactions.minAmount")}</span>
                <CurrencyInput
                  value={minAmount}
                  onValueChange={setMinAmount}
                  placeholder="0"
                  className="text-base h-11 pl-10"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1 font-medium">{t("transactions.maxAmount")}</span>
                <CurrencyInput
                  value={maxAmount}
                  onValueChange={setMaxAmount}
                  placeholder="0"
                  className="text-base h-11 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Wallet & Category Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("common.wallet")}
              </Label>
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                  <SelectValue placeholder={t("transactions.allWallets")} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  <SelectItem value="all">{t("transactions.allWallets")}</SelectItem>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                {t("common.category")}
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]">
                  <SelectValue placeholder={t("transactions.allCategories")} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
                  <SelectItem value="all">{t("transactions.allCategories")}</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-white/[0.06] mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("transactions.resetFilter")}
          </Button>

          <Button
            type="button"
            onClick={handleApply}
            className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-6 shadow-glow flex items-center gap-1.5"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            {t("transactions.applyFilter")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
