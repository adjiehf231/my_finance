"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { PieChart as PieIcon, Layers } from "lucide-react";
import type { CategoryBreakdownItem } from "../actions/analytics-actions";

interface CategoryDonutChartProps {
  data: CategoryBreakdownItem[];
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <PieIcon className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-display">
            Komposisi Pengeluaran
          </h3>
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Layers className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-xs font-medium">Belum ada pengeluaran pada periode ini</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoryBreakdownItem;
      return (
        <div className="bg-white/95 dark:bg-[#06080D]/95 backdrop-blur-2xl p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.1] shadow-2xl text-xs space-y-1">
          <p className="font-black text-slate-900 dark:text-white font-display">{item.name}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
            {formatCurrency(item.amount)} ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-2xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
          <PieIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 font-display">
            Distribusi Kategori
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">Alokasi pos belanja keluarga</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-full sm:w-1/2 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                innerRadius={58}
                outerRadius={84}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || "#00F5A0"}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-display">Kategori</span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{data.length}</span>
          </div>
        </div>

        {/* Legend / Category List */}
        <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-1">
          {data.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs p-2.5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors">
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color || "#00F5A0" }}
                />
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-black text-slate-900 dark:text-white font-mono">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
