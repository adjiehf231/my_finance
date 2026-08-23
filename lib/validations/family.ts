import { z } from "zod";

export const createFamilySchema = z.object({
  name: z
    .string()
    .min(3, "Nama keluarga minimal 3 karakter")
    .max(50, "Nama keluarga maksimal 50 karakter"),
  currency: z.string().default("IDR"),
});

export const joinFamilySchema = z.object({
  inviteCode: z
    .string()
    .min(6, "Kode undangan minimal 6 karakter")
    .max(16, "Kode undangan maksimal 16 karakter")
    .regex(/^[A-Z0-9]+$/, "Kode undangan hanya boleh huruf kapital dan angka"),
});

export const updateMemberRoleSchema = z.object({
  familyId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(["owner", "admin", "member"]),
});

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type JoinFamilyInput = z.infer<typeof joinFamilySchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
