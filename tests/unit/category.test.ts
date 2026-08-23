import { describe, it, expect } from "vitest";
import { createCategorySchema } from "@/lib/validations/category";

describe("Category Validations", () => {
  it("should validate a valid expense category", () => {
    const valid = createCategorySchema.safeParse({
      name: "Belanja Bulanan",
      type: "expense",
      color: "#EF4444",
      icon: "shopping-bag",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate a valid income category", () => {
    const valid = createCategorySchema.safeParse({
      name: "Dividen Saham",
      type: "income",
      color: "#10B981",
      icon: "trending-up",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject too short category names", () => {
    const invalid = createCategorySchema.safeParse({
      name: "A",
      type: "income",
    });
    expect(invalid.success).toBe(false);
  });

  it("should reject invalid category types", () => {
    const invalid = createCategorySchema.safeParse({
      name: "Investasi",
      type: "transfer_invalid",
    });
    expect(invalid.success).toBe(false);
  });
});
