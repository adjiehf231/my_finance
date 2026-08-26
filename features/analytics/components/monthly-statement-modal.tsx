"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Printer, FileText, CheckCircle } from "lucide-react";
import type { CategoryBreakdownItem } from "../actions/analytics-actions";

interface MonthlyStatementModalProps {
  familyName: string;
  currency?: string;
  periodMonthName: string; // e.g. "Agustus 2026"
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  netWorth: number;
  categories: CategoryBreakdownItem[];
}

export function MonthlyStatementModal({
  familyName,
  currency = "IDR",
  periodMonthName,
  totalIncome,
  totalExpense,
  netSavings,
  savingsRate,
  categories,
}: MonthlyStatementModalProps) {
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-2xl border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0D111A]/80 backdrop-blur-xl text-xs font-bold flex items-center gap-2 hover:border-blue-500/40 shadow-sm"
        >
          <FileText className="h-4 w-4 text-blue-500" />
          <span>Laporan Bulanan PDF</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0D111A] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
          <DialogTitle className="text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Laporan Keuangan Bulanan Resmi
          </DialogTitle>

          <Button
            onClick={handlePrint}
            className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 shadow-glow flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak / Simpan PDF</span>
          </Button>
        </DialogHeader>

        {/* Printable Document Sheet */}
        <div id="printable-statement" className="space-y-6 pt-4 text-slate-900 dark:text-slate-100">
          {/* Header Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 dark:border-white pb-4">
            <div>
              <h2 className="text-2xl font-black font-display tracking-tight">MY FINANCE STATEMENT</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Ruang Kerja: {familyName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black font-mono bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-xl">
                Periode {periodMonthName}
              </span>
            </div>
          </div>

          {/* KPI Executive Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/80 dark:border-white/[0.08]">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-display">Pemasukan</span>
              <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{formatCurrency(totalIncome, currency)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/80 dark:border-white/[0.08]">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-display">Pengeluaran</span>
              <p className="text-lg font-black font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                -{formatCurrency(totalExpense, currency)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/80 dark:border-white/[0.08]">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-display">Arus Bersih</span>
              <p className={`text-lg font-black font-mono mt-0.5 ${netSavings >= 0 ? "text-blue-600 dark:text-blue-400" : "text-rose-600"}`}>
                {formatCurrency(netSavings, currency)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/80 dark:border-white/[0.08]">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-display">Rasio Tabungan</span>
              <p className="text-lg font-black font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                {savingsRate}%
              </p>
            </div>
          </div>

          {/* Category Distribution Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
              Rincian Pengeluaran Berdasarkan Kategori
            </h4>
            <div className="border border-slate-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-[#07090E] border-b border-slate-200/80 dark:border-white/[0.08] font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4">Nama Pos Kategori</th>
                    <th className="py-2.5 px-4 text-center">Persentase</th>
                    <th className="py-2.5 px-4 text-right">Total Realisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] font-medium">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-slate-400">
                        Tidak ada pengeluaran tercatat di periode ini
                      </td>
                    </tr>
                  ) : (
                    categories.map((c) => (
                      <tr key={c.id || c.name}>
                        <td className="py-2.5 px-4 font-bold flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono">{c.percentage}%</td>
                        <td className="py-2.5 px-4 text-right font-black font-mono text-slate-900 dark:text-white">
                          {formatCurrency(c.amount, currency)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Validation Note */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
              Dokumen ini dihasilkan secara otomatis oleh sistem My Finance.
            </span>
            <span className="font-mono">{new Date().toLocaleString("id-ID")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
