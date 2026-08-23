import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numeric value to Indonesian Rupiah (IDR) currency string
 * Example: 150000 -> "Rp 150.000"
 */
export function formatCurrency(amount: number, currency: string = "IDR"): string {
  if (isNaN(amount)) return "Rp 0";
  
  if (currency === "IDR") {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
    return formatted.replace("Rp", "Rp ");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Format Date object or ISO string to localized human readable date
 */
export function formatDate(date: string | Date, locale: string = "id-ID"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Truncate long string with ellipsis
 */
export function truncate(str: string, length: number = 30): string {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
}
