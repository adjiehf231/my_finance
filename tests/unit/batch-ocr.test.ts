import { describe, it, expect } from "vitest";

interface ScannedItem {
  merchantName: string;
  transactionDate: string;
  totalAmount: number;
  categorySuggestion: string;
}

function processBatchReceiptQueue(
  familyId: string,
  walletId: string,
  scannedItems: ScannedItem[],
  categories: Array<{ id: string; name: string }>
) {
  const transactions = scannedItems
    .filter((item) => item.totalAmount > 0)
    .map((item) => {
      const matched = categories.find((c) =>
        c.name.toLowerCase().includes(item.categorySuggestion.toLowerCase())
      );
      return {
        familyId,
        walletId,
        amount: item.totalAmount,
        transactionDate: item.transactionDate,
        categoryId: matched?.id || null,
        description: `Belanja di ${item.merchantName}`,
      };
    });

  const grandTotal = transactions.reduce((acc, t) => acc + t.amount, 0);

  return {
    count: transactions.length,
    grandTotal,
    transactions,
  };
}

describe("Batch Receipt OCR Processing Engine", () => {
  const sampleCategories = [
    { id: "c-food", name: "Makanan & Minuman" },
    { id: "c-groceries", name: "Belanja Bulanan Supermarket" },
    { id: "c-transport", name: "Transportasi" },
  ];

  it("processes multiple scanned receipts and calculates grand total", () => {
    const rawScans: ScannedItem[] = [
      {
        merchantName: "Indomaret Point",
        transactionDate: "2026-08-25",
        totalAmount: 75000,
        categorySuggestion: "Supermarket",
      },
      {
        merchantName: "Kopi Janji Jiwa",
        transactionDate: "2026-08-25",
        totalAmount: 48000,
        categorySuggestion: "Makanan",
      },
      {
        merchantName: "SPBU Pertamina",
        transactionDate: "2026-08-26",
        totalAmount: 150000,
        categorySuggestion: "Transportasi",
      },
    ];

    const result = processBatchReceiptQueue(
      "fam-123",
      "w-bca",
      rawScans,
      sampleCategories
    );

    expect(result.count).toBe(3);
    expect(result.grandTotal).toBe(273000); // 75k + 48k + 150k
    expect(result.transactions[0].categoryId).toBe("c-groceries");
    expect(result.transactions[1].categoryId).toBe("c-food");
    expect(result.transactions[2].categoryId).toBe("c-transport");
  });

  it("filters out invalid 0 amount items from batch queue", () => {
    const rawScans: ScannedItem[] = [
      {
        merchantName: "Unknown Blank Receipt",
        transactionDate: "2026-08-25",
        totalAmount: 0,
        categorySuggestion: "Lainnya",
      },
      {
        merchantName: "Starbucks Coffee",
        transactionDate: "2026-08-25",
        totalAmount: 65000,
        categorySuggestion: "Makanan",
      },
    ];

    const result = processBatchReceiptQueue(
      "fam-123",
      "w-bca",
      rawScans,
      sampleCategories
    );

    expect(result.count).toBe(1);
    expect(result.grandTotal).toBe(65000);
    expect(result.transactions[0].description).toBe("Belanja di Starbucks Coffee");
  });
});
