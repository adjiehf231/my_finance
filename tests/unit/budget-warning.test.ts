import { describe, it, expect } from "vitest";

interface BudgetAlertCheck {
  id: string;
  categoryName: string;
  amount_limit: number;
  spent_amount: number;
  notify_threshold: number;
}

function evaluateBudgetStatus(budget: BudgetAlertCheck): {
  percentage: number;
  isAlert: boolean;
  status: "safe" | "warning" | "overbudget";
} {
  const percentage =
    budget.amount_limit > 0
      ? Math.round((budget.spent_amount / budget.amount_limit) * 100)
      : 0;

  if (percentage >= 100) {
    return { percentage, isAlert: true, status: "overbudget" };
  } else if (percentage >= (budget.notify_threshold || 80)) {
    return { percentage, isAlert: true, status: "warning" };
  }
  return { percentage, isAlert: false, status: "safe" };
}

describe("Smart Budget Warning Alert Evaluator", () => {
  it("flags overbudget when spent exceeds limit (>= 100%)", () => {
    const budget: BudgetAlertCheck = {
      id: "b-1",
      categoryName: "Makanan",
      amount_limit: 2000000,
      spent_amount: 2500000,
      notify_threshold: 80,
    };
    const result = evaluateBudgetStatus(budget);
    expect(result.percentage).toBe(125);
    expect(result.isAlert).toBe(true);
    expect(result.status).toBe("overbudget");
  });

  it("flags warning when spent reaches notify threshold (>= 80% and < 100%)", () => {
    const budget: BudgetAlertCheck = {
      id: "b-2",
      categoryName: "Transportasi",
      amount_limit: 1000000,
      spent_amount: 850000,
      notify_threshold: 80,
    };
    const result = evaluateBudgetStatus(budget);
    expect(result.percentage).toBe(85);
    expect(result.isAlert).toBe(true);
    expect(result.status).toBe("warning");
  });

  it("considers safe when spent is comfortably below threshold (< 80%)", () => {
    const budget: BudgetAlertCheck = {
      id: "b-3",
      categoryName: "Hiburan",
      amount_limit: 1500000,
      spent_amount: 600000,
      notify_threshold: 80,
    };
    const result = evaluateBudgetStatus(budget);
    expect(result.percentage).toBe(40);
    expect(result.isAlert).toBe(false);
    expect(result.status).toBe("safe");
  });
});
