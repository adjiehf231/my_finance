"use server";

import { createClient } from "@/lib/supabase/server";
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
