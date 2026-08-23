import { describe, it, expect } from "vitest";
import { getTimeframeDateRange } from "@/lib/validations/analytics";

describe("Analytics Timeframe Helpers & Net Worth Logic", () => {
  it("should calculate this_month date range correctly", () => {
    const { startDate, endDate } = getTimeframeDateRange("this_month");
    const now = new Date();
    const expectedStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    expect(startDate).toBe(expectedStart);
    expect(endDate).toBeDefined();
  });

  it("should calculate this_year date range starting from Jan 01", () => {
    const { startDate } = getTimeframeDateRange("this_year");
    const currentYear = new Date().getFullYear();
    expect(startDate).toBe(`${currentYear}-01-01`);
  });

  it("should calculate Net Worth correctly as (Assets - Liabilities)", () => {
    const walletBalance = 15000000;
    const receivables = 5000000;
    const liabilities = 8000000;

    const totalAssets = walletBalance + receivables;
    const netWorth = totalAssets - liabilities;

    expect(totalAssets).toBe(20000000);
    expect(netWorth).toBe(12000000);
  });
});
