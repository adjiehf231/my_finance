import { describe, it, expect } from "vitest";

interface SimpleTx {
  id: string;
  amount: number;
  description: string;
}

function optimisticReducer(
  state: SimpleTx[],
  action: { type: "delete"; id: string } | { type: "add"; transaction: SimpleTx }
): SimpleTx[] {
  switch (action.type) {
    case "delete":
      return state.filter((item) => item.id !== action.id);
    case "add":
      return [action.transaction, ...state];
    default:
      return state;
  }
}

describe("Zero-Latency Optimistic UI Reducer", () => {
  const initialTransactions: SimpleTx[] = [
    { id: "tx-1", amount: 50000, description: "Kopi Kenangan" },
    { id: "tx-2", amount: 150000, description: "Bensin Pertamax" },
    { id: "tx-3", amount: 350000, description: "Belanja Supermarket" },
  ];

  it("removes transaction instantly on optimistic delete action", () => {
    const updated = optimisticReducer(initialTransactions, { type: "delete", id: "tx-2" });
    expect(updated.length).toBe(2);
    expect(updated.find((tx) => tx.id === "tx-2")).toBeUndefined();
    expect(updated[0].id).toBe("tx-1");
    expect(updated[1].id).toBe("tx-3");
  });

  it("prepends transaction instantly on optimistic add action", () => {
    const newTx: SimpleTx = { id: "tx-new", amount: 25000, description: "Snack" };
    const updated = optimisticReducer(initialTransactions, { type: "add", transaction: newTx });
    expect(updated.length).toBe(4);
    expect(updated[0].id).toBe("tx-new");
  });
});
