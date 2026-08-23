"use server";

import { createClient } from "@/lib/supabase/server";
import {
  pushTokenSchema,
  sendPushNotificationSchema,
  type PushTokenInput,
  type SendPushNotificationInput,
} from "@/lib/validations/notifications";
import { formatCurrency } from "@/lib/utils";

/**
 * Register mobile device push token
 */
export async function registerPushTokenAction(input: PushTokenInput) {
  const parsed = pushTokenSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Update user profile or push tokens log
  const { error } = await (supabase as any)
    .from("activity_logs")
    .insert({
      family_id: parsed.data.familyId,
      user_id: user.id,
      action: "register_push_token",
      entity: "device",
      description: `Mendaftarkan perangkat mobile (${parsed.data.platform}) untuk push notifikasi`,
      metadata: {
        token: parsed.data.token,
        platform: parsed.data.platform,
        deviceName: parsed.data.deviceName || "Mobile Device",
      },
    });

  return { success: !error };
}

/**
 * Send push notification via official Expo Push Notification Gateway
 */
export async function sendPushNotificationAction(input: SendPushNotificationInput) {
  const parsed = sendPushNotificationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send notification" };
  }
}

/**
 * Trigger an instant Overbudget Warning Push Notification
 */
export async function sendOverbudgetAlertAction(
  pushToken: string,
  categoryName: string,
  currentSpent: number,
  limitAmount: number
) {
  return await sendPushNotificationAction({
    to: pushToken,
    title: "⚠️ Peringatan Anggaran (Overbudget)!",
    body: `Pengeluaran kategori ${categoryName} (${formatCurrency(currentSpent)}) telah melampaui batas anggaran ${formatCurrency(limitAmount)}.`,
    data: {
      type: "overbudget_alert",
      categoryName,
      currentSpent,
      limitAmount,
    },
    sound: "default",
    priority: "high",
  });
}
