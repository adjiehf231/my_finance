import { z } from "zod";

export const priorityEnum = z.enum(["low", "medium", "high"]);
export const goalStatusEnum = z.enum(["in_progress", "completed", "cancelled"]);

export const createGoalSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  name: z
    .string()
    .min(2, "Nama target minimal 2 karakter")
    .max(100, "Nama target maksimal 100 karakter"),
  targetAmount: z
    .number()
    .positive("Nominal target tabungan harus lebih dari 0"),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .optional()
    .nullable(),
  priority: priorityEnum.default("medium"),
  icon: z.string().default("target"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Warna hex tidak valid")
    .default("#3B82F6"),
  description: z.string().max(255).optional().nullable(),
});

export const updateGoalSchema = z.object({
  goalId: z.string().uuid("Goal ID tidak valid"),
  name: z.string().min(2).max(100).optional(),
  targetAmount: z.number().positive().optional(),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  priority: priorityEnum.optional(),
  status: goalStatusEnum.optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  description: z.string().max(255).optional().nullable(),
});

export const addGoalContributionSchema = z.object({
  goalId: z.string().uuid("Goal ID tidak valid"),
  familyId: z.string().uuid("Family ID tidak valid"),
  walletId: z.string().uuid("Rekening sumber tidak valid"),
  amount: z
    .number()
    .positive("Nominal setoran tabungan harus lebih dari 0"),
  contributionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .default(() => new Date().toISOString().split("T")[0]),
  notes: z.string().max(255).optional().nullable(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type AddGoalContributionInput = z.infer<typeof addGoalContributionSchema>;
