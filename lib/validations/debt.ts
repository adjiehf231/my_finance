import { z } from "zod";

export const debtTypeEnum = z.enum(["debt_receivable", "loan_payable"]);
export const debtStatusEnum = z.enum(["active", "settled"]);

export const createDebtSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  name: z
    .string()
    .min(2, "Nama pihak/pinjaman minimal 2 karakter")
    .max(100, "Nama pihak maksimal 100 karakter"),
  type: debtTypeEnum,
  totalAmount: z.number().positive("Total nominal harus lebih dari 0"),
  interestRate: z.number().min(0).max(100).default(0),
  monthlyPayment: z.number().min(0).default(0),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  notes: z.string().max(255).optional().nullable(),
});

export const updateDebtSchema = z.object({
  debtId: z.string().uuid("Debt ID tidak valid"),
  name: z.string().min(2).max(100).optional(),
  totalAmount: z.number().positive("Total nominal harus lebih dari 0").optional(),
  interestRate: z.number().min(0).max(100).optional(),
  monthlyPayment: z.number().min(0).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  status: debtStatusEnum.optional(),
  notes: z.string().max(255).optional().nullable(),
});

export const recordDebtPaymentSchema = z.object({
  debtId: z.string().uuid("Debt ID tidak valid"),
  familyId: z.string().uuid("Family ID tidak valid"),
  walletId: z.string().uuid("Wallet ID tidak valid"),
  amount: z.number().positive("Nominal pembayaran cicilan harus lebih dari 0"),
  paymentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .default(() => new Date().toISOString().split("T")[0]),
  notes: z.string().max(255).optional().nullable(),
});

export type CreateDebtInput = z.infer<typeof createDebtSchema>;
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;
export type RecordDebtPaymentInput = z.infer<typeof recordDebtPaymentSchema>;
