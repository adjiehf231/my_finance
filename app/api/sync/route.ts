import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncBatchRequestSchema } from "@/lib/validations/sync";
import { syncUpAction, syncDownAction } from "@/features/sync/actions/sync-actions";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = syncBatchRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid sync request format", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { familyId, mutations, lastSyncTimestamp } = parsed.data;

    // Verify user membership in family
    const { data: member } = await (supabase as any)
      .from("family_members")
      .select("role")
      .eq("family_id", familyId)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!member) {
      return NextResponse.json(
        { error: "Forbidden: Not an active member of this family workspace" },
        { status: 403 }
      );
    }

    // Process sync up if client has queued mutations
    if (mutations.length > 0) {
      const upResult = await syncUpAction(familyId, mutations);
      return NextResponse.json(upResult);
    }

    // Otherwise, perform simple sync down
    const downResult = await syncDownAction(familyId, lastSyncTimestamp);
    return NextResponse.json({
      success: true,
      serverTimestamp: downResult.serverTimestamp,
      appliedCount: 0,
      rejectedCount: 0,
      changes: downResult.changes,
      conflicts: [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
