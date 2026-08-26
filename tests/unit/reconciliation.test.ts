import { describe, it, expect } from "vitest";

interface WalletData {
  id: string;
  initial_balance: number;
  current_balance: number;
}

interface MutationTx {
  type: "income" | "expense" | "transfer";
  amount: number;
  wallet_id?: string | null;
  from_wallet_id?: string | null;
  to_wallet_id?: string | null;
  is_deleted?: boolean;
}

function computeReconciledBalance(wallet: WalletData, mutations: MutationTx[]): {
  recalculatedBalance: number;
  discrepancy: number;
} {
  let balance = wallet.initial_balance;

  for (const m of mutations) {
    if (m.is_deleted) continue;

    if (m.type === "income" && m.wallet_id === wallet.id) {
      balance += m.amount;
    } else if (m.type === "expense" && m.wallet_id === wallet.id) {
      balance -= m.amount;
    } else if (m.type === "transfer") {
      if (m.to_wallet_id === wallet.id) {
        balance += m.amount;
      }
      if (m.from_wallet_id === wallet.id) {
        balance -= m.amount;
      }
    }
  }

  return {
    recalculatedBalance: balance,
    discrepancy: balance - wallet.current_balance,
  };
}

describe("Wallet Balance Auto-Reconciliation Engine", () => {
  const sampleWallet: WalletData = {
    id: "wallet-main",
    initial_balance: 1000000, // Rp 1.000.000 initial
    current_balance: 1500000,
  };

  it("calculates exact matching balance with no discrepancy", () => {
    const mutations: MutationTx[] = [
      { type: "income", amount: 2000000, wallet_id: "wallet-main" }, // +2jt -> 3jt
      { type: "expense", amount: 1000000, wallet_id: "wallet-main" }, // -1jt -> 2jt
      { type: "transfer", amount: 500000, from_wallet_id: "wallet-main", to_wallet_id: "wallet-other" }, // -500rb -> 1.5jt
    ];

    const result = computeReconciledBalance(sampleWallet, mutations);
    expect(result.recalculatedBalance).toBe(1500000);
    expect(result.discrepancy).toBe(0);
  });

  it("detects and corrects positive discrepancy from unrecorded income", () => {
    const mutations: MutationTx[] = [
      { type: "income", amount: 3000000, wallet_id: "wallet-main" }, // +3jt -> 4jt
      { type: "expense", amount: 1000000, wallet_id: "wallet-main" }, // -1jt -> 3jt
    ];

    const result = computeReconciledBalance(sampleWallet, mutations);
    expect(result.recalculatedBalance).toBe(3000000);
    expect(result.discrepancy).toBe(1500000); // 3jt - 1.5jt stored = +1.5jt discrepancy
  });

  it("ignores soft deleted transactions during reconciliation", () => {
    const mutations: MutationTx[] = [
      { type: "income", amount: 2000000, wallet_id: "wallet-main" },
      { type: "expense", amount: 500000, wallet_id: "wallet-main", is_deleted: true }, // deleted!
    ];

    const result = computeReconciledBalance(sampleWallet, mutations);
    expect(result.recalculatedBalance).toBe(3000000); // 1jt + 2jt = 3jt
  });
});
