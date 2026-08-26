"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createGoalSchema,
  updateGoalSchema,
  addGoalContributionSchema,
  type CreateGoalInput,
  type UpdateGoalInput,
  type AddGoalContributionInput,
} from "@/lib/validations/goal";

export interface GoalWithProgress {
  id: string;
  family_id: string;
  user_id: string | null;
  name: string;
  target_amount: number;
  current_amount: number;
  remaining_amount: number;
  percentage: number;
  target_date: string | null;
  days_left: number | null;
  priority: "low" | "medium" | "high";
  status: "in_progress" | "completed" | "cancelled";
  icon: string;
  color: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get all financial goals for a family workspace
 */
export async function getGoalsAction(familyId: string) {
  const supabase = await createClient();

  const { data: goals, error } = await (supabase as any)
    .from("financial_goals")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] as GoalWithProgress[] };
  }

  const today = new Date();

  const result: GoalWithProgress[] = (goals || []).map((g: any) => {
    const target = Number(g.target_amount || 0);
    const current = Number(g.current_amount || 0);
    const remaining = Math.max(0, target - current);
    const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

    let daysLeft: number | null = null;
    if (g.target_date) {
      const targetD = new Date(g.target_date);
      const diffTime = targetD.getTime() - today.getTime();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      ...g,
      target_amount: target,
      current_amount: current,
      remaining_amount: remaining,
      percentage,
      days_left: daysLeft,
    };
  });

  return { success: true, data: result };
}

/**
 * Create a new financial goal
 */
export async function createGoalAction(input: CreateGoalInput) {
  try {
    const validated = createGoalSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: goal, error } = await (supabase as any)
      .from("financial_goals")
      .insert({
        family_id: validated.familyId,
        user_id: user?.id || null,
        name: validated.name,
        target_amount: validated.targetAmount,
        current_amount: 0,
        target_date: validated.targetDate || null,
        priority: validated.priority,
        icon: validated.icon,
        color: validated.color,
        description: validated.description || null,
        status: "in_progress",
      })
      .select()
      .single();

    if (error || !goal) {
      return { success: false, error: error?.message || "Gagal membuat target tabungan" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/goals");

    return { success: true, data: goal };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Update financial goal
 */
export async function updateGoalAction(input: UpdateGoalInput) {
  try {
    const validated = updateGoalSchema.parse(input);
    const supabase = await createClient();

    const { data: goal, error } = await (supabase as any)
      .from("financial_goals")
      .update({
        ...(validated.name && { name: validated.name }),
        ...(validated.targetAmount !== undefined && { target_amount: validated.targetAmount }),
        ...(validated.targetDate !== undefined && { target_date: validated.targetDate }),
        ...(validated.priority && { priority: validated.priority }),
        ...(validated.status && { status: validated.status }),
        ...(validated.color && { color: validated.color }),
        ...(validated.description !== undefined && { description: validated.description }),
      })
      .eq("id", validated.goalId)
      .select()
      .single();

    if (error || !goal) {
      return { success: false, error: error?.message || "Gagal memperbarui target" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/goals");

    return { success: true, data: goal };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Add a contribution / savings deposit to a goal from a wallet
 */
export async function addGoalContributionAction(input: AddGoalContributionInput) {
  try {
    const validated = addGoalContributionSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    // 1. Insert into goal_contributions (triggers current_amount increase on goal)
    const { data: contribution, error: contribError } = await (supabase as any)
      .from("goal_contributions")
      .insert({
        goal_id: validated.goalId,
        family_id: validated.familyId,
        user_id: user.id,
        wallet_id: validated.walletId,
        amount: validated.amount,
        contribution_date: validated.contributionDate,
        notes: validated.notes || null,
      })
      .select()
      .single();

    if (contribError || !contribution) {
      return {
        success: false,
        error: `Gagal mencatat setoran tabungan: ${contribError?.message}`,
      };
    }

    // 2. Insert expense transaction to deduct from wallet
    await (supabase as any).from("transactions").insert({
      family_id: validated.familyId,
      user_id: user.id,
      wallet_id: validated.walletId,
      type: "expense",
      amount: validated.amount,
      transaction_date: validated.contributionDate,
      description: `Alokasi Tabungan: ${validated.notes || "Setoran Goal"}`,
      is_deleted: false,
    });

    revalidatePath("/dashboard");
    revalidatePath("/goals");
    revalidatePath("/wallets");
    revalidatePath("/transactions");

    return { success: true, data: contribution };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Get contribution history for a goal
 */
export async function getGoalContributionsAction(goalId: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("goal_contributions")
    .select(`
      *,
      wallets:wallet_id (id, name, color),
      users:user_id (id, full_name, avatar_url)
    `)
    .eq("goal_id", goalId)
    .order("contribution_date", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data };
}

/**
 * Delete a financial goal
 */
export async function deleteGoalAction(goalId: string) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("financial_goals")
    .delete()
    .eq("id", goalId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/goals");

  return { success: true };
}
