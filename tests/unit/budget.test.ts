import { describe, it, expect } from "vitest";
import { upsertBudgetSchema } from "@/lib/validations/budget";

describe("Budget Validations & Thresholds", () => {
  const mockFamilyId = "11111111-1111-1111-1111-111111111111";
  const mockCategoryId = "22222222-2222-2222-2222-222222222222";

  it("should validate a valid monthly budget input", () => {
    const valid = upsertBudgetSchema.safeParse({
      familyId: mockFamilyId,
      categoryId: mockCategoryId,
      periodMonth: "2026-08-01",
      amountLimit: 2500000,
      notifyThreshold: 80,
    });
    expect(valid.success).toBe(true);
  });

  it("should reject invalid period month format", () => {
    const invalid = upsertBudgetSchema.safeParse({
      familyId: mockFamilyId,
      categoryId: mockCategoryId,
      periodMonth: "2026-08-15", // Not the 1st of month
      amountLimit: 2500000,
    });
    expect(invalid.success).toBe(false);
  });

  it("should reject non-positive amount limits", () => {
    const invalid = upsertBudgetSchema.safeParse({
      familyId: mockFamilyId,
      categoryId: mockCategoryId,
      periodMonth: "2026-08-01",
      amountLimit: 0,
    });
    expect(invalid.success).toBe(false);
  });
});
