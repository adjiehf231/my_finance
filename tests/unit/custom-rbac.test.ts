import { describe, it, expect } from "vitest";
import {
  DEFAULT_ROLE_PERMISSIONS,
  canManageFamily,
  canManageMembers,
  canMutateFinances,
  canViewFinances,
  canDeleteFamily,
  type FamilyPermissionsConfig,
  type FamilyRole,
} from "@/lib/auth/rbac";

describe("Custom RBAC & CRUD Permission Matrix", () => {
  it("should have correct default permissions for Admin role", () => {
    const admin = DEFAULT_ROLE_PERMISSIONS.admin;
    expect(admin.transactions.create).toBe(true);
    expect(admin.transactions.delete).toBe(true);
    expect(admin.wallets.create).toBe(true);
    expect(admin.receiptOcr).toBe(true);
    expect(admin.exportData).toBe(true);
    expect(admin.inviteMembers).toBe(true);
    expect(admin.editFamily).toBe(true);
  });

  it("should restrict destructive capabilities by default for Member role", () => {
    const member = DEFAULT_ROLE_PERMISSIONS.member;
    expect(member.transactions.create).toBe(true);
    expect(member.transactions.read).toBe(true);
    expect(member.transactions.delete).toBe(false); // Member cannot delete transactions by default
    expect(member.wallets.create).toBe(false); // Only admin/owner can create wallets by default
    expect(member.receiptOcr).toBe(true);
    expect(member.exportData).toBe(false);
    expect(member.inviteMembers).toBe(false);
  });

  it("should enforce read-only capabilities for Viewer role", () => {
    const viewer = DEFAULT_ROLE_PERMISSIONS.viewer;
    expect(viewer.transactions.create).toBe(false);
    expect(viewer.transactions.read).toBe(true);
    expect(viewer.transactions.update).toBe(false);
    expect(viewer.transactions.delete).toBe(false);
    expect(viewer.receiptOcr).toBe(false);
    expect(viewer.exportData).toBe(false);
    expect(viewer.inviteMembers).toBe(false);
  });

  it("should evaluate core role guard functions accurately", () => {
    expect(canManageFamily("owner")).toBe(true);
    expect(canManageFamily("admin")).toBe(false);

    expect(canManageMembers("owner")).toBe(true);
    expect(canManageMembers("admin")).toBe(true);
    expect(canManageMembers("member")).toBe(false);
    expect(canManageMembers("viewer")).toBe(false);

    expect(canMutateFinances("member")).toBe(true);
    expect(canMutateFinances("viewer")).toBe(false);

    expect(canViewFinances("viewer")).toBe(true);
    expect(canDeleteFamily("owner")).toBe(true);
    expect(canDeleteFamily("admin")).toBe(false);
  });

  it("should allow customized permissions override", () => {
    const customConfig: FamilyPermissionsConfig = {
      ...DEFAULT_ROLE_PERMISSIONS,
      member: {
        ...DEFAULT_ROLE_PERMISSIONS.member,
        transactions: { create: true, read: true, update: true, delete: true }, // Custom granted delete
        exportData: true, // Custom granted export
      },
    };

    expect(customConfig.member.transactions.delete).toBe(true);
    expect(customConfig.member.exportData).toBe(true);
    expect(customConfig.viewer.transactions.create).toBe(false);
  });
});
