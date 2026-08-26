import { describe, it, expect } from "vitest";

interface MockActivityLog {
  id: string;
  action: "create" | "update" | "delete" | "reconcile" | "join";
  entity: "transaction" | "wallet" | "budget" | "debt" | "family_member";
  description: string;
  actor_name: string;
}

function filterActivityLogs(
  logs: MockActivityLog[],
  filters: {
    action?: string;
    entity?: string;
    search?: string;
  }
): MockActivityLog[] {
  return logs.filter((log) => {
    if (filters.action && filters.action !== "all" && log.action !== filters.action) {
      return false;
    }
    if (filters.entity && filters.entity !== "all" && log.entity !== filters.entity) {
      return false;
    }
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const desc = log.description.toLowerCase();
      const actor = log.actor_name.toLowerCase();
      if (!desc.includes(q) && !actor.includes(q)) return false;
    }
    return true;
  });
}

describe("Activity Audit Log Filtering Engine", () => {
  const sampleLogs: MockActivityLog[] = [
    {
      id: "log-1",
      action: "create",
      entity: "transaction",
      description: "Pengeluaran Rp 50.000 (Makan Siang) dicatat",
      actor_name: "Budi Santoso",
    },
    {
      id: "log-2",
      action: "update",
      entity: "budget",
      description: "Batas limit anggaran Makanan diubah menjadi Rp 2.500.000",
      actor_name: "Siti Rahma",
    },
    {
      id: "log-3",
      action: "reconcile",
      entity: "wallet",
      description: "Rekonsiliasi saldo Dompet BCA berhasil disesuaikan",
      actor_name: "Budi Santoso",
    },
    {
      id: "log-4",
      action: "delete",
      entity: "transaction",
      description: "Transaksi salah input dihapus dari buku kas",
      actor_name: "Siti Rahma",
    },
    {
      id: "log-5",
      action: "join",
      entity: "family_member",
      description: "Anggota baru bergabung ke keluarga",
      actor_name: "Andi Wijaya",
    },
  ];

  it("filters logs by specific action type", () => {
    const creates = filterActivityLogs(sampleLogs, { action: "create" });
    expect(creates.length).toBe(1);
    expect(creates[0].id).toBe("log-1");

    const reconciles = filterActivityLogs(sampleLogs, { action: "reconcile" });
    expect(reconciles.length).toBe(1);
    expect(reconciles[0].id).toBe("log-3");
  });

  it("filters logs by specific entity", () => {
    const transactions = filterActivityLogs(sampleLogs, { entity: "transaction" });
    expect(transactions.length).toBe(2);
    expect(transactions.map((t) => t.id)).toEqual(["log-1", "log-4"]);
  });

  it("searches logs across description and actor name", () => {
    const bcaLogs = filterActivityLogs(sampleLogs, { search: "BCA" });
    expect(bcaLogs.length).toBe(1);
    expect(bcaLogs[0].id).toBe("log-3");

    const sitiLogs = filterActivityLogs(sampleLogs, { search: "Siti" });
    expect(sitiLogs.length).toBe(2);
    expect(sitiLogs.map((s) => s.id)).toEqual(["log-2", "log-4"]);
  });
});
