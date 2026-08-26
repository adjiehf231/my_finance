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
