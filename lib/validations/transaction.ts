import { z } from "zod";

export const transactionTypeEnum = z.enum(["income", "expense", "transfer"]);

export const createTransactionSchema = z
  .object({
    familyId: z.string().uuid("Family ID tidak valid"),
    type: transactionTypeEnum,
    amount: z.number().positive("Nominal transaksi harus lebih dari 0"),
    transactionDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
    walletId: z.string().uuid("Wallet ID tidak valid").optional().nullable(),
    fromWalletId: z.string().uuid("Rekening sumber tidak valid").optional().nullable(),
    toWalletId: z.string().uuid("Rekening tujuan tidak valid").optional().nullable(),
    categoryId: z.string().uuid("Kategori tidak valid").optional().nullable(),
    description: z.string().max(255, "Deskripsi maksimal 255 karakter").optional().nullable(),
    attachmentUrl: z.string().url("URL lampiran tidak valid").optional().nullable().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.type === "income" || data.type === "expense") {
        return !!data.walletId;
      }
      return true;
    },
    {
      message: "Rekening/dompet harus dipilih untuk pemasukan atau pengeluaran",
      path: ["walletId"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "transfer") {
        return !!data.fromWalletId && !!data.toWalletId;
      }
      return true;
    },
    {
      message: "Rekening sumber dan rekening tujuan harus dipilih untuk transfer",
      path: ["fromWalletId"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "transfer") {
        return data.fromWalletId !== data.toWalletId;
      }
      return true;
    },
    {
      message: "Rekening sumber dan rekening tujuan tidak boleh sama",
      path: ["toWalletId"],
    }
  );

export const updateTransactionSchema = z.object({
  transactionId: z.string().uuid("Transaction ID tidak valid"),
  amount: z.number().positive("Nominal harus lebih dari 0").optional(),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  categoryId: z.string().uuid().optional().nullable(),
  description: z.string().max(255).optional().nullable(),
  attachmentUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export const transactionFilterSchema = z.object({
  familyId: z.string().uuid(),
  type: transactionTypeEnum.optional(),
  walletId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
