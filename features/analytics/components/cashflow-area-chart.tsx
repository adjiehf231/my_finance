"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Layers } from "lucide-react";
import type { CashflowTrendItem } from "../actions/analytics-actions";

interface CashflowAreaChartProps {
  data: CashflowTrendItem[];
}

export function CashflowAreaChart({ data }: CashflowAreaChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-display">
            Tren Arus Kas (Pemasukan vs Pengeluaran)
          </h3>
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Layers className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-xs font-medium">Belum ada data transaksi pada rentang waktu ini</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-[#06080D]/95 backdrop-blur-2xl p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.1] shadow-2xl text-xs space-y-2 min-w-[190px]">
          <p className="font-black text-slate-900 dark:text-white pb-1.5 border-b border-slate-100 dark:border-white/[0.06] font-display">{label}</p>
          <div className="flex items-center justify-between gap-3 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00F5A0]" />
              Pemasukan:
            </span>
            <span className="font-mono">{formatCurrency(payload[0]?.value || 0)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-rose-600 dark:text-rose-400 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              Pengeluaran:
            </span>
            <span className="font-mono">{formatCurrency(payload[1]?.value || 0)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-display">
              Tren Arus Kas Finansial
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Perbandingan arus kas masuk vs realisasi belanja</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-[#00F5A0] shadow-glow" />
            <span>Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5 font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-400/10 border border-rose-500/20 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-[#FF385C] shadow-glow-rose" />
            <span>Pengeluaran</span>
          </div>
        </div>
      </div>

      <div className="h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="neonIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00F5A0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="neonExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF385C" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF385C" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#94A3B8" opacity={0.12} vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
              tickFormatter={(val) =>
                val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}k`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#00F5A0"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#neonIncomeGradient)"
              activeDot={{ r: 6, fill: "#00F5A0", stroke: "#fff", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#FF385C"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#neonExpenseGradient)"
              activeDot={{ r: 6, fill: "#FF385C", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
