"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createDebtSchema,
  updateDebtSchema,
  recordDebtPaymentSchema,
  type CreateDebtInput,
  type UpdateDebtInput,
  type RecordDebtPaymentInput,
} from "@/lib/validations/debt";

export interface DebtWithProgress {
  id: string;
  family_id: string;
  user_id: string | null;
  name: string;
  type: "debt_receivable" | "loan_payable";
  total_amount: number;
  remaining_amount: number;
  paid_amount: number;
  percentage_paid: number;
  interest_rate: number;
  monthly_payment: number;
  start_date: string;
  due_date: string | null;
  status: "active" | "settled";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get all debts and loans for a family workspace
 */
export async function getDebtsAction(
  familyId: string,
  type?: "debt_receivable" | "loan_payable"
) {
  const supabase = await createClient();

  let query = (supabase as any)
    .from("debts")
    .select("*")
    .eq("family_id", familyId);

  if (type) {
    query = query.eq("type", type);
  }

  const { data: debts, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    return { success: false, error: error.message, data: [] as DebtWithProgress[] };
  }

  const result: DebtWithProgress[] = (debts || []).map((d: any) => {
    const total = Number(d.total_amount || 0);
    const remaining = Number(d.remaining_amount || 0);
    const paid = Math.max(0, total - remaining);
    const percentage = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

    return {
      ...d,
      total_amount: total,
      remaining_amount: remaining,
      paid_amount: paid,
      percentage_paid: percentage,
    };
  });

  return { success: true, data: result };
}

/**
 * Create a new debt or loan record
 */
export async function createDebtAction(input: CreateDebtInput) {
  try {
    const validated = createDebtSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: debt, error } = await (supabase as any)
      .from("debts")
      .insert({
        family_id: validated.familyId,
        user_id: user?.id || null,
        name: validated.name,
        type: validated.type,
        total_amount: validated.totalAmount,
        remaining_amount: validated.totalAmount,
        interest_rate: validated.interestRate,
        monthly_payment: validated.monthlyPayment,
        start_date: validated.startDate,
        due_date: validated.dueDate || null,
        status: "active",
        notes: validated.notes || null,
      })
      .select()
      .single();

    if (error || !debt) {
      return { success: false, error: error?.message || "Gagal mencatat hutang/piutang" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/debts");

    return { success: true, data: debt };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Record an installment payment for a debt or loan
 */
export async function recordDebtPaymentAction(input: RecordDebtPaymentInput) {
  try {
    const validated = recordDebtPaymentSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    // 1. Fetch current debt
    const { data: debt, error: fetchError } = await (supabase as any)
      .from("debts")
      .select("*")
      .eq("id", validated.debtId)
      .single();

    if (fetchError || !debt) {
      return { success: false, error: "Data hutang/piutang tidak ditemukan" };
    }

    const currentRemaining = Number(debt.remaining_amount || 0);
    const newRemaining = Math.max(0, currentRemaining - validated.amount);
    const isSettled = newRemaining === 0;

    // 2. Update debt remaining amount and status
    const { error: updateError } = await (supabase as any)
      .from("debts")
      .update({
        remaining_amount: newRemaining,
        status: isSettled ? "settled" : "active",
      })
      .eq("id", validated.debtId);

    if (updateError) {
      return { success: false, error: `Gagal memperbarui hutang: ${updateError.message}` };
    }

    // 3. Create wallet transaction
    // If loan_payable (we pay back our loan) => Expense
    // If debt_receivable (someone pays back their debt to us) => Income
    const txType = debt.type === "loan_payable" ? "expense" : "income";
    const txDesc =
      debt.type === "loan_payable"
        ? `Pembayaran Cicilan Hutang: ${debt.name}`
        : `Penerimaan Pelunasan Piutang: ${debt.name}`;

    await (supabase as any).from("transactions").insert({
      family_id: validated.familyId,
      user_id: user.id,
      wallet_id: validated.walletId,
      type: txType,
      amount: validated.amount,
      transaction_date: validated.paymentDate,
      description: validated.notes ? `${txDesc} (${validated.notes})` : txDesc,
      is_deleted: false,
    });

    revalidatePath("/dashboard");
    revalidatePath("/debts");
    revalidatePath("/wallets");
    revalidatePath("/transactions");

    return {
      success: true,
      data: { remaining_amount: newRemaining, status: isSettled ? "settled" : "active" },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Delete a debt or loan record
 */
export async function deleteDebtAction(debtId: string) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("debts")
    .delete()
    .eq("id", debtId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/debts");

  return { success: true };
}
