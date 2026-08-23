import { describe, it, expect } from "vitest";
import {
  syncMutationSchema,
  syncBatchRequestSchema,
} from "@/lib/validations/sync";
import {
  resolveConflictLWW,
  processMutationsQueue,
} from "@/lib/sync/conflict-resolver";

describe("Offline Sync Engine & Last-Write-Wins Resolver", () => {
  it("should validate a valid sync mutation object", () => {
    const valid = syncMutationSchema.safeParse({
      id: "77777777-7777-7777-7777-777777777777",
      entity: "transactions",
      operation: "INSERT",
      clientTimestamp: new Date().toISOString(),
      data: {
        amount: 50000,
        description: "Beli Kopi Offline",
      },
    });
    expect(valid.success).toBe(true);
  });

  it("should accept client mutation when no server record exists", () => {
    const mutation = {
      id: "77777777-7777-7777-7777-777777777777",
      entity: "transactions" as const,
      operation: "INSERT" as const,
      clientTimestamp: "2026-08-23T12:00:00.000Z",
      data: { id: "tx-1", amount: 25000 },
      status: "pending" as const,
    };

    const resolution = resolveConflictLWW(mutation, null);
    expect(resolution.winner).toBe("client");
  });

  it("should resolve Last-Write-Wins correctly (Client Wins when newer)", () => {
    const mutation = {
      id: "77777777-7777-7777-7777-777777777777",
      entity: "wallets" as const,
      operation: "UPDATE" as const,
      clientTimestamp: "2026-08-23T15:00:00.000Z",
      data: { id: "w-1", current_balance: 5000000 },
      status: "pending" as const,
    };

    const serverRecord = {
      id: "w-1",
      current_balance: 4000000,
      updated_at: "2026-08-23T14:00:00.000Z",
    };

    const resolution = resolveConflictLWW(mutation, serverRecord);
    expect(resolution.winner).toBe("client");
    expect(resolution.effectiveData.current_balance).toBe(5000000);
  });

  it("should resolve Last-Write-Wins correctly (Server Wins when newer)", () => {
    const mutation = {
      id: "77777777-7777-7777-7777-777777777777",
      entity: "wallets" as const,
      operation: "UPDATE" as const,
      clientTimestamp: "2026-08-23T13:00:00.000Z",
      data: { id: "w-1", current_balance: 2000000 },
      status: "pending" as const,
    };

    const serverRecord = {
      id: "w-1",
      current_balance: 8000000,
      updated_at: "2026-08-23T14:30:00.000Z",
    };

    const resolution = resolveConflictLWW(mutation, serverRecord);
    expect(resolution.winner).toBe("server");
    expect(resolution.effectiveData.current_balance).toBe(8000000);
  });

  it("should process a queue of mutations and update state", () => {
    const mutations = [
      {
        id: "m-1",
        entity: "categories" as const,
        operation: "INSERT" as const,
        clientTimestamp: "2026-08-23T10:00:00.000Z",
        data: { id: "cat-1", name: "Makanan" },
        status: "pending" as const,
      },
      {
        id: "m-2",
        entity: "categories" as const,
        operation: "UPDATE" as const,
        clientTimestamp: "2026-08-23T11:00:00.000Z",
        data: { id: "cat-1", name: "Kuliner Enak" },
        status: "pending" as const,
      },
    ];

    const result = processMutationsQueue(mutations, new Map());
    expect(result.applied.length).toBe(2);
    expect(result.rejected.length).toBe(0);
    expect(result.finalServerState.get("categories:cat-1")?.name).toBe("Kuliner Enak");
  });
});
