import { describe, it, expect } from "vitest";
import {
  createRecurringSchema,
  calculateNextExecutionDate,
} from "@/lib/validations/recurring";

describe("Recurring Transactions Validations & Helpers", () => {
  const mockFamilyId = "11111111-1111-1111-1111-111111111111";
  const mockWalletId = "22222222-2222-2222-2222-222222222222";

  it("should validate a valid recurring expense", () => {
    const valid = createRecurringSchema.safeParse({
      familyId: mockFamilyId,
      walletId: mockWalletId,
      name: "Wifi Indihome",
      type: "expense",
      amount: 350000,
      frequency: "monthly",
      startDate: "2026-09-01",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject non-positive amounts", () => {
    const invalid = createRecurringSchema.safeParse({
      familyId: mockFamilyId,
      walletId: mockWalletId,
      name: "Netflix",
      type: "expense",
      amount: 0,
      frequency: "monthly",
      startDate: "2026-09-01",
    });
    expect(invalid.success).toBe(false);
  });

  it("should calculate next execution date correctly for monthly frequency", () => {
    const nextDate = calculateNextExecutionDate("2026-08-15", "monthly");
    expect(nextDate).toBe("2026-09-15");
  });

  it("should calculate next execution date correctly for weekly frequency", () => {
    const nextDate = calculateNextExecutionDate("2026-08-01", "weekly");
    expect(nextDate).toBe("2026-08-08");
  });

  it("should calculate next execution date correctly for yearly frequency", () => {
    const nextDate = calculateNextExecutionDate("2026-08-01", "yearly");
    expect(nextDate).toBe("2027-08-01");
  });
});
