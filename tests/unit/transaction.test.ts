import { describe, it, expect } from "vitest";
import { createTransactionSchema } from "@/lib/validations/transaction";

describe("Transaction Validations", () => {
  const mockFamilyId = "11111111-1111-1111-1111-111111111111";
  const mockWalletA = "22222222-2222-2222-2222-222222222222";
  const mockWalletB = "33333333-3333-3333-3333-333333333333";

  it("should validate a valid expense transaction", () => {
    const valid = createTransactionSchema.safeParse({
      familyId: mockFamilyId,
      type: "expense",
      amount: 45000,
      transactionDate: "2026-08-23",
      walletId: mockWalletA,
      description: "Grab Food",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate a valid income transaction", () => {
    const valid = createTransactionSchema.safeParse({
      familyId: mockFamilyId,
      type: "income",
      amount: 15000000,
      transactionDate: "2026-08-23",
      walletId: mockWalletA,
      description: "Gaji Bulanan",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate a valid transfer transaction between 2 different wallets", () => {
    const valid = createTransactionSchema.safeParse({
      familyId: mockFamilyId,
      type: "transfer",
      amount: 500000,
      transactionDate: "2026-08-23",
      fromWalletId: mockWalletA,
      toWalletId: mockWalletB,
      description: "Transfer dari BCA ke GoPay",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject transfer when source and destination wallets are identical", () => {
    const invalid = createTransactionSchema.safeParse({
      familyId: mockFamilyId,
      type: "transfer",
      amount: 500000,
      transactionDate: "2026-08-23",
      fromWalletId: mockWalletA,
      toWalletId: mockWalletA,
      description: "Transfer ke dompet sendiri yang sama",
    });
    expect(invalid.success).toBe(false);
  });

  it("should reject transaction with zero or negative amount", () => {
    const invalid = createTransactionSchema.safeParse({
      familyId: mockFamilyId,
      type: "expense",
      amount: 0,
      transactionDate: "2026-08-23",
      walletId: mockWalletA,
    });
    expect(invalid.success).toBe(false);
  });
});
