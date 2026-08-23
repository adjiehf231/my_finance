import { z } from "zod";

export const upsertBudgetSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  categoryId: z.string().uuid("Category ID tidak valid"),
  periodMonth: z
    .string()
    .regex(/^\d{4}-\d{2}-01$/, "Format periode bulan harus YYYY-MM-01"),
  amountLimit: z
    .number()
    .positive("Batas anggaran harus lebih dari 0"),
  notifyThreshold: z
    .number()
    .min(1)
    .max(100)
    .default(80),
});

export const deleteBudgetSchema = z.object({
  budgetId: z.string().uuid("Budget ID tidak valid"),
});

export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>;
export type DeleteBudgetInput = z.infer<typeof deleteBudgetSchema>;
