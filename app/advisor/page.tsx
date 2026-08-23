import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getFinancialHealthAdviceAction } from "@/features/ai/actions/ai-actions";
import { AIAdvisorCard } from "@/features/ai/components/ai-advisor-card";
import { ReceiptScannerModal } from "@/features/ai/components/receipt-scanner-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Scan, Bot } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Financial Health Advisor",
  description: "Penasihat finansial cerdas berbasis Google Gemini 1.5 Flash untuk keluarga.",
};

export default async function AdvisorPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const [walletsRes, categoriesRes, adviceRes] = await Promise.all([
    getWalletsAction(family.id),
    getCategoriesAction(family.id),
    getFinancialHealthAdviceAction(family.id),
  ]);

  const wallets = walletsRes.data || [];
  const categories = categoriesRes.data || [];
  const advice = adviceRes.data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                AI Financial Advisor
                <Sparkles className="h-5 w-5 text-amber-500" />
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluasi Kesehatan Finansial & Rekomendasi Pintar Keluarga {family.name}
              </p>
            </div>
          </div>

          <ReceiptScannerModal
            familyId={family.id}
            wallets={wallets}
            categories={categories}
          />
        </div>

        {/* AI Advisor Evaluation Card */}
        {advice && <AIAdvisorCard advice={advice} />}
      </div>
    </div>
  );
}
