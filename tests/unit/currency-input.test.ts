import { describe, it, expect } from "vitest";
import { formatRupiahRaw, parseRupiahToNumber } from "@/components/ui/currency-input";

describe("CurrencyInput Utility Engine", () => {
  it("formats raw digit strings with Indonesian thousand separators (. )", () => {
    expect(formatRupiahRaw("50000")).toBe("50.000");
    expect(formatRupiahRaw("1500000")).toBe("1.500.000");
    expect(formatRupiahRaw("100000000")).toBe("100.000.000");
  });

  it("handles non-digit inputs and sanitizes properly", () => {
    expect(formatRupiahRaw("Rp 50.000")).toBe("50.000");
    expect(formatRupiahRaw("abc123xyz456")).toBe("123.456");
    expect(formatRupiahRaw("")).toBe("");
    expect(formatRupiahRaw("0")).toBe("0");
  });

  it("parses formatted Rupiah strings to numeric integers", () => {
    expect(parseRupiahToNumber("50.000")).toBe(50000);
    expect(parseRupiahToNumber("1.500.000")).toBe(1500000);
    expect(parseRupiahToNumber("Rp 750.000")).toBe(750000);
    expect(parseRupiahToNumber("")).toBe(0);
    expect(parseRupiahToNumber("invalid")).toBe(0);
  });
});
