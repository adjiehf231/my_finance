import { useState, useEffect, useCallback } from "react";
import { type SyncBatchResponse, type SyncMutation } from "@/lib/validations/sync";

export interface UseOfflineSyncProps {
  familyId: string;
  apiBaseUrl?: string;
  authToken?: string;
}

export function useOfflineSync({
  familyId,
  apiBaseUrl = "/api/sync",
  authToken,
}: UseOfflineSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);

  const performSync = useCallback(
    async (mutations: SyncMutation[] = []) => {
      if (!familyId) return;

      try {
        setIsSyncing(true);
        setSyncError(null);

        const res = await fetch(apiBaseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify({
            familyId,
            lastSyncTimestamp: lastSyncedAt,
            mutations,
          }),
        });

        if (!res.ok) {
          throw new Error(`Sync failed with status: ${res.status}`);
        }

        const data: SyncBatchResponse = await res.json();
        setLastSyncedAt(data.serverTimestamp);
        setPendingQueueCount(0);
        return data;
      } catch (err: any) {
        setSyncError(err.message || "Failed to sync");
        return null;
      } finally {
        setIsSyncing(false);
      }
    },
    [familyId, apiBaseUrl, authToken, lastSyncedAt]
  );

  return {
    isSyncing,
    lastSyncedAt,
    pendingQueueCount,
    syncError,
    performSync,
  };
}
