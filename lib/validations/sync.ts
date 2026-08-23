import { z } from "zod";

export const syncOperationEnum = z.enum(["INSERT", "UPDATE", "DELETE"]);
export const syncEntityEnum = z.enum([
  "wallets",
  "transactions",
  "categories",
  "budgets",
  "goals",
  "debts",
]);

export const syncMutationSchema = z.object({
  id: z.string().uuid(),
  entity: syncEntityEnum,
  operation: syncOperationEnum,
  clientTimestamp: z.string().datetime(),
  data: z.record(z.any()),
  status: z.enum(["pending", "synced", "failed"]).default("pending"),
});

export const syncBatchRequestSchema = z.object({
  familyId: z.string().uuid(),
  lastSyncTimestamp: z.string().datetime().nullable().optional(),
  mutations: z.array(syncMutationSchema).default([]),
});

export const syncBatchResponseSchema = z.object({
  success: z.boolean(),
  serverTimestamp: z.string().datetime(),
  appliedCount: z.number().default(0),
  rejectedCount: z.number().default(0),
  changes: z.record(z.array(z.record(z.any()))).default({}),
  conflicts: z.array(
    z.object({
      mutationId: z.string(),
      entity: z.string(),
      reason: z.string(),
      resolution: z.enum(["client_won", "server_won"]),
    })
  ).default([]),
});

export type SyncOperation = z.infer<typeof syncOperationEnum>;
export type SyncEntity = z.infer<typeof syncEntityEnum>;
export type SyncMutation = z.infer<typeof syncMutationSchema>;
export type SyncBatchRequest = z.infer<typeof syncBatchRequestSchema>;
export type SyncBatchResponse = z.infer<typeof syncBatchResponseSchema>;
