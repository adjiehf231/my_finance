import { describe, it, expect } from "vitest";
import { createWalletSchema } from "@/lib/validations/wallet";

describe("Wallet Validations", () => {
  it("should validate a valid wallet input", () => {
    const valid = createWalletSchema.safeParse({
      familyId: "11111111-1111-1111-1111-111111111111",
      name: "BCA Tabungan",
      type: "bank",
      initialBalance: 5000000,
      currency: "IDR",
      color: "#10B981",
      icon: "building-2",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject negative initial balances", () => {
    const invalid = createWalletSchema.safeParse({
      familyId: "11111111-1111-1111-1111-111111111111",
      name: "Kas",
      type: "cash",
      initialBalance: -500,
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate wallet with account number", () => {
    const valid = createWalletSchema.safeParse({
      familyId: "11111111-1111-1111-1111-111111111111",
      name: "Mandiri Prioritas",
      type: "bank",
      accountNumber: "1400012345678",
      initialBalance: 10000000,
    });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.accountNumber).toBe("1400012345678");
    }
  });
});
