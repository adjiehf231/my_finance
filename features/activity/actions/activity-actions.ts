"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActivityLogItem {
  id: string;
  family_id: string;
  user_id: string | null;
  action: string; // create, update, delete, reconcile, join
  entity: string; // transaction, wallet, budget, debt, goal, family
  entity_id: string | null;
  description: string;
  metadata: any;
  created_at: string;
  users?: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

export interface GetActivityLogsFilters {
  familyId: string;
  limit?: number;
  offset?: number;
  action?: string;
  entity?: string;
  search?: string;
}

/**
 * Fetch paginated audit activity logs for a family workspace
 */
export async function getActivityLogsAction({
  familyId,
  limit = 20,
  offset = 0,
  action,
  entity,
  search,
}: GetActivityLogsFilters) {
  const supabase = await createClient();

  let query = (supabase as any)
    .from("activity_logs")
    .select(`
      *,
      users:user_id (id, full_name, email, avatar_url)
    `, { count: "exact" })
    .eq("family_id", familyId);

  if (action && action !== "all") {
    query = query.eq("action", action);
  }

  if (entity && entity !== "all") {
    query = query.eq("entity", entity);
  }

  if (search && search.trim()) {
    query = query.ilike("description", `%${search.trim()}%`);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { success: false, error: error.message, data: [] as ActivityLogItem[], totalCount: 0 };
  }

  return {
    success: true,
    data: (data || []) as ActivityLogItem[],
    totalCount: count || 0,
  };
}
