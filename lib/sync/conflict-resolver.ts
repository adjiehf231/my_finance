import {
  type SyncMutation,
  type SyncBatchResponse,
} from "@/lib/validations/sync";

export interface ConflictResolutionResult {
  winner: "client" | "server";
  effectiveData: Record<string, any>;
  reason: string;
}

/**
 * Resolve mutation conflict using Last-Write-Wins (LWW) algorithm
 */
export function resolveConflictLWW(
  clientMutation: SyncMutation,
  serverRecord: Record<string, any> | null
): ConflictResolutionResult {
  if (!serverRecord) {
    return {
      winner: "client",
      effectiveData: clientMutation.data,
      reason: "No existing server record. Client insert accepted.",
    };
  }

  const clientTime = new Date(clientMutation.clientTimestamp).getTime();
  const serverTime = serverRecord.updated_at
    ? new Date(serverRecord.updated_at).getTime()
    : new Date(serverRecord.created_at || 0).getTime();

  if (clientTime >= serverTime) {
    return {
      winner: "client",
      effectiveData: {
        ...serverRecord,
        ...clientMutation.data,
        updated_at: new Date().toISOString(),
      },
      reason: `Client mutation (${clientMutation.clientTimestamp}) is newer than server record (${serverRecord.updated_at}).`,
    };
  }

  return {
    winner: "server",
    effectiveData: serverRecord,
    reason: `Server record (${serverRecord.updated_at}) is newer than client mutation (${clientMutation.clientTimestamp}).`,
  };
}

/**
 * Process a queue of mutations and compute final resolution
 */
export function processMutationsQueue(
  mutations: SyncMutation[],
  currentServerState: Map<string, Record<string, any>>
): {
  applied: SyncMutation[];
  rejected: SyncMutation[];
  finalServerState: Map<string, Record<string, any>>;
} {
  const applied: SyncMutation[] = [];
  const rejected: SyncMutation[] = [];
  const state = new Map(currentServerState);

  // Sort mutations chronologically by clientTimestamp
  const sorted = [...mutations].sort(
    (a, b) =>
      new Date(a.clientTimestamp).getTime() - new Date(b.clientTimestamp).getTime()
  );

  for (const m of sorted) {
    const key = `${m.entity}:${m.data.id || m.id}`;
    const existing = state.get(key) || null;
    const res = resolveConflictLWW(m, existing);

    if (res.winner === "client") {
      if (m.operation === "DELETE") {
        state.delete(key);
      } else {
        state.set(key, res.effectiveData);
      }
      applied.push(m);
    } else {
      rejected.push(m);
    }
  }

  return { applied, rejected, finalServerState: state };
}
