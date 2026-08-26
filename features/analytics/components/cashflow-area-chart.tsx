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
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Tren Arus Kas (Pemasukan vs Pengeluaran)
          </h3>
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Layers className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Belum ada data transaksi pada rentang waktu ini</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-2xl p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.1] shadow-2xl text-xs space-y-1.5 min-w-[170px]">
          <p className="font-extrabold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800/80">{label}</p>
          <div className="flex items-center justify-between gap-3 text-emerald-600 dark:text-emerald-400 font-bold">
            <span>Pemasukan:</span>
            <span className="font-mono">{formatCurrency(payload[0]?.value || 0)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-rose-600 dark:text-rose-400 font-bold">
            <span>Pengeluaran:</span>
            <span className="font-mono">{formatCurrency(payload[1]?.value || 0)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Tren Arus Kas (Pemasukan vs Pengeluaran)
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Pengeluaran</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.08} vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              tickFormatter={(val) =>
                val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${val / 1000}k`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#F43F5E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
