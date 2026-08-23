import { describe, it, expect } from "vitest";
import { createFamilySchema, joinFamilySchema } from "@/lib/validations/family";

describe("Family Validations", () => {
  describe("createFamilySchema", () => {
    it("should accept valid family names", () => {
      const valid = createFamilySchema.safeParse({
        name: "Keluarga Adjie",
        currency: "IDR",
      });
      expect(valid.success).toBe(true);
    });

    it("should reject too short family names", () => {
      const invalid = createFamilySchema.safeParse({
        name: "AB",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("joinFamilySchema", () => {
    it("should accept valid alphanumeric invite codes", () => {
      const valid = joinFamilySchema.safeParse({
        inviteCode: "7K9X2M",
      });
      expect(valid.success).toBe(true);
    });

    it("should reject invite codes with special characters or too short", () => {
      const invalid = joinFamilySchema.safeParse({
        inviteCode: "abc!",
      });
      expect(invalid.success).toBe(false);
    });
  });
});
