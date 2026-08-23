"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActivityLogItem {
  id: string;
  family_id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  description: string;
  metadata: any;
  created_at: string;
  users?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

/**
 * Get all activity audit logs for a family workspace
 */
export async function getActivityLogsAction(
  familyId: string,
  limit: number = 50,
  offset: number = 0
) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("activity_logs")
    .select(`
      *,
      users:user_id (id, full_name, avatar_url)
    `)
    .eq("family_id", familyId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return { success: false, error: error.message, data: [] as ActivityLogItem[] };
  }

  return { success: true, data: (data || []) as ActivityLogItem[] };
}

/**
 * Helper to record activity log
 */
export async function logFamilyActivityAction(input: {
  familyId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  description: string;
  metadata?: any;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await (supabase as any).from("activity_logs").insert({
    family_id: input.familyId,
    user_id: user?.id || null,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId || null,
    description: input.description,
    metadata: input.metadata || {},
  });

  return { success: !error };
}
