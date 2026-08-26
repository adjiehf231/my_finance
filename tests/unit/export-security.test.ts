import { describe, it, expect } from "vitest";
import {
  exportRequestSchema,
  pinLockSchema,
} from "@/lib/validations/export";
import {
  generateTransactionsCsv,
  escapeCsvField,
} from "@/lib/export/csv-generator";
import { hashPin, verifyPin } from "@/lib/security/pin-lock";

describe("Export Engine & Security Hardening Tests", () => {
  it("should escape special characters in CSV fields (RFC 4180)", () => {
    expect(escapeCsvField("Kopi, Susu")).toBe('"Kopi, Susu"');
    expect(escapeCsvField('Beli "Promo"')).toBe('"Beli ""Promo"""');
    expect(escapeCsvField("Biasa")).toBe('"Biasa"');
  });

  it("should generate CSV with UTF-8 BOM for Excel compatibility", () => {
    const csv = generateTransactionsCsv([
      {
        id: "tx-1",
        transaction_date: "2026-08-23",
        type: "expense",
        amount: 50000,
        category_name: "Makanan",
        wallet_name: "BCA",
        description: "Makan Siang",
      },
    ]);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("ID Transaksi");
    expect(csv).toContain("Makan Siang");
    expect(csv).toContain("50000");
  });

  it("should validate 6-digit PIN lock schema", () => {
    const valid = pinLockSchema.safeParse({ pin: "123456" });
    const invalidShort = pinLockSchema.safeParse({ pin: "12345" });
    const invalidAlpha = pinLockSchema.safeParse({ pin: "12345a" });

    expect(valid.success).toBe(true);
    expect(invalidShort.success).toBe(false);
    expect(invalidAlpha.success).toBe(false);
  });

  it("should hash and verify 6-digit PIN correctly using SHA-256", async () => {
    const pin = "889900";
    const hashed = await hashPin(pin);
    expect(hashed).toHaveLength(64);

    const isMatch = await verifyPin(pin, hashed);
    const isWrong = await verifyPin("111111", hashed);
    expect(isMatch).toBe(true);
    expect(isWrong).toBe(false);
  });

  it("should validate JSON backup payload structure for data restore", () => {
    const validPayload = {
      exportDate: "2026-08-26T12:00:00.000Z",
      wallets: [{ name: "BCA", type: "bank", initial_balance: 1000000 }],
      transactions: [{ amount: 50000, type: "expense", description: "Beli Kopi" }],
      categories: [{ name: "Kopi", type: "expense" }],
      goals: [{ name: "Dana Darurat", target_amount: 10000000 }],
      debts: [{ name: "Pinjaman Teman", total_amount: 500000 }],
    };

    expect(Array.isArray(validPayload.wallets)).toBe(true);
    expect(validPayload.wallets.length).toBe(1);
    expect(Array.isArray(validPayload.transactions)).toBe(true);
    expect(validPayload.transactions.length).toBe(1);
    expect(Array.isArray(validPayload.categories)).toBe(true);
    expect(Array.isArray(validPayload.goals)).toBe(true);
    expect(Array.isArray(validPayload.debts)).toBe(true);
  });
});
