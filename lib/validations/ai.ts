import { z } from "zod";

export const receiptItemSchema = z.object({
  name: z.string(),
  price: z.number().default(0),
  quantity: z.number().default(1),
});

export const receiptOcrResponseSchema = z.object({
  merchantName: z.string().default("Toko / Merchant"),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .default(() => new Date().toISOString().split("T")[0]),
  totalAmount: z.number().nonnegative().default(0),
  categorySuggestion: z.string().default("Makanan & Minuman"),
  items: z.array(receiptItemSchema).default([]),
});

export const categoryPredictionSchema = z.object({
  categoryId: z.string().nullable().optional(),
  categoryName: z.string(),
  confidence: z.number().min(0).max(1),
  reason: z.string(),
});

export const financialAdviceResponseSchema = z.object({
  healthScore: z.number().min(0).max(100),
  status: z.enum(["excellent", "good", "fair", "critical"]),
  summary: z.string(),
  recommendations: z.array(z.string()),
  savingsTip: z.string(),
});

export type ReceiptOcrResponse = z.infer<typeof receiptOcrResponseSchema>;
export type CategoryPredictionResponse = z.infer<typeof categoryPredictionSchema>;
export type FinancialAdviceResponse = z.infer<typeof financialAdviceResponseSchema>;
