import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getFinancialHealthAdviceAction } from "@/features/ai/actions/ai-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { AIAdvisorCard } from "@/features/ai/components/ai-advisor-card";
import { ReceiptScannerModal } from "@/features/ai/components/receipt-scanner-modal";

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
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="ai.advisorTitle"
        subtitleKey="ai.advisorSubtitle"
        iconName="advisor"
        badgeText="AI COPILOT"
        familyName={family.name}
      >
        <ReceiptScannerModal
          familyId={family.id}
          wallets={wallets}
          categories={categories}
        />
      </PageHeader>

      {/* AI Advisor Evaluation Card */}
      {advice && <AIAdvisorCard advice={advice} />}
    </AppLayout>
  );
}
