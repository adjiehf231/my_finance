"use server";

import { createClient } from "@/lib/supabase/server";
import {
  type SyncBatchRequest,
  type SyncBatchResponse,
  type SyncMutation,
} from "@/lib/validations/sync";
import { resolveConflictLWW } from "@/lib/sync/conflict-resolver";

/**
 * Fetch all server-side changes modified since lastSyncTimestamp
 */
export async function syncDownAction(
  familyId: string,
  lastSyncTimestamp?: string | null
) {
  const supabase = await createClient();
  const filterTime = lastSyncTimestamp || "1970-01-01T00:00:00.000Z";

  const [
    walletsRes,
    txRes,
    categoriesRes,
    budgetsRes,
    goalsRes,
    debtsRes,
  ] = await Promise.all([
    (supabase as any)
      .from("wallets")
      .select("*")
      .eq("family_id", familyId)
      .gte("updated_at", filterTime),
    (supabase as any)
      .from("transactions")
      .select("*")
      .eq("family_id", familyId)
      .gte("updated_at", filterTime),
    (supabase as any)
      .from("categories")
      .select("*")
      .eq("family_id", familyId)
      .gte("updated_at", filterTime),
    (supabase as any)
      .from("budgets")
      .select("*")
      .eq("family_id", familyId)
      .gte("updated_at", filterTime),
    (supabase as any)
      .from("financial_goals")
      .select("*")
      .eq("family_id", familyId)
      .gte("updated_at", filterTime),
    (supabase as any)
      .from("debts")
      .select("*")
      .eq("family_id", familyId)
      .gte("updated_at", filterTime),
  ]);

  return {
    success: true,
    serverTimestamp: new Date().toISOString(),
    changes: {
      wallets: walletsRes.data || [],
      transactions: txRes.data || [],
      categories: categoriesRes.data || [],
      budgets: budgetsRes.data || [],
      goals: goalsRes.data || [],
      debts: debtsRes.data || [],
    },
  };
}

/**
 * Apply batch mutations from mobile client using Last-Write-Wins
 */
export async function syncUpAction(
  familyId: string,
  mutations: SyncMutation[]
): Promise<SyncBatchResponse> {
  const supabase = await createClient();
  let appliedCount = 0;
  let rejectedCount = 0;
  const conflicts: Array<{
    mutationId: string;
    entity: string;
    reason: string;
    resolution: "client_won" | "server_won";
  }> = [];

  for (const m of mutations) {
    const table = m.entity === "goals" ? "financial_goals" : m.entity;
    const recordId = m.data.id || m.id;

    // Fetch existing server record
    const { data: existing } = await (supabase as any)
      .from(table)
      .select("*")
      .eq("id", recordId)
      .maybeSingle();

    const resolution = resolveConflictLWW(m, existing);

    if (resolution.winner === "client") {
      if (m.operation === "INSERT") {
        const { error } = await (supabase as any)
          .from(table)
          .upsert({ ...m.data, family_id: familyId });
        if (!error) appliedCount++;
        else rejectedCount++;
      } else if (m.operation === "UPDATE") {
        const { error } = await (supabase as any)
          .from(table)
          .update(resolution.effectiveData)
          .eq("id", recordId);
        if (!error) appliedCount++;
        else rejectedCount++;
      } else if (m.operation === "DELETE") {
        const { error } = await (supabase as any)
          .from(table)
          .delete()
          .eq("id", recordId);
        if (!error) appliedCount++;
        else rejectedCount++;
      }
    } else {
      rejectedCount++;
      conflicts.push({
        mutationId: m.id,
        entity: m.entity,
        reason: resolution.reason,
        resolution: "server_won",
      });
    }
  }

  // Fetch updated changes to return to client
  const down = await syncDownAction(familyId);

  return {
    success: true,
    serverTimestamp: new Date().toISOString(),
    appliedCount,
    rejectedCount,
    changes: down.changes,
    conflicts,
  };
}
