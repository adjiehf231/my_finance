"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateTransactionsCsv, type TransactionCsvRecord } from "@/lib/export/csv-generator";

/**
 * Export family transactions to CSV format (RFC 4180)
 */
export async function exportTransactionsCSVAction(familyId: string) {
  const supabase = await createClient();

  const { data: transactions, error } = await (supabase as any)
    .from("transactions")
    .select(`
      id,
      transaction_date,
      type,
      amount,
      description,
      categories:category_id (name),
      wallets:wallet_id (name)
    `)
    .eq("family_id", familyId)
    .eq("is_deleted", false)
    .order("transaction_date", { ascending: false });

  if (error) {
    return { success: false, error: error.message, csv: "" };
  }

  const records: TransactionCsvRecord[] = (transactions || []).map((t: any) => ({
    id: t.id,
    transaction_date: t.transaction_date,
    type: t.type,
    amount: Number(t.amount || 0),
    description: t.description || "",
    category_name: t.categories?.name || "Lainnya",
    wallet_name: t.wallets?.name || "-",
  }));

  const csv = generateTransactionsCsv(records);

  return {
    success: true,
    csv,
    fileName: `MyFinance_Transactions_${new Date().toISOString().split("T")[0]}.csv`,
  };
}

/**
 * Export full family data takeout in JSON format (GDPR & UU PDP Data Portability)
 */
export async function exportFamilyDataTakeoutAction(familyId: string) {
  const supabase = await createClient();

  const [
    familyRes,
    membersRes,
    walletsRes,
    txRes,
    categoriesRes,
    budgetsRes,
    goalsRes,
    debtsRes,
  ] = await Promise.all([
    (supabase as any).from("families").select("*").eq("id", familyId).single(),
    (supabase as any).from("family_members").select("*").eq("family_id", familyId),
    (supabase as any).from("wallets").select("*").eq("family_id", familyId),
    (supabase as any).from("transactions").select("*").eq("family_id", familyId),
    (supabase as any).from("categories").select("*").eq("family_id", familyId),
    (supabase as any).from("budgets").select("*").eq("family_id", familyId),
    (supabase as any).from("financial_goals").select("*").eq("family_id", familyId),
    (supabase as any).from("debts").select("*").eq("family_id", familyId),
  ]);

  const takeout = {
    exportDate: new Date().toISOString(),
    legalNotice: "Ekspor portabilitas data pribadi sesuai UU No. 27 Tahun 2022 (UU PDP).",
    family: familyRes.data,
    members: membersRes.data || [],
    wallets: walletsRes.data || [],
    transactions: txRes.data || [],
    categories: categoriesRes.data || [],
    budgets: budgetsRes.data || [],
    goals: goalsRes.data || [],
    debts: debtsRes.data || [],
  };

  return {
    success: true,
    jsonString: JSON.stringify(takeout, null, 2),
    fileName: `MyFinance_DataTakeout_${new Date().toISOString().split("T")[0]}.json`,
  };
}

/**
 * Restore family data from JSON backup takeout file
 */
export async function importFamilyDataRestoreAction(familyId: string, jsonString: string) {
  try {
    const backup = JSON.parse(jsonString);
    if (!backup || typeof backup !== "object") {
      return { success: false, error: "Format file backup tidak valid (Bukan JSON yang benar)." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Sesi login tidak valid." };
    }

    let restoredWallets = 0;
    let restoredCategories = 0;
    let restoredTransactions = 0;
    let restoredBudgets = 0;
    let restoredGoals = 0;
    let restoredDebts = 0;

    // 1. Restore Custom Categories
    if (Array.isArray(backup.categories) && backup.categories.length > 0) {
      for (const cat of backup.categories) {
        if (!cat.name) continue;
        const { error } = await (supabase as any).from("categories").insert({
          family_id: familyId,
          name: cat.name,
          type: cat.type || "expense",
          icon: cat.icon || "tag",
          color: cat.color || "#EF4444",
          is_default: false,
          is_active: true,
        });
        if (!error) restoredCategories++;
      }
    }

    // 2. Restore Wallets
    if (Array.isArray(backup.wallets) && backup.wallets.length > 0) {
      for (const w of backup.wallets) {
        if (!w.name) continue;
        const { error } = await (supabase as any).from("wallets").insert({
          family_id: familyId,
          user_id: user.id,
          name: w.name,
          type: w.type || "bank",
          account_number: w.account_number || null,
          initial_balance: Number(w.initial_balance || 0),
          current_balance: Number(w.current_balance || w.initial_balance || 0),
          currency: w.currency || "IDR",
          color: w.color || "#10B981",
          icon: w.icon || "wallet",
          is_archived: false,
        });
        if (!error) restoredWallets++;
      }
    }

    // 3. Restore Transactions (Fetch current wallets to associate)
    const { data: currentWallets } = await (supabase as any)
      .from("wallets")
      .select("id, name")
      .eq("family_id", familyId);

    const fallbackWalletId = currentWallets?.[0]?.id;

    if (fallbackWalletId && Array.isArray(backup.transactions) && backup.transactions.length > 0) {
      for (const t of backup.transactions) {
        if (!t.amount) continue;
        const { error } = await (supabase as any).from("transactions").insert({
          family_id: familyId,
          user_id: user.id,
          wallet_id: fallbackWalletId,
          type: t.type || "expense",
          amount: Number(t.amount || 0),
          transaction_date: t.transaction_date ? t.transaction_date.split("T")[0] : new Date().toISOString().split("T")[0],
          description: t.description || "Transaksi Dipulihkan",
          attachment_url: t.attachment_url || null,
          is_deleted: false,
        });
        if (!error) restoredTransactions++;
      }
    }

    // 4. Restore Financial Goals
    if (Array.isArray(backup.goals) && backup.goals.length > 0) {
      for (const g of backup.goals) {
        if (!g.name || !g.target_amount) continue;
        const { error } = await (supabase as any).from("financial_goals").insert({
          family_id: familyId,
          user_id: user.id,
          name: g.name,
          target_amount: Number(g.target_amount || 0),
          current_amount: Number(g.current_amount || 0),
          target_date: g.target_date || null,
          priority: g.priority || "medium",
          status: g.status || "in_progress",
          color: g.color || "#3B82F6",
          description: g.description || null,
        });
        if (!error) restoredGoals++;
      }
    }

    // 5. Restore Debts / Receivables
    if (Array.isArray(backup.debts) && backup.debts.length > 0) {
      for (const d of backup.debts) {
        if (!d.name || !d.total_amount) continue;
        const { error } = await (supabase as any).from("debts").insert({
          family_id: familyId,
          user_id: user.id,
          name: d.name,
          type: d.type || "loan_payable",
          total_amount: Number(d.total_amount || 0),
          remaining_amount: Number(d.remaining_amount || d.total_amount || 0),
          interest_rate: Number(d.interest_rate || 0),
          monthly_payment: Number(d.monthly_payment || 0),
          start_date: d.start_date || new Date().toISOString().split("T")[0],
          due_date: d.due_date || null,
          status: d.status || "active",
          notes: d.notes || null,
        });
        if (!error) restoredDebts++;
      }
    }

    // 6. Restore Budgets
    if (Array.isArray(backup.budgets) && backup.budgets.length > 0) {
      for (const b of backup.budgets) {
        if (!b.amount_limit || !b.category_id) continue;
        const { error } = await (supabase as any).from("budgets").insert({
          family_id: familyId,
          category_id: b.category_id,
          period_month: b.period_month || new Date().toISOString().slice(0, 7) + "-01",
          amount_limit: Number(b.amount_limit || 0),
          notify_threshold: Number(b.notify_threshold || 80),
        });
        if (!error) restoredBudgets++;
      }
    }

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/wallets");
    revalidatePath("/budgeting");
    revalidatePath("/goals");
    revalidatePath("/debts");
    revalidatePath("/categories");
    revalidatePath("/analytics");
    revalidatePath("/settings");

    return {
      success: true,
      data: {
        restoredWallets,
        restoredCategories,
        restoredTransactions,
        restoredBudgets,
        restoredGoals,
        restoredDebts,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memulihkan file backup." };
  }
}

/**
 * Revalidate all paths and refresh cached data
 */
export async function refreshFamilyDataAction() {
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/wallets");
  revalidatePath("/budgeting");
  revalidatePath("/goals");
  revalidatePath("/debts");
  revalidatePath("/categories");
  revalidatePath("/analytics");
  revalidatePath("/recurring");
  revalidatePath("/advisor");
  revalidatePath("/gamification");
  revalidatePath("/settings");

  return { success: true, timestamp: new Date().toLocaleTimeString("id-ID") };
}

/**
 * Request permanent account and family data erasure (UU PDP / GDPR Right to be Forgotten)
 */
export async function requestAccountErasureAction(familyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Soft-delete or log erasure request
  const { error } = await (supabase as any).from("activity_logs").insert({
    family_id: familyId,
    user_id: user.id,
    action: "request_account_erasure",
    entity: "user",
    description: "Pengguna mengajukan permohonan penghapusan data permanen sesuai UU PDP",
    metadata: { requestedAt: new Date().toISOString(), userId: user.id },
  });

  return {
    success: !error,
    message: "Permohonan penghapusan data Anda telah dicatat dan akan diproses dalam waktu 3x24 jam sesuai ketentuan UU PDP.",
  };
}
