import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, truncate, cn } from "@/lib/utils";

describe("Utils & Helpers", () => {
  describe("formatCurrency()", () => {
    it("should format IDR amounts correctly", () => {
      const formatted = formatCurrency(150000);
      expect(formatted).toContain("150.000");
    });

    it("should handle 0 and NaN gracefully", () => {
      expect(formatCurrency(0)).toContain("0");
      expect(formatCurrency(NaN)).toBe("Rp 0");
    });
  });

  describe("truncate()", () => {
    it("should truncate strings longer than specified length", () => {
      expect(truncate("Beli kopi di Starbucks Grand Indonesia", 15)).toBe(
        "Beli kopi di St..."
      );
    });

    it("should return unchanged string if within length", () => {
      expect(truncate("Gaji Pokok", 20)).toBe("Gaji Pokok");
    });
  });

  describe("cn()", () => {
    it("should merge tailwind class names properly", () => {
      expect(cn("px-4", "py-2", { "bg-emerald-500": true })).toContain(
        "px-4 py-2 bg-emerald-500"
      );
    });
  });
});
