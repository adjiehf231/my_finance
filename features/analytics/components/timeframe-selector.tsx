"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type TimeframeType } from "@/lib/validations/analytics";

interface TimeframeSelectorProps {
  currentTimeframe: TimeframeType;
}

const TIMEFRAMES: Array<{ value: TimeframeType; label: string }> = [
  { value: "this_month", label: "Bulan Ini" },
  { value: "last_3_months", label: "3 Bulan Terakhir" },
  { value: "last_6_months", label: "6 Bulan" },
  { value: "this_year", label: "Tahun Ini (YTD)" },
];

export function TimeframeSelector({ currentTimeframe }: TimeframeSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (val: TimeframeType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeframe", val);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
      {TIMEFRAMES.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => handleSelect(t.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentTimeframe === t.value
              ? "bg-white dark:bg-[#131B2E] text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
