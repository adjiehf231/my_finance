import { z } from "zod";

export const walletTypeEnum = z.enum([
  "cash",
  "bank",
  "ewallet",
  "credit_card",
  "investment",
  "other",
]);

export const createWalletSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  name: z
    .string()
    .min(2, "Nama dompet minimal 2 karakter")
    .max(50, "Nama dompet maksimal 50 karakter"),
  type: walletTypeEnum,
  initialBalance: z
    .number()
    .min(0, "Saldo awal tidak boleh bernilai negatif")
    .default(0),
  currency: z.string().default("IDR"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Warna hex tidak valid")
    .default("#10B981"),
  icon: z.string().default("wallet"),
});

export const updateWalletSchema = z.object({
  walletId: z.string().uuid("Wallet ID tidak valid"),
  name: z
    .string()
    .min(2, "Nama dompet minimal 2 karakter")
    .max(50, "Nama dompet maksimal 50 karakter")
    .optional(),
  type: walletTypeEnum.optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Warna hex tidak valid")
    .optional(),
  icon: z.string().optional(),
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;
