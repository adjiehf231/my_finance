"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
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
 * Scan multiple receipt images simultaneously in batch
 */
export async function scanBatchReceiptsAction(
  images: Array<{ base64Data: string; mimeType?: string }>
) {
  try {
    const results = await Promise.all(
      images.map((img, idx) =>
        scanReceiptWithAIAction(img.base64Data, img.mimeType || "image/jpeg").then(
          (res) => ({
            index: idx,
            ...res,
          })
        )
      )
    );

    return { success: true, results };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memproses batch OCR" };
  }
}

/**
 * Commit multiple scanned transactions into the ledger in 1 batch
 */
export async function createBatchTransactionsAction(input: {
  familyId: string;
  walletId: string;
  transactions: Array<{
    amount: number;
    transactionDate: string;
    categoryId?: string | null;
    description: string;
    attachmentUrl?: string | null;
  }>;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus login terlebih dahulu" };
    }

    const records = input.transactions
      .filter((t) => t.amount > 0)
      .map((t) => ({
        family_id: input.familyId,
        user_id: user.id,
        type: "expense",
        amount: t.amount,
        transaction_date: t.transactionDate,
        wallet_id: input.walletId,
        category_id: t.categoryId || null,
        description: t.description || null,
        attachment_url: t.attachmentUrl || null,
        is_deleted: false,
      }));

    if (records.length === 0) {
      return { success: false, error: "Tidak ada transaksi valid untuk disimpan" };
    }

    const { data, error } = await (supabase as any)
      .from("transactions")
      .insert(records)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    // Log activity
    await (supabase as any).from("activity_logs").insert({
      family_id: input.familyId,
      user_id: user.id,
      action: "create",
      entity: "transaction",
      description: `Batch OCR: ${records.length} transaksi struk belanja berhasil dicatat sekaligus.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    revalidatePath("/wallets");

    return { success: true, count: records.length, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan batch transaksi" };
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
  } catch {
    const fallback = calculateLocalFinancialHealth({
      monthlyIncome: 10000000,
      monthlyExpense: 7000000,
      totalDebt: 0,
      totalSavings: 20000000,
    });
    return { success: true, data: fallback, source: "heuristic" };
  }
}

export interface WeeklyDigestData {
  weekLabel: string;
  totalExpenseThisWeek: number;
  totalExpenseLastWeek: number;
  velocityPercentage: number;
  topExpenseCategory: {
    name: string;
    amount: number;
  } | null;
  tips: string[];
  summary: string;
}

/**
 * Get Weekly AI Financial Digest & Saving Hacks
 */
export async function getWeeklyFinancialDigestAction(familyId: string) {
  try {
    const supabase = await createClient();

    const now = new Date();
    const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const d14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const dateToday = now.toISOString().split("T")[0];
    const date7DaysAgo = d7.toISOString().split("T")[0];
    const date14DaysAgo = d14.toISOString().split("T")[0];

    // Fetch transactions from last 14 days
    const { data: transactions } = await (supabase as any)
      .from("transactions")
      .select(`
        amount,
        type,
        transaction_date,
        categories:category_id (name)
      `)
      .eq("family_id", familyId)
      .eq("type", "expense")
      .eq("is_deleted", false)
      .gte("transaction_date", date14DaysAgo)
      .lte("transaction_date", dateToday);

    let expenseThisWeek = 0;
    let expenseLastWeek = 0;
    const categoryTotals: Record<string, number> = {};

    (transactions || []).forEach((t: any) => {
      const amt = Number(t.amount || 0);
      const tDate = t.transaction_date;

      if (tDate >= date7DaysAgo) {
        expenseThisWeek += amt;
        const catName = t.categories?.name || "Lainnya";
        categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;
      } else {
        expenseLastWeek += amt;
      }
    });

    let topCatName = "";
    let topCatAmt = 0;
    Object.entries(categoryTotals).forEach(([name, amt]) => {
      if (amt > topCatAmt) {
        topCatAmt = amt;
        topCatName = name;
      }
    });

    let velocityPercentage = 0;
    if (expenseLastWeek > 0) {
      velocityPercentage = Math.round(
        ((expenseThisWeek - expenseLastWeek) / expenseLastWeek) * 100
      );
    }

    const tips = [
      topCatName
        ? `Pengeluaran terbesar 7 hari ini berada pada pos "${topCatName}". Coba tetapkan batas harian untuk menjaga laju anggaran.`
        : "Pertahankan pencatatan struk harian agar evaluasi mingguan tetap akurat.",
      velocityPercentage > 0
        ? `Laju belanja mingguan Anda naik +${velocityPercentage}% dibanding pekan lalu. Prioritaskan kebutuhan pokok.`
        : "Bagus! Pengeluaran pekan ini lebih hemat dibanding pekan lalu. Alokasikan selisihnya ke Dana Darurat.",
      "Gunakan fitur pembayaran cicilan & pengingat WhatsApp agar tidak terkena denda keterlambatan.",
    ];

    const digest: WeeklyDigestData = {
      weekLabel: `7 Hari Terakhir (${date7DaysAgo} s/d ${dateToday})`,
      totalExpenseThisWeek: expenseThisWeek,
      totalExpenseLastWeek: expenseLastWeek,
      velocityPercentage,
      topExpenseCategory: topCatName ? { name: topCatName, amount: topCatAmt } : null,
      tips,
      summary:
        velocityPercentage <= 0
          ? `Performa finansial minggu ini sangat terkendali! Pengeluaran Anda berada di Rp ${expenseThisWeek.toLocaleString("id-ID")}.`
          : `Pengeluaran minggu ini mencapai Rp ${expenseThisWeek.toLocaleString("id-ID")} (naik ${velocityPercentage}%).`,
    };

    return { success: true, data: digest };
  } catch {
    return {
      success: false,
      data: null,
    };
  }
}
