import { describe, it, expect } from "vitest";

interface TransactionEntry {
  amount: number;
  type: "income" | "expense";
  transaction_date: string;
  category_name: string;
}

function calculateWeeklyDigestMetrics(
  transactions: TransactionEntry[],
  dateToday: string,
  date7DaysAgo: string,
  date14DaysAgo: string
) {
  let expenseThisWeek = 0;
  let expenseLastWeek = 0;
  const categoryTotals: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type !== "expense") return;

    if (t.transaction_date >= date7DaysAgo && t.transaction_date <= dateToday) {
      expenseThisWeek += t.amount;
      categoryTotals[t.category_name] = (categoryTotals[t.category_name] || 0) + t.amount;
    } else if (
      t.transaction_date >= date14DaysAgo &&
      t.transaction_date < date7DaysAgo
    ) {
      expenseLastWeek += t.amount;
    }
  });

  let topCategoryName = "";
  let topCategoryAmount = 0;
  Object.entries(categoryTotals).forEach(([name, amt]) => {
    if (amt > topCategoryAmount) {
      topCategoryAmount = amt;
      topCategoryName = name;
    }
  });

  let velocityPercentage = 0;
  if (expenseLastWeek > 0) {
    velocityPercentage = Math.round(
      ((expenseThisWeek - expenseLastWeek) / expenseLastWeek) * 100
    );
  }

  return {
    expenseThisWeek,
    expenseLastWeek,
    velocityPercentage,
    topCategory: topCategoryName ? { name: topCategoryName, amount: topCategoryAmount } : null,
  };
}

describe("Weekly AI Financial Digest Engine", () => {
  const transactions: TransactionEntry[] = [
    {
      amount: 150000,
      type: "expense",
      transaction_date: "2026-08-25", // This week
      category_name: "Makanan & Minuman",
    },
    {
      amount: 250000,
      type: "expense",
      transaction_date: "2026-08-24", // This week
      category_name: "Makanan & Minuman",
    },
    {
      amount: 100000,
      type: "expense",
      transaction_date: "2026-08-22", // This week
      category_name: "Transportasi",
    },
    {
      amount: 300000,
      type: "expense",
      transaction_date: "2026-08-16", // Last week
      category_name: "Makanan & Minuman",
    },
  ];

  it("calculates weekly spending and week-over-week velocity accurately", () => {
    const result = calculateWeeklyDigestMetrics(
      transactions,
      "2026-08-26",
      "2026-08-19",
      "2026-08-12"
    );

    expect(result.expenseThisWeek).toBe(500000); // 150k + 250k + 100k
    expect(result.expenseLastWeek).toBe(300000); // 300k
    expect(result.velocityPercentage).toBe(67); // ((500k - 300k) / 300k) * 100 = +67%
  });

  it("identifies the top category expense spike for the week", () => {
    const result = calculateWeeklyDigestMetrics(
      transactions,
      "2026-08-26",
      "2026-08-19",
      "2026-08-12"
    );

    expect(result.topCategory).not.toBeNull();
    expect(result.topCategory?.name).toBe("Makanan & Minuman");
    expect(result.topCategory?.amount).toBe(400000); // 150k + 250k
  });
});
