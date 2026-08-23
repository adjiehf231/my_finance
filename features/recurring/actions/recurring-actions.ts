"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createRecurringSchema,
  updateRecurringSchema,
  type CreateRecurringInput,
  type UpdateRecurringInput,
} from "@/lib/validations/recurring";

export interface RecurringWithDetails {
  id: string;
  family_id: string;
  user_id: string;
  wallet_id: string;
  category_id: string | null;
  type: "income" | "expense";
  amount: number;
  name: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string | null;
  next_execution_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  wallets?: {
    id: string;
    name: string;
    color: string;
  } | null;
  categories?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

/**
 * Get all recurring transaction schedules for a family
 */
export async function getRecurringTransactionsAction(familyId: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("recurring_transactions")
    .select(`
      *,
      wallets:wallet_id (id, name, color),
      categories:category_id (id, name, color)
    `)
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      error: error.message,
      data: [] as RecurringWithDetails[],
    };
  }

  return {
    success: true,
    data: (data || []) as RecurringWithDetails[],
  };
}

/**
 * Create a new recurring transaction schedule
 */
export async function createRecurringTransactionAction(input: CreateRecurringInput) {
  try {
    const validated = createRecurringSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    const { data: recurring, error } = await (supabase as any)
      .from("recurring_transactions")
      .insert({
        family_id: validated.familyId,
        user_id: user.id,
        wallet_id: validated.walletId,
        category_id: validated.categoryId || null,
        type: validated.type,
        amount: validated.amount,
        name: validated.name,
        frequency: validated.frequency,
        start_date: validated.startDate,
        end_date: validated.endDate || null,
        next_execution_date: validated.startDate,
        is_active: true,
      })
      .select()
      .single();

    if (error || !recurring) {
      return {
        success: false,
        error: error?.message || "Gagal menjadwalkan transaksi berulang",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/recurring");

    return { success: true, data: recurring };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Update recurring schedule details
 */
export async function updateRecurringTransactionAction(input: UpdateRecurringInput) {
  try {
    const validated = updateRecurringSchema.parse(input);
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from("recurring_transactions")
      .update({
        ...(validated.name && { name: validated.name }),
        ...(validated.amount !== undefined && { amount: validated.amount }),
        ...(validated.frequency && { frequency: validated.frequency }),
        ...(validated.endDate !== undefined && { end_date: validated.endDate }),
        ...(validated.isActive !== undefined && { is_active: validated.isActive }),
      })
      .eq("id", validated.recurringId)
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Gagal memperbarui jadwal" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/recurring");

    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Toggle active/pause status for recurring transaction
 */
export async function toggleRecurringAction(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("recurring_transactions")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/recurring");
  return { success: true };
}

/**
 * Delete a recurring schedule
 */
export async function deleteRecurringTransactionAction(id: string) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("recurring_transactions")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/recurring");
  return { success: true };
}
