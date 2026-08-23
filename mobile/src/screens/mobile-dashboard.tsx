import React from "react";
import { formatCurrency } from "@/lib/utils";

export interface MobileDashboardProps {
  familyName: string;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netWorth: number;
  isSyncing: boolean;
  onAddPress: () => void;
  onScanPress: () => void;
  onSyncPress: () => void;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense" | "transfer";
    date: string;
  }>;
}

export function MobileDashboardScreen({
  familyName,
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  netWorth,
  isSyncing,
  onAddPress,
  onScanPress,
  onSyncPress,
  recentTransactions,
}: MobileDashboardProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">My Finance Mobile</h1>
          <p className="text-xs text-slate-500">{familyName}</p>
        </div>
        <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
          {isSyncing ? "Menyinkronkan..." : "Sinkron"}
        </span>
      </header>

      <section className="p-4 bg-slate-900 text-white rounded-3xl space-y-2">
        <p className="text-xs text-slate-400">Total Saldo</p>
        <h2 className="text-2xl font-bold">{formatCurrency(totalBalance)}</h2>
        <div className="flex gap-4 text-xs pt-2 border-t border-slate-800">
          <span className="text-emerald-400">+{formatCurrency(monthlyIncome)}</span>
          <span className="text-rose-400">-{formatCurrency(monthlyExpense)}</span>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onAddPress}
          className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold text-center"
        >
          Catat Transaksi
        </button>
        <button
          onClick={onScanPress}
          className="p-3 bg-slate-800 text-white rounded-2xl text-xs font-bold text-center"
        >
          Scan Nota
        </button>
        <button
          onClick={onSyncPress}
          className="p-3 bg-slate-100 text-slate-800 rounded-2xl text-xs font-bold text-center"
        >
          Sinkronisasi
        </button>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-bold">Transaksi Terkini</h3>
        <div className="space-y-1.5">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              className="p-3 bg-white dark:bg-slate-800 border rounded-2xl flex items-center justify-between text-xs"
            >
              <span>{t.description}</span>
              <span className="font-bold">{formatCurrency(t.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
