import { describe, it, expect } from "vitest";
import { suggestCategoryFromDescription, SuggestionCategory } from "@/lib/ai/category-suggester";

describe("Real-Time Contextual Category Suggester", () => {
  const testCategories: SuggestionCategory[] = [
    { id: "cat-fnb", name: "Makanan & Minuman", type: "expense" },
    { id: "cat-transport", name: "Transportasi & Bensin", type: "expense" },
    { id: "cat-bills", name: "Tagihan & Utilitas", type: "expense" },
    { id: "cat-shopping", name: "Belanja Kebutuhan", type: "expense" },
    { id: "cat-entertainment", name: "Hiburan & Hobi", type: "expense" },
    { id: "cat-health", name: "Kesehatan & Medis", type: "expense" },
    { id: "cat-salary", name: "Gaji & Pendapatan", type: "income" },
  ];

  it("suggests Food & Beverage for dining and coffee keywords", () => {
    const res1 = suggestCategoryFromDescription("Beli Kopi Kenangan 2 cup", testCategories);
    expect(res1?.id).toBe("cat-fnb");

    const res2 = suggestCategoryFromDescription("Makan siang nasi padang bersama tim", testCategories);
    expect(res2?.id).toBe("cat-fnb");
  });

  it("suggests Transport for fuel and ride-hailing keywords", () => {
    const res1 = suggestCategoryFromDescription("Isi bensin pertamax di SPBU", testCategories);
    expect(res1?.id).toBe("cat-transport");

    const res2 = suggestCategoryFromDescription("Ongkos Gojek ke stasiun", testCategories);
    expect(res2?.id).toBe("cat-transport");
  });

  it("suggests Bills & Utilities for electricity and wifi keywords", () => {
    const res1 = suggestCategoryFromDescription("Beli token listrik PLN", testCategories);
    expect(res1?.id).toBe("cat-bills");

    const res2 = suggestCategoryFromDescription("Bayar langganan wifi indihome", testCategories);
    expect(res2?.id).toBe("cat-bills");
  });

  it("suggests Entertainment for streaming and cinema keywords", () => {
    const res = suggestCategoryFromDescription("Langganan bulanan Netflix Premium", testCategories);
    expect(res?.id).toBe("cat-entertainment");
  });

  it("returns null for unrecognized or empty descriptions", () => {
    const res1 = suggestCategoryFromDescription("", testCategories);
    expect(res1).toBeNull();

    const res2 = suggestCategoryFromDescription("asdf qwerty 12345", testCategories);
    expect(res2).toBeNull();
  });
});
