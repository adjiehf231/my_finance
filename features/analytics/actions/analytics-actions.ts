"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getTimeframeDateRange,
  type TimeframeType,
} from "@/lib/validations/analytics";

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  transactionCount: number;
}

export interface CashflowTrendItem {
  period: string; // e.g. "01 Aug" or "Aug 2026"
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdownItem {
  id: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface NetWorthSummary {
  totalWalletBalance: number;
  totalReceivables: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

/**
 * Get financial analytics summary metrics
 */
export async function getAnalyticsSummaryAction(
  familyId: string,
  timeframe: TimeframeType = "this_month"
) {
  const { startDate, endDate } = getTimeframeDateRange(timeframe);
  const supabase = await createClient();

  const { data: transactions, error } = await (supabase as any)
    .from("transactions")
    .select("type, amount")
    .eq("family_id", familyId)
    .eq("is_deleted", false)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);

  if (error) {
    return {
      success: false,
      error: error.message,
      data: {
        totalIncome: 0,
        totalExpense: 0,
        netSavings: 0,
        savingsRate: 0,
        transactionCount: 0,
      } as AnalyticsSummary,
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;

  (transactions || []).forEach((t: any) => {
    const amt = Number(t.amount || 0);
    if (t.type === "income") totalIncome += amt;
    else if (t.type === "expense") totalExpense += amt;
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  return {
    success: true,
    data: {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      transactionCount: (transactions || []).length,
    } as AnalyticsSummary,
  };
}

/**
 * Get daily or monthly aggregated cashflow trend for Recharts
 */
export async function getCashflowTrendAction(
  familyId: string,
  timeframe: TimeframeType = "this_month"
) {
  const { startDate, endDate } = getTimeframeDateRange(timeframe);
  const supabase = await createClient();

  const { data: transactions, error } = await (supabase as any)
    .from("transactions")
    .select("type, amount, transaction_date")
    .eq("family_id", familyId)
    .eq("is_deleted", false)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)
    .order("transaction_date", { ascending: true });

  if (error) {
    return { success: false, error: error.message, data: [] as CashflowTrendItem[] };
  }

  const map = new Map<string, { income: number; expense: number }>();

  (transactions || []).forEach((t: any) => {
    const isMonthlyGrouping = timeframe === "last_6_months" || timeframe === "this_year";
    const key = isMonthlyGrouping
      ? t.transaction_date.substring(0, 7) // "YYYY-MM"
      : t.transaction_date; // "YYYY-MM-DD"

    const current = map.get(key) || { income: 0, expense: 0 };
    const amt = Number(t.amount || 0);

    if (t.type === "income") current.income += amt;
    else if (t.type === "expense") current.expense += amt;

    map.set(key, current);
  });

  const result: CashflowTrendItem[] = Array.from(map.entries()).map(([period, val]) => ({
    period,
    income: val.income,
    expense: val.expense,
    net: val.income - val.expense,
  }));

  return { success: true, data: result };
}

/**
 * Get category spending breakdown for Donut Chart
 */
export async function getCategoryBreakdownAction(
  familyId: string,
  timeframe: TimeframeType = "this_month"
) {
  const { startDate, endDate } = getTimeframeDateRange(timeframe);
  const supabase = await createClient();

  const { data: transactions, error } = await (supabase as any)
    .from("transactions")
    .select(`
      amount,
      category_id,
      categories:category_id (id, name, color)
    `)
    .eq("family_id", familyId)
    .eq("type", "expense")
    .eq("is_deleted", false)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);

  if (error) {
    return { success: false, error: error.message, data: [] as CategoryBreakdownItem[] };
  }

  const categoryMap = new Map<string, { name: string; color: string; amount: number }>();
  let totalExpense = 0;

  (transactions || []).forEach((t: any) => {
    const amt = Number(t.amount || 0);
    totalExpense += amt;

    const catId = t.category_id || "uncategorized";
    const catName = t.categories?.name || "Lainnya";
    const catColor = t.categories?.color || "#94A3B8";

    const current = categoryMap.get(catId) || { name: catName, color: catColor, amount: 0 };
    current.amount += amt;
    categoryMap.set(catId, current);
  });

  const result: CategoryBreakdownItem[] = Array.from(categoryMap.entries())
    .map(([id, val]) => ({
      id,
      name: val.name,
      color: val.color,
      amount: val.amount,
      percentage: totalExpense > 0 ? Math.round((val.amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return { success: true, data: result };
}

/**
 * Get family Net Worth (Assets - Liabilities)
 */
export async function getNetWorthSummaryAction(familyId: string) {
  const supabase = await createClient();

  const [walletsRes, debtsRes] = await Promise.all([
    (supabase as any)
      .from("wallets")
      .select("current_balance")
      .eq("family_id", familyId)
      .eq("is_active", true),
    (supabase as any)
      .from("debts")
      .select("type, remaining_amount")
      .eq("family_id", familyId)
      .eq("status", "active"),
  ]);

  let totalWalletBalance = 0;
  (walletsRes.data || []).forEach((w: any) => {
    totalWalletBalance += Number(w.current_balance || 0);
  });

  let totalReceivables = 0;
  let totalLiabilities = 0;

  (debtsRes.data || []).forEach((d: any) => {
    const remaining = Number(d.remaining_amount || 0);
    if (d.type === "debt_receivable") {
      totalReceivables += remaining;
    } else if (d.type === "loan_payable") {
      totalLiabilities += remaining;
    }
  });

  const totalAssets = totalWalletBalance + totalReceivables;
  const netWorth = totalAssets - totalLiabilities;

  return {
    success: true,
    data: {
      totalWalletBalance,
      totalReceivables,
      totalAssets,
      totalLiabilities,
      netWorth,
    } as NetWorthSummary,
  };
}
