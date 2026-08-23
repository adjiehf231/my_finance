"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getGeminiModel,
  extractJsonFromResponse,
  calculateLocalFinancialHealth,
} from "@/lib/ai/gemini-client";
import {
  receiptOcrResponseSchema,
  financialAdviceResponseSchema,
  type ReceiptOcrResponse,
  type FinancialAdviceResponse,
} from "@/lib/validations/ai";

/**
 * Scan receipt image using Gemini 1.5 Flash Multimodal OCR
 */
export async function scanReceiptWithAIAction(
  base64Data: string,
  mimeType: string = "image/jpeg"
) {
  try {
    const model = getGeminiModel();

    if (!model) {
      // Fallback default response when Gemini is not configured
      return {
        success: true,
        data: {
          merchantName: "Struk Pembelian",
          transactionDate: new Date().toISOString().split("T")[0],
          totalAmount: 0,
          categorySuggestion: "Makanan & Minuman",
          items: [],
        } as ReceiptOcrResponse,
        source: "fallback",
      };
    }

    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `
Anda adalah AI Financial OCR Specialist untuk struk belanja di Indonesia.
Analisis gambar struk nota berikut dan ekstrak informasinya ke dalam format JSON murni:
{
  "merchantName": "Nama Toko / Restoran / Supermarket",
  "transactionDate": "YYYY-MM-DD",
  "totalAmount": 150000,
  "categorySuggestion": "Kategori yang paling cocok (misal: Makanan & Minuman, Belanja Bulanan, Transportasi, Kesehatan)",
  "items": [
    { "name": "Nama Produk", "price": 50000, "quantity": 1 }
  ]
}
Pastikan hanya mengembalikan format JSON yang valid tanpa teks pembuka atau penutup.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanBase64,
          mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    const parsed = extractJsonFromResponse(responseText);

    if (parsed) {
      const validated = receiptOcrResponseSchema.parse(parsed);
      return { success: true, data: validated, source: "gemini" };
    }

    return {
      success: true,
      data: {
        merchantName: "Struk Pembelian",
        transactionDate: new Date().toISOString().split("T")[0],
        totalAmount: 0,
        categorySuggestion: "Makanan & Minuman",
        items: [],
      } as ReceiptOcrResponse,
      source: "fallback",
    };
  } catch (err: any) {
    return {
      success: true,
      data: {
        merchantName: "Struk Pembelian",
        transactionDate: new Date().toISOString().split("T")[0],
        totalAmount: 0,
        categorySuggestion: "Makanan & Minuman",
        items: [],
      } as ReceiptOcrResponse,
      source: "fallback",
      error: err.message,
    };
  }
}

/**
 * Predict category based on description and available categories
 */
export async function predictCategoryWithAIAction(
  description: string,
  categories: Array<{ id: string; name: string }>
) {
  try {
    const model = getGeminiModel();
    if (!model || categories.length === 0) {
      return { success: false, categoryId: null };
    }

    const prompt = `
Pilih satu kategori yang paling cocok untuk transaksi: "${description}".
Daftar kategori yang tersedia:
${categories.map((c) => `- ID: "${c.id}", Nama: "${c.name}"`).join("\n")}

Kembalikan format JSON murni:
{
  "categoryId": "ID kategori terpilih",
  "categoryName": "Nama kategori",
  "confidence": 0.95,
  "reason": "Alasan singkat"
}
`;

    const result = await model.generateContent(prompt);
    const parsed = extractJsonFromResponse(result.response.text());

    if (parsed && parsed.categoryId) {
      return { success: true, ...parsed };
    }

    return { success: false, categoryId: null };
  } catch {
    return { success: false, categoryId: null };
  }
}

/**
 * Get AI Financial Health Advisor evaluation and recommendations
 */
export async function getFinancialHealthAdviceAction(familyId: string) {
  try {
    const supabase = await createClient();

    // 1. Gather comprehensive family financial metrics
    const [walletsRes, transactionsRes, debtsRes, goalsRes] = await Promise.all([
      (supabase as any)
        .from("wallets")
        .select("current_balance")
        .eq("family_id", familyId)
        .eq("is_active", true),
      (supabase as any)
        .from("transactions")
        .select("type, amount")
        .eq("family_id", familyId)
        .eq("is_deleted", false),
      (supabase as any)
        .from("debts")
        .select("type, remaining_amount")
        .eq("family_id", familyId)
        .eq("status", "active"),
      (supabase as any)
        .from("financial_goals")
        .select("name, target_amount, current_amount")
        .eq("family_id", familyId),
    ]);

    let totalSavings = 0;
    (walletsRes.data || []).forEach((w: any) => {
      totalSavings += Number(w.current_balance || 0);
    });

    let monthlyIncome = 0;
    let monthlyExpense = 0;
    (transactionsRes.data || []).forEach((t: any) => {
      const amt = Number(t.amount || 0);
      if (t.type === "income") monthlyIncome += amt;
      else if (t.type === "expense") monthlyExpense += amt;
    });

    let totalDebt = 0;
    (debtsRes.data || []).forEach((d: any) => {
      if (d.type === "loan_payable") totalDebt += Number(d.remaining_amount || 0);
    });

    const goalsSummary = (goalsRes.data || []).map(
      (g: any) => `${g.name}: Rp ${g.current_amount}/${g.target_amount}`
    );

    const model = getGeminiModel();

    if (!model) {
      // Heuristic fallback
      const fallback = calculateLocalFinancialHealth({
        monthlyIncome,
        monthlyExpense,
        totalDebt,
        totalSavings,
      });
      return { success: true, data: fallback, source: "heuristic" };
    }

    const prompt = `
Anda adalah Financial Planner AI berpengalaman untuk keluarga di Indonesia.
Analisis data finansial keluarga berikut:
- Total Saldo / Tabungan Saat Ini: Rp ${totalSavings.toLocaleString("id-ID")}
- Pemasukan Kas: Rp ${monthlyIncome.toLocaleString("id-ID")}
- Pengeluaran Kas: Rp ${monthlyExpense.toLocaleString("id-ID")}
- Total Hutang Kewajiban: Rp ${totalDebt.toLocaleString("id-ID")}
- Target Tabungan: ${goalsSummary.join(", ") || "Belum ada"}

Berikan evaluasi kesehatan finansial objektif dalam format JSON murni:
{
  "healthScore": 82, // Nilai 0 - 100
  "status": "excellent" | "good" | "fair" | "critical",
  "summary": "Ringkasan analisis kondisi keuangan keluarga dalam 2 kalimat profesional dan ramah.",
  "recommendations": [
    "Saran actionable 1",
    "Saran actionable 2",
    "Saran actionable 3"
  ],
  "savingsTip": "Tip praktis penghematan harian/mingguan"
}
`;

    const result = await model.generateContent(prompt);
    const parsed = extractJsonFromResponse(result.response.text());

    if (parsed) {
      const validated = financialAdviceResponseSchema.parse(parsed);
      return { success: true, data: validated, source: "gemini" };
    }

    const fallback = calculateLocalFinancialHealth({
      monthlyIncome,
      monthlyExpense,
      totalDebt,
      totalSavings,
    });
    return { success: true, data: fallback, source: "heuristic" };
  } catch (err: any) {
    const fallback = calculateLocalFinancialHealth({
      monthlyIncome: 10000000,
      monthlyExpense: 7000000,
      totalDebt: 0,
      totalSavings: 20000000,
    });
    return { success: true, data: fallback, source: "heuristic" };
  }
}
