import { z } from "zod";

export const recurringFrequencyEnum = z.enum(["daily", "weekly", "monthly", "yearly"]);
export const recurringTypeEnum = z.enum(["income", "expense"]);

export const createRecurringSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  walletId: z.string().uuid("Wallet ID tidak valid"),
  categoryId: z.string().uuid("Category ID tidak valid").optional().nullable(),
  name: z
    .string()
    .min(2, "Nama tagihan/transaksi minimal 2 karakter")
    .max(100, "Nama tagihan maksimal 100 karakter"),
  type: recurringTypeEnum,
  amount: z.number().positive("Nominal harus lebih dari 0"),
  frequency: recurringFrequencyEnum,
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
});

export const updateRecurringSchema = z.object({
  recurringId: z.string().uuid("Recurring ID tidak valid"),
  name: z.string().min(2).max(100).optional(),
  amount: z.number().positive().optional(),
  frequency: recurringFrequencyEnum.optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateRecurringInput = z.infer<typeof createRecurringSchema>;
export type UpdateRecurringInput = z.infer<typeof updateRecurringSchema>;

/**
 * Helper to compute the next execution date based on frequency and base date
 */
export function calculateNextExecutionDate(
  currentDateStr: string,
  frequency: "daily" | "weekly" | "monthly" | "yearly"
): string {
  const date = new Date(currentDateStr);

  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}
