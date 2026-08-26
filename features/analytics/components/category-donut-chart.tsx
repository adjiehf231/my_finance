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
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <PieIcon className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Komposisi Pengeluaran
          </h3>
        </div>
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Layers className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Belum ada pengeluaran pada periode ini</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoryBreakdownItem;
      return (
        <div className="bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-2xl p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.1] shadow-2xl text-xs space-y-1">
          <p className="font-extrabold text-slate-900 dark:text-white">{item.name}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
            {formatCurrency(item.amount)} ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
          <PieIcon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Komposisi Pengeluaran
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-full sm:w-1/2 h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || "#10B981"}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Category List */}
        <div className="w-full sm:w-1/2 space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {data.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color || "#10B981" }}
                />
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">
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
