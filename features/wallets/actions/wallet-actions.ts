"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createWalletSchema,
  updateWalletSchema,
  type CreateWalletInput,
  type UpdateWalletInput,
} from "@/lib/validations/wallet";

export interface WalletItem {
  id: string;
  family_id: string;
  user_id: string | null;
  name: string;
  type: string;
  account_number?: string | null;
  initial_balance: number;
  current_balance: number;
  currency: string;
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get all active wallets for a family workspace and total balance sum
 */
export async function getWalletsAction(familyId: string) {
  const supabase = await createClient();

  const { data: wallets, error } = await (supabase as any)
    .from("wallets")
    .select("*")
    .eq("family_id", familyId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    return { success: false, error: error.message, data: [] as WalletItem[], totalBalance: 0 };
  }

  const items = (wallets || []) as WalletItem[];
  const totalBalance = items.reduce(
    (acc, w) => acc + Number(w.current_balance || 0),
    0
  );

  return {
    success: true,
    data: items,
    totalBalance,
  };
}

/**
 * Create a new wallet with initial balance
 */
export async function createWalletAction(input: CreateWalletInput) {
  try {
    const validated = createWalletSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    const { data: wallet, error } = await (supabase as any)
      .from("wallets")
      .insert({
        family_id: validated.familyId,
        user_id: user.id,
        name: validated.name,
        type: validated.type,
        account_number: validated.accountNumber || null,
        initial_balance: validated.initialBalance,
        current_balance: validated.initialBalance,
        currency: validated.currency,
        color: validated.color,
        icon: validated.icon,
        is_active: true,
      })
      .select()
      .single();

    if (error || !wallet) {
      return {
        success: false,
        error: `Gagal menambahkan dompet: ${error?.message || "Terjadi kesalahan"}`,
      };
    }

    // Log activity
    await (supabase as any).from("activity_logs").insert({
      family_id: validated.familyId,
      user_id: user.id,
      action: "create",
      entity: "wallet",
      entity_id: wallet.id,
      description: `Rekening "${wallet.name}" ditambahkan dengan saldo awal Rp ${validated.initialBalance.toLocaleString("id-ID")}.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/wallets");
    revalidatePath("/onboarding");

    return { success: true, data: wallet as WalletItem };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Update wallet details (name, type, account_number, color, icon)
 */
export async function updateWalletAction(input: UpdateWalletInput) {
  try {
    const validated = updateWalletSchema.parse(input);
    const supabase = await createClient();

    const { data: wallet, error } = await (supabase as any)
      .from("wallets")
      .update({
        ...(validated.name && { name: validated.name }),
        ...(validated.type && { type: validated.type }),
        ...(validated.accountNumber !== undefined && { account_number: validated.accountNumber }),
        ...(validated.color && { color: validated.color }),
        ...(validated.icon && { icon: validated.icon }),
      })
      .eq("id", validated.walletId)
      .select()
      .single();

    if (error || !wallet) {
      return { success: false, error: error?.message || "Gagal memperbarui dompet" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/wallets");

    return { success: true, data: wallet as WalletItem };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Auto-reconcile wallet balance by recalculating sum of all ledger mutations
 */
export async function reconcileWalletBalanceAction(walletId: string) {
  try {
    const supabase = await createClient();

    // 1. Fetch wallet info
    const { data: wallet, error: walletError } = await (supabase as any)
      .from("wallets")
      .select("id, name, initial_balance, current_balance, family_id")
      .eq("id", walletId)
      .single();

    if (walletError || !wallet) {
      return { success: false, error: "Dompet tidak ditemukan" };
    }

    // 2. Query transactions impacting this wallet
    const { data: transactions, error: txError } = await (supabase as any)
      .from("transactions")
      .select("id, type, amount, wallet_id, from_wallet_id, to_wallet_id, is_deleted")
      .eq("family_id", wallet.family_id)
      .eq("is_deleted", false)
      .or(`wallet_id.eq.${walletId},from_wallet_id.eq.${walletId},to_wallet_id.eq.${walletId}`);

    if (txError) {
      return { success: false, error: txError.message };
    }

    // 3. Compute accurate ledger balance
    let computedBalance = Number(wallet.initial_balance || 0);

    for (const tx of transactions || []) {
      const amt = Number(tx.amount || 0);
      if (tx.type === "income" && tx.wallet_id === walletId) {
        computedBalance += amt;
      } else if (tx.type === "expense" && tx.wallet_id === walletId) {
        computedBalance -= amt;
      } else if (tx.type === "transfer") {
        if (tx.to_wallet_id === walletId) {
          computedBalance += amt;
        }
        if (tx.from_wallet_id === walletId) {
          computedBalance -= amt;
        }
      }
    }

    const oldBalance = Number(wallet.current_balance || 0);
    const discrepancy = computedBalance - oldBalance;

    // 4. Update wallet balance to exact computed amount
    const { error: updateError } = await (supabase as any)
      .from("wallets")
      .update({ current_balance: computedBalance })
      .eq("id", walletId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/wallets");
    revalidatePath("/transactions");

    return {
      success: true,
      walletName: wallet.name,
      oldBalance,
      newBalance: computedBalance,
      discrepancy,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Terjadi kesalahan saat rekonsiliasi" };
  }
}

/**
 * Archive wallet (soft delete is_active = false)
 */
export async function archiveWalletAction(walletId: string) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("wallets")
    .update({ is_active: false })
    .eq("id", walletId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/wallets");

  return { success: true };
}
