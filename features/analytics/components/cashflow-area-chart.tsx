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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Layers } from "lucide-react";
import type { CashflowTrendItem } from "../actions/analytics-actions";

interface CashflowAreaChartProps {
  data: CashflowTrendItem[];
}

export function CashflowAreaChart({ data }: CashflowAreaChartProps) {
  if (data.length === 0) {
    return (
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Tren Arus Kas (Pemasukan vs Pengeluaran)
          </CardTitle>
        </CardHeader>
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Layers className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Belum ada data transaksi pada rentang waktu ini</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-1">
          <p className="font-bold text-slate-900 dark:text-white mb-1.5">{label}</p>
          <p className="text-emerald-600 font-semibold flex items-center justify-between gap-4">
            <span>Pemasukan:</span>
            <span>{formatCurrency(payload[0]?.value || 0)}</span>
          </p>
          <p className="text-rose-600 font-semibold flex items-center justify-between gap-4">
            <span>Pengeluaran:</span>
            <span>{formatCurrency(payload[1]?.value || 0)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm">
      <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Tren Arus Kas (Pemasukan vs Pengeluaran)
        </CardTitle>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-rose-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Pengeluaran</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
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
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
