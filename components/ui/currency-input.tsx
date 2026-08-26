"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";

export function formatRupiahRaw(rawString: string): string {
  // Remove non-digit characters
  const cleanDigits = rawString.replace(/\D/g, "");
  if (!cleanDigits) return "";
  const num = parseInt(cleanDigits, 10);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("id-ID").format(num);
}

export function parseRupiahToNumber(formattedString: string): number {
  const cleanDigits = formattedString.replace(/\D/g, "");
  if (!cleanDigits) return 0;
  const parsed = parseInt(cleanDigits, 10);
  return isNaN(parsed) ? 0 : parsed;
}

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number | string;
  onValueChange: (numericValue: number) => void;
  className?: string;
  currencyPrefix?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onValueChange,
      className = "",
      currencyPrefix = "Rp",
      placeholder = "0",
      disabled,
      ...props
    },
    ref
  ) => {
    const formatValue = useCallback((val: number | string): string => {
      if (val === undefined || val === null || val === "" || val === 0) {
        return "";
      }
      const num = typeof val === "string" ? parseRupiahToNumber(val) : val;
      return num > 0 ? new Intl.NumberFormat("id-ID").format(num) : "";
    }, []);

    const [displayValue, setDisplayValue] = useState<string>(() => formatValue(value));

    useEffect(() => {
      setDisplayValue(formatValue(value));
    }, [value, formatValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      const formatted = formatRupiahRaw(rawInput);
      setDisplayValue(formatted);
      const numeric = parseRupiahToNumber(formatted);
      onValueChange(numeric);
    };

    return (
      <div className="relative w-full">
        {currencyPrefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg font-mono pointer-events-none select-none">
            {currencyPrefix}
          </span>
        )}
        <Input
          {...props}
          ref={ref}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          className={`pl-12 text-2xl sm:text-3xl font-black h-14 rounded-2xl tracking-tight font-mono bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08] ${className}`}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
