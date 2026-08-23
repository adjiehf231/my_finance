import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateNextExecutionDate } from "@/lib/validations/recurring";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional security gate if CRON_SECRET is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Fetch active recurring transactions that are due
    const { data: dueSchedules, error } = await (supabase as any)
      .from("recurring_transactions")
      .select("*")
      .eq("is_active", true)
      .lte("next_execution_date", todayStr);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const executed: string[] = [];

    for (const schedule of dueSchedules || []) {
      // 2. Insert transaction
      await (supabase as any).from("transactions").insert({
        family_id: schedule.family_id,
        user_id: schedule.user_id,
        wallet_id: schedule.wallet_id,
        category_id: schedule.category_id,
        type: schedule.type,
        amount: schedule.amount,
        transaction_date: schedule.next_execution_date,
        description: `Otomatis: ${schedule.name}`,
        is_recurring: true,
        recurring_id: schedule.id,
        is_deleted: false,
      });

      // 3. Compute next execution date
      const nextDate = calculateNextExecutionDate(
        schedule.next_execution_date,
        schedule.frequency
      );

      // Check if past end_date
      let isActive = true;
      if (schedule.end_date && nextDate > schedule.end_date) {
        isActive = false;
      }

      // 4. Update schedule
      await (supabase as any)
        .from("recurring_transactions")
        .update({
          next_execution_date: nextDate,
          is_active: isActive,
        })
        .eq("id", schedule.id);

      executed.push(schedule.id);
    }

    return NextResponse.json({
      success: true,
      processedCount: executed.length,
      executedIds: executed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
