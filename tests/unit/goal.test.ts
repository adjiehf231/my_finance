import { describe, it, expect } from "vitest";
import { createGoalSchema, addGoalContributionSchema } from "@/lib/validations/goal";

describe("Financial Goals Validations", () => {
  const mockFamilyId = "11111111-1111-1111-1111-111111111111";
  const mockGoalId = "22222222-2222-2222-2222-222222222222";
  const mockWalletId = "33333333-3333-3333-3333-333333333333";

  it("should validate a valid financial goal input", () => {
    const valid = createGoalSchema.safeParse({
      familyId: mockFamilyId,
      name: "Dana Darurat 6 Bulan",
      targetAmount: 30000000,
      targetDate: "2026-12-31",
      priority: "high",
      color: "#10B981",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate a valid goal contribution input", () => {
    const valid = addGoalContributionSchema.safeParse({
      goalId: mockGoalId,
      familyId: mockFamilyId,
      walletId: mockWalletId,
      amount: 1500000,
      contributionDate: "2026-08-23",
      notes: "Setoran gaji Agustus",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject non-positive contribution amounts", () => {
    const invalid = addGoalContributionSchema.safeParse({
      goalId: mockGoalId,
      familyId: mockFamilyId,
      walletId: mockWalletId,
      amount: -100000,
    });
    expect(invalid.success).toBe(false);
  });
});
