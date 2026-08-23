"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthSelectorProps {
  currentPeriod: string; // "YYYY-MM-01"
}

export function MonthSelector({ currentPeriod }: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [yearStr, monthStr] = currentPeriod.split("-");
  const currentDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);

  const formattedMonth = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  const handleNavigate = (delta: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + delta);

    const nextYear = nextDate.getFullYear();
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, "0");
    const nextPeriod = `${nextYear}-${nextMonth}-01`;

    const params = new URLSearchParams(searchParams.toString());
    params.set("month", nextPeriod);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 p-1.5 rounded-2xl shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleNavigate(-1)}
        className="h-8 w-8 rounded-xl"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 px-3 text-sm font-bold text-slate-900 dark:text-white">
        <Calendar className="h-4 w-4 text-emerald-600" />
        <span>{formattedMonth}</span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleNavigate(1)}
        className="h-8 w-8 rounded-xl"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
