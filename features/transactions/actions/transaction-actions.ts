"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionFilterSchema,
  type CreateTransactionInput,
  type UpdateTransactionInput,
  type TransactionFilterInput,
} from "@/lib/validations/transaction";

export interface TransactionWithDetails {
  id: string;
  family_id: string;
  user_id: string;
  wallet_id: string | null;
  type: "income" | "expense" | "transfer";
  category_id: string | null;
  amount: number;
  transaction_date: string;
  description: string | null;
  attachment_url: string | null;
  from_wallet_id: string | null;
  to_wallet_id: string | null;
  is_recurring: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
  wallets?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
  from_wallet?: {
    id: string;
    name: string;
    color: string;
  } | null;
  to_wallet?: {
    id: string;
    name: string;
    color: string;
  } | null;
  users?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

/**
 * Get filtered transactions list for a family workspace with deep multi-criteria filtering
 */
export async function getTransactionsAction(input: TransactionFilterInput) {
  const validated = transactionFilterSchema.parse(input);
  const supabase = await createClient();

  let query = (supabase as any)
    .from("transactions")
    .select(`
      *,
      categories:category_id (id, name, icon, color),
      wallets:wallet_id (id, name, color, icon),
      from_wallet:from_wallet_id (id, name, color),
      to_wallet:to_wallet_id (id, name, color),
      users:user_id (id, full_name, avatar_url)
    `)
    .eq("family_id", validated.familyId)
    .eq("is_deleted", false);

  if (validated.type) {
    query = query.eq("type", validated.type);
  }

  if (validated.walletId) {
    query = query.or(
      `wallet_id.eq.${validated.walletId},from_wallet_id.eq.${validated.walletId},to_wallet_id.eq.${validated.walletId}`
    );
  }

  if (validated.categoryId) {
    query = query.eq("category_id", validated.categoryId);
  }

  if (validated.startDate) {
    query = query.gte("transaction_date", validated.startDate);
  }

  if (validated.endDate) {
    query = query.lte("transaction_date", validated.endDate);
  }

  if (validated.minAmount !== undefined && validated.minAmount > 0) {
    query = query.gte("amount", validated.minAmount);
  }

  if (validated.maxAmount !== undefined && validated.maxAmount > 0) {
    query = query.lte("amount", validated.maxAmount);
  }

  if (validated.search && validated.search.trim()) {
    query = query.ilike("description", `%${validated.search.trim()}%`);
  }

  const { data, error } = await query
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(validated.offset, validated.offset + validated.limit - 1);

  if (error) {
    return {
      success: false,
      error: error.message,
      data: [] as TransactionWithDetails[],
    };
  }

  return {
    success: true,
    data: (data || []) as TransactionWithDetails[],
  };
}

/**
 * Create a new financial transaction (Income, Expense, or Transfer)
 */
export async function createTransactionAction(input: CreateTransactionInput) {
  try {
    const validated = createTransactionSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    const { data: transaction, error } = await (supabase as any)
      .from("transactions")
      .insert({
        family_id: validated.familyId,
        user_id: user.id,
        type: validated.type,
        amount: validated.amount,
        transaction_date: validated.transactionDate,
        wallet_id: validated.type !== "transfer" ? validated.walletId : null,
        from_wallet_id: validated.type === "transfer" ? validated.fromWalletId : null,
        to_wallet_id: validated.type === "transfer" ? validated.toWalletId : null,
        category_id: validated.type !== "transfer" ? validated.categoryId : null,
        description: validated.description || null,
        attachment_url: validated.attachmentUrl || null,
        is_deleted: false,
      })
      .select()
      .single();

    if (error || !transaction) {
      return {
        success: false,
        error: `Gagal mencatat transaksi: ${error?.message || "Terjadi kesalahan"}`,
      };
    }

    // Log activity
    await (supabase as any).from("activity_logs").insert({
      family_id: validated.familyId,
      user_id: user.id,
      action: "create",
      entity: "transaction",
      entity_id: transaction.id,
      description: `Transaksi ${validated.type.toUpperCase()} sebesar Rp ${validated.amount.toLocaleString("id-ID")} dicatat.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/wallets");

    return { success: true, data: transaction };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Update transaction details
 */
export async function updateTransactionAction(input: UpdateTransactionInput) {
  try {
    const validated = updateTransactionSchema.parse(input);
    const supabase = await createClient();

    const { data: transaction, error } = await (supabase as any)
      .from("transactions")
      .update({
        ...(validated.amount !== undefined && { amount: validated.amount }),
        ...(validated.transactionDate && { transaction_date: validated.transactionDate }),
        ...(validated.categoryId !== undefined && { category_id: validated.categoryId }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.attachmentUrl !== undefined && { attachment_url: validated.attachmentUrl }),
      })
      .eq("id", validated.transactionId)
      .select()
      .single();

    if (error || !transaction) {
      return {
        success: false,
        error: error?.message || "Gagal memperbarui transaksi",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/wallets");

    return { success: true, data: transaction };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Delete a transaction (Soft delete is_deleted = true, automatically reverts balance in trigger)
 */
export async function deleteTransactionAction(transactionId: string) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("transactions")
    .update({ is_deleted: true })
    .eq("id", transactionId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/wallets");

  return { success: true };
}
