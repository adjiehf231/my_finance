import { describe, it, expect } from "vitest";

interface FilterableTx {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  transaction_date: string;
  wallet_id?: string | null;
  from_wallet_id?: string | null;
  to_wallet_id?: string | null;
  category_id?: string | null;
  description?: string | null;
}

function filterTransactions(
  list: FilterableTx[],
  filters: {
    type?: "income" | "expense" | "transfer";
    walletId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
  }
): FilterableTx[] {
  return list.filter((tx) => {
    if (filters.type && tx.type !== filters.type) return false;
    if (filters.walletId) {
      const match =
        tx.wallet_id === filters.walletId ||
        tx.from_wallet_id === filters.walletId ||
        tx.to_wallet_id === filters.walletId;
      if (!match) return false;
    }
    if (filters.categoryId && tx.category_id !== filters.categoryId) return false;
    if (filters.startDate && tx.transaction_date < filters.startDate) return false;
    if (filters.endDate && tx.transaction_date > filters.endDate) return false;
    if (filters.minAmount !== undefined && tx.amount < filters.minAmount) return false;
    if (filters.maxAmount !== undefined && tx.amount > filters.maxAmount) return false;
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const desc = (tx.description || "").toLowerCase();
      if (!desc.includes(q)) return false;
    }
    return true;
  });
}

describe("Deep Transaction Filtering Engine", () => {
  const sampleTransactions: FilterableTx[] = [
    {
      id: "tx-1",
      type: "expense",
      amount: 50000,
      transaction_date: "2026-08-01",
      wallet_id: "w-bca",
      category_id: "c-food",
      description: "Makan Siang Soto Betawi",
    },
    {
      id: "tx-2",
      type: "expense",
      amount: 1500000,
      transaction_date: "2026-08-10",
      wallet_id: "w-bca",
      category_id: "c-bills",
      description: "Bayar Listrik PLN dan Wifi",
    },
    {
      id: "tx-3",
      type: "income",
      amount: 10000000,
      transaction_date: "2026-08-15",
      wallet_id: "w-mandiri",
      category_id: "c-salary",
      description: "Gaji Bulanan Utama",
    },
    {
      id: "tx-4",
      type: "transfer",
      amount: 500000,
      transaction_date: "2026-08-20",
      from_wallet_id: "w-bca",
      to_wallet_id: "w-gopay",
      description: "Top up GoPay jajan",
    },
  ];

  it("filters by transaction type accurately", () => {
    const expenses = filterTransactions(sampleTransactions, { type: "expense" });
    expect(expenses.length).toBe(2);
    expect(expenses.map((e) => e.id)).toEqual(["tx-1", "tx-2"]);
  });

  it("filters by amount range (minAmount and maxAmount)", () => {
    const mediumTx = filterTransactions(sampleTransactions, {
      minAmount: 100000,
      maxAmount: 2000000,
    });
    expect(mediumTx.length).toBe(2);
    expect(mediumTx.map((t) => t.id)).toEqual(["tx-2", "tx-4"]);
  });

  it("filters by date range", () => {
    const earlyAugust = filterTransactions(sampleTransactions, {
      startDate: "2026-08-01",
      endDate: "2026-08-12",
    });
    expect(earlyAugust.length).toBe(2);
    expect(earlyAugust.map((t) => t.id)).toEqual(["tx-1", "tx-2"]);
  });

  it("filters by wallet inclusion across income, expense, and transfer routes", () => {
    const bcaTx = filterTransactions(sampleTransactions, { walletId: "w-bca" });
    expect(bcaTx.length).toBe(3); // tx-1, tx-2, and tx-4 (as from_wallet)
  });

  it("filters by keyword search across descriptions", () => {
    const wifiTx = filterTransactions(sampleTransactions, { search: "wifi" });
    expect(wifiTx.length).toBe(1);
    expect(wifiTx[0].id).toBe("tx-2");
  });
});
