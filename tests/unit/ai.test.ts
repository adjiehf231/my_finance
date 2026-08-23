import { describe, it, expect } from "vitest";
import {
  receiptOcrResponseSchema,
  financialAdviceResponseSchema,
} from "@/lib/validations/ai";
import {
  calculateLocalFinancialHealth,
  extractJsonFromResponse,
} from "@/lib/ai/gemini-client";

describe("AI Engine Validations & Heuristic Analyzers", () => {
  it("should validate a structured OCR receipt response", () => {
    const valid = receiptOcrResponseSchema.safeParse({
      merchantName: "Indomaret Tebet",
      transactionDate: "2026-08-23",
      totalAmount: 78500,
      categorySuggestion: "Makanan & Minuman",
      items: [
        { name: "Susu UHT 1L", price: 22000, quantity: 2 },
        { name: "Roti Tawar", price: 16500, quantity: 1 },
      ],
    });
    expect(valid.success).toBe(true);
  });

  it("should extract clean JSON from markdown code fences", () => {
    const textWithFences = '```json\n{"merchantName": "Alfamart", "totalAmount": 50000}\n```';
    const extracted = extractJsonFromResponse(textWithFences);
    expect(extracted).toEqual({ merchantName: "Alfamart", totalAmount: 50000 });
  });

  it("should compute excellent health score for positive cashflow and low debt", () => {
    const health = calculateLocalFinancialHealth({
      monthlyIncome: 20000000,
      monthlyExpense: 10000000,
      totalDebt: 0,
      totalSavings: 70000000,
    });

    expect(health.healthScore).toBeGreaterThanOrEqual(85);
    expect(health.status).toBe("excellent");
    expect(health.recommendations.length).toBeGreaterThan(0);
  });

  it("should compute critical health score for deficit cashflow", () => {
    const health = calculateLocalFinancialHealth({
      monthlyIncome: 10000000,
      monthlyExpense: 15000000,
      totalDebt: 50000000,
      totalSavings: 1000000,
    });

    expect(health.healthScore).toBeLessThanOrEqual(50);
    expect(health.status).toBe("critical");
  });
});
