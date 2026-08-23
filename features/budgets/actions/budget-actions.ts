"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  upsertBudgetSchema,
  deleteBudgetSchema,
  type UpsertBudgetInput,
  type DeleteBudgetInput,
} from "@/lib/validations/budget";

export interface BudgetWithSpending {
  id: string;
  family_id: string;
  category_id: string;
  period_month: string;
  amount_limit: number;
  notify_threshold: number;
  spent_amount: number;
  remaining_amount: number;
  percentage: number;
  status: "safe" | "warning" | "danger" | "overbudget";
  categories: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

/**
 * Get all category budgets for a specific period month and compute actual spending
 */
export async function getBudgetsAction(familyId: string, periodMonth: string) {
  const supabase = await createClient();

  // 1. Fetch budgets for the month
  const { data: budgets, error: budgetError } = await (supabase as any)
    .from("budgets")
    .select(`
      *,
      categories:category_id (id, name, icon, color)
    `)
    .eq("family_id", familyId)
    .eq("period_month", periodMonth);

  if (budgetError) {
    return {
      success: false,
      error: budgetError.message,
      data: [] as BudgetWithSpending[],
      summary: { totalBudget: 0, totalSpent: 0, overallPercentage: 0 },
    };
  }

  // 2. Fetch all expense transactions for that family and month
  // Month string: "YYYY-MM-01"
  const [year, month] = periodMonth.split("-");
  const lastDay = new Date(Number(year), Number(month), 0).getDate();
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

  const { data: expenses } = await (supabase as any)
    .from("transactions")
    .select("category_id, amount")
    .eq("family_id", familyId)
    .eq("type", "expense")
    .eq("is_deleted", false)
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate);

  // Group spending by category_id
  const spendingMap = new Map<string, number>();
  let totalSpent = 0;

  (expenses || []).forEach((tx: any) => {
    if (tx.category_id) {
      const current = spendingMap.get(tx.category_id) || 0;
      spendingMap.set(tx.category_id, current + Number(tx.amount || 0));
    }
    totalSpent += Number(tx.amount || 0);
  });

  let totalBudget = 0;

  const result: BudgetWithSpending[] = (budgets || []).map((b: any) => {
    const limit = Number(b.amount_limit || 0);
    totalBudget += limit;
    const spent = spendingMap.get(b.category_id) || 0;
    const remaining = limit - spent;
    const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;

    let status: "safe" | "warning" | "danger" | "overbudget" = "safe";
    if (percentage > 100) {
      status = "overbudget";
    } else if (percentage >= (b.notify_threshold || 90)) {
      status = "danger";
    } else if (percentage >= 70) {
      status = "warning";
    }

    return {
      ...b,
      amount_limit: limit,
      spent_amount: spent,
      remaining_amount: remaining,
      percentage,
      status,
    };
  });

  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return {
    success: true,
    data: result,
    summary: {
      totalBudget,
      totalSpent,
      overallPercentage,
    },
  };
}

/**
 * Create or update a category budget limit for a month
 */
export async function upsertBudgetAction(input: UpsertBudgetInput) {
  try {
    const validated = upsertBudgetSchema.parse(input);
    const supabase = await createClient();

    const { data: budget, error } = await (supabase as any)
      .from("budgets")
      .upsert(
        {
          family_id: validated.familyId,
          category_id: validated.categoryId,
          period_month: validated.periodMonth,
          amount_limit: validated.amountLimit,
          notify_threshold: validated.notifyThreshold,
        },
        {
          onConflict: "family_id, category_id, period_month",
        }
      )
      .select()
      .single();

    if (error || !budget) {
      return {
        success: false,
        error: error?.message || "Gagal menyimpan batas anggaran",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/budgeting");

    return { success: true, data: budget };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Delete a budget limit
 */
export async function deleteBudgetAction(input: DeleteBudgetInput) {
  try {
    const validated = deleteBudgetSchema.parse(input);
    const supabase = await createClient();

    const { error } = await (supabase as any)
      .from("budgets")
      .delete()
      .eq("id", validated.budgetId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/budgeting");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
