import { describe, it, expect } from "vitest";
import { createDebtSchema, recordDebtPaymentSchema } from "@/lib/validations/debt";

describe("Debt & Loan Validations", () => {
  const mockFamilyId = "11111111-1111-1111-1111-111111111111";
  const mockDebtId = "22222222-2222-2222-2222-222222222222";
  const mockWalletId = "33333333-3333-3333-3333-333333333333";

  it("should validate a valid loan payable input", () => {
    const valid = createDebtSchema.safeParse({
      familyId: mockFamilyId,
      name: "Pinjaman KPR Mandiri",
      type: "loan_payable",
      totalAmount: 150000000,
      monthlyPayment: 2500000,
      startDate: "2026-08-01",
      dueDate: "2031-08-01",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate a valid debt receivable input", () => {
    const valid = createDebtSchema.safeParse({
      familyId: mockFamilyId,
      name: "Pinjaman Budi",
      type: "debt_receivable",
      totalAmount: 5000000,
      startDate: "2026-08-01",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate a valid installment payment", () => {
    const valid = recordDebtPaymentSchema.safeParse({
      debtId: mockDebtId,
      familyId: mockFamilyId,
      walletId: mockWalletId,
      amount: 2500000,
      paymentDate: "2026-08-23",
      notes: "Cicilan bulan Agustus",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject non-positive payment amounts", () => {
    const invalid = recordDebtPaymentSchema.safeParse({
      debtId: mockDebtId,
      familyId: mockFamilyId,
      walletId: mockWalletId,
      amount: 0,
    });
    expect(invalid.success).toBe(false);
  });
});
