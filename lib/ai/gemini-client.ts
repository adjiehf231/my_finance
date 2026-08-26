import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  type ReceiptOcrResponse,
  type FinancialAdviceResponse,
} from "@/lib/validations/ai";

/**
 * Initialize Google Generative AI client safely
 */
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

/**
 * Helper to strip markdown JSON code fences from Gemini responses
 */
export function extractJsonFromResponse(text: string): any {
  try {
    let clean = text.trim();
    if (clean.startsWith("```json")) {
      clean = clean.substring(7);
    } else if (clean.startsWith("```")) {
      clean = clean.substring(3);
    }
    if (clean.endsWith("```")) {
      clean = clean.substring(0, clean.length - 3);
    }
    return JSON.parse(clean.trim());
  } catch {
    return null;
  }
}

/**
 * Heuristic Local Fallback for Financial Health Scoring
 */
export function calculateLocalFinancialHealth(data: {
  monthlyIncome: number;
  monthlyExpense: number;
  totalDebt: number;
  totalSavings: number;
}): FinancialAdviceResponse {
  const { monthlyIncome, monthlyExpense, totalDebt, totalSavings } = data;

  let score = 70;
  const recommendations: string[] = [];

  // 1. Savings Ratio Check
  const savings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;

  if (savingsRate >= 30) {
    score += 15;
    recommendations.push("Rasio tabungan sangat prima (>30%). Pertahankan konsistensi ini.");
  } else if (savingsRate >= 15) {
    score += 5;
    recommendations.push("Rasio tabungan baik (15-30%). Coba alokasikan bonus ke target impian.");
  } else if (savingsRate > 0) {
    score -= 10;
    recommendations.push("Rasio tabungan di bawah 15%. Evaluasi pos pengeluaran sekunder / gaya hidup.");
  } else {
    score -= 30;
    recommendations.push("Arus kas defisit (pengeluaran > pemasukan). Segera kurangi pengeluaran non-primer.");
  }

  // 2. Debt Burden Check
  if (totalDebt > 0 && monthlyIncome > 0) {
    const debtRatio = (totalDebt / (monthlyIncome * 12)) * 100;
    if (debtRatio > 50) {
      score -= 15;
      recommendations.push("Beban hutang cukup tinggi. Prioritaskan metode *debt snowball* untuk pelunasan pokok.");
    }
  } else {
    score += 10;
  }

  // 3. Emergency Fund Buffer
  const monthlyBuffer = monthlyExpense > 0 ? totalSavings / monthlyExpense : 0;
  if (monthlyBuffer >= 6) {
    score += 5;
    recommendations.push("Dana darurat keluarga aman (>6 bulan biaya hidup).");
  } else {
    recommendations.push("Tingkatkan tabungan dana darurat hingga minimal 3-6 bulan pengeluaran rutin.");
  }

  score = Math.max(10, Math.min(100, score));

  let status: "excellent" | "good" | "fair" | "critical" = "good";
  if (score >= 85) status = "excellent";
  else if (score >= 70) status = "good";
  else if (score >= 50) status = "fair";
  else status = "critical";

  return {
    healthScore: score,
    status,
    summary: `Kondisi kesehatan finansial keluarga Anda saat ini berada di tingkat ${status.toUpperCase()} dengan skor ${score}/100.`,
    recommendations: recommendations.slice(0, 3),
    savingsTip: "Alokasikan tabungan di awal bulan segera setelah gaji masuk dengan sistem auto-debet.",
  };
}
