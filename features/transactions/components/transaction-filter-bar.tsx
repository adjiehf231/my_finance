"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface TransactionFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  walletId: string;
  onWalletChange: (val: string) => void;
  wallets: Array<{ id: string; name: string }>;
}

export function TransactionFilterBar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  walletId,
  onWalletChange,
  wallets,
}: TransactionFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari transaksi berdasarkan catatan..."
          className="pl-10 h-11 rounded-2xl bg-white dark:bg-[#131B2E]"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Type Filter */}
      <div className="w-full sm:w-44">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="h-11 rounded-2xl bg-white dark:bg-[#131B2E]">
            <SelectValue placeholder="Semua Jenis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Jenis</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wallet Filter */}
      <div className="w-full sm:w-48">
        <Select value={walletId} onValueChange={onWalletChange}>
          <SelectTrigger className="h-11 rounded-2xl bg-white dark:bg-[#131B2E]">
            <SelectValue placeholder="Semua Dompet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Rekening</SelectItem>
            {wallets.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
