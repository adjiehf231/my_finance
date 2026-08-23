import { z } from "zod";

export const exportFormatEnum = z.enum(["csv", "json", "pdf"]);

export const exportRequestSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  format: exportFormatEnum.default("csv"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  walletId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});

export const pinLockSchema = z.object({
  pin: z.string().regex(/^\d{6}$/, "PIN harus tepat 6 digit angka"),
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;
export type PinLockInput = z.infer<typeof pinLockSchema>;
