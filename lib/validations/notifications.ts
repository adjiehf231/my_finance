import { z } from "zod";

export const pushTokenSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  token: z.string().min(10, "Push token tidak valid"),
  platform: z.enum(["ios", "android", "web"]).default("android"),
  deviceName: z.string().optional(),
});

export const sendPushNotificationSchema = z.object({
  to: z.string().min(1, "Recipient token is required"),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body message is required"),
  data: z.record(z.any()).optional(),
  sound: z.string().default("default"),
  priority: z.enum(["default", "normal", "high"]).default("high"),
});

export const notificationPreferencesSchema = z.object({
  overbudgetAlerts: z.boolean().default(true),
  recurringReminders: z.boolean().default(true),
  familyActivityAlerts: z.boolean().default(true),
  weeklySummaryReports: z.boolean().default(true),
});

export type PushTokenInput = z.infer<typeof pushTokenSchema>;
export type SendPushNotificationInput = z.infer<typeof sendPushNotificationSchema>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
