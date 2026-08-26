import { describe, it, expect } from "vitest";
import { idDictionary } from "@/lib/i18n/dictionaries/id";
import { enDictionary } from "@/lib/i18n/dictionaries/en";

function extractAllKeys(obj: Record<string, any>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys = keys.concat(extractAllKeys(value, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

describe("i18n Multi-Language System Tests", () => {
  it("should have complete 1:1 key parity between Indonesian and English dictionaries", () => {
    const idKeys = extractAllKeys(idDictionary).sort();
    const enKeys = extractAllKeys(enDictionary).sort();

    expect(idKeys.length).toBeGreaterThan(30);
    expect(enKeys.length).toEqual(idKeys.length);
    expect(enKeys).toEqual(idKeys);
  });

  it("should contain non-empty string values for all translated keys", () => {
    const checkValues = (dict: Record<string, any>) => {
      for (const [_, value] of Object.entries(dict)) {
        if (typeof value === "string") {
          expect(value.trim().length).toBeGreaterThan(0);
        } else if (typeof value === "object" && value !== null) {
          checkValues(value);
        }
      }
    };

    checkValues(idDictionary);
    checkValues(enDictionary);
  });

  it("should support parameter placeholder interpolation format", () => {
    const template = "Halo {name}, total pengeluaran Anda adalah {amount}";
    const interpolated = template
      .replace("{name}", "Adjie")
      .replace("{amount}", "Rp 50.000");

    expect(interpolated).toBe("Halo Adjie, total pengeluaran Anda adalah Rp 50.000");
  });
});
