"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PieChart as PieIcon, Layers } from "lucide-react";
import type { CategoryBreakdownItem } from "../actions/analytics-actions";

interface CategoryDonutChartProps {
  data: CategoryBreakdownItem[];
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  if (data.length === 0) {
    return (
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-emerald-600" />
            Komposisi Pengeluaran Kategori
          </CardTitle>
        </CardHeader>
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Layers className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Belum ada pengeluaran pada rentang waktu ini</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoryBreakdownItem;
      return (
        <div className="bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
          <p className="text-slate-600 dark:text-slate-300">
            {formatCurrency(item.amount)} ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-emerald-600" />
          Komposisi Pengeluaran Kategori
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-full sm:w-1/2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
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
            <div key={item.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || "#10B981" }}
                />
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
