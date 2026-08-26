import { describe, it, expect } from "vitest";
import {
  canManageFamily,
  canManageMembers,
  canMutateFinances,
  canViewFinances,
  canDeleteFamily,
  ROLE_DEFINITIONS,
  type FamilyRole,
} from "@/lib/auth/rbac";

describe("Granular Family RBAC Permission Matrix", () => {
  it("grants full administrative power only to Owner", () => {
    expect(canManageFamily("owner")).toBe(true);
    expect(canDeleteFamily("owner")).toBe(true);
    expect(canManageMembers("owner")).toBe(true);
    expect(canMutateFinances("owner")).toBe(true);
    expect(canViewFinances("owner")).toBe(true);
  });

  it("grants member management & financial mutation to Admin but blocks workspace deletion", () => {
    expect(canManageFamily("admin")).toBe(false);
    expect(canDeleteFamily("admin")).toBe(false);
    expect(canManageMembers("admin")).toBe(true);
    expect(canMutateFinances("admin")).toBe(true);
    expect(canViewFinances("admin")).toBe(true);
  });

  it("grants regular Member financial mutation rights without member administration", () => {
    expect(canManageFamily("member")).toBe(false);
    expect(canDeleteFamily("member")).toBe(false);
    expect(canManageMembers("member")).toBe(false);
    expect(canMutateFinances("member")).toBe(true);
    expect(canViewFinances("member")).toBe(true);
  });

  it("strictly restricts Viewer to read-only access", () => {
    expect(canManageFamily("viewer")).toBe(false);
    expect(canDeleteFamily("viewer")).toBe(false);
    expect(canManageMembers("viewer")).toBe(false);
    expect(canMutateFinances("viewer")).toBe(false);
    expect(canViewFinances("viewer")).toBe(true);
  });

  it("defines comprehensive role metadata for all 4 roles", () => {
    const roles: FamilyRole[] = ["owner", "admin", "member", "viewer"];
    roles.forEach((r) => {
      expect(ROLE_DEFINITIONS[r]).toBeDefined();
      expect(ROLE_DEFINITIONS[r].label).toBeTruthy();
      expect(ROLE_DEFINITIONS[r].badgeClass).toBeTruthy();
    });
  });
});
