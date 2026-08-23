import { describe, it, expect } from "vitest";
import {
  pushTokenSchema,
  sendPushNotificationSchema,
  notificationPreferencesSchema,
} from "@/lib/validations/notifications";

describe("Push Notification Engine & Validation Schemas", () => {
  it("should validate a valid push token registration payload", () => {
    const valid = pushTokenSchema.safeParse({
      familyId: "88888888-8888-8888-8888-888888888888",
      token: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
      platform: "android",
      deviceName: "Samsung Galaxy S24",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate an Expo push notification dispatch payload", () => {
    const valid = sendPushNotificationSchema.safeParse({
      to: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
      title: "Tagihan Jatuh Tempo",
      body: "Tagihan Internet WiFi jatuh tempo hari ini sebesar Rp 350.000",
      data: { recurringId: "rec-1" },
      sound: "default",
      priority: "high",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate notification preferences with defaults enabled", () => {
    const valid = notificationPreferencesSchema.safeParse({});
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.overbudgetAlerts).toBe(true);
      expect(valid.data.recurringReminders).toBe(true);
    }
  });
});
