import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { AddWalletModal } from "@/features/wallets/components/add-wallet-modal";
import { WalletsClientSection } from "@/features/wallets/components/wallets-client-section";

export const metadata: Metadata = {
  title: "Wallets & Accounts | My Finance",
  description: "Manage your family bank accounts, e-wallets, cash, and credit cards.",
};

export default async function WalletsPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const walletsRes = await getWalletsAction(family.id);
  const wallets = walletsRes.data || [];
  const totalBalance = walletsRes.totalBalance || 0;

  return (
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="wallets.title"
        subtitleKey="wallets.subtitle"
        iconName="wallets"
        familyName={family.name}
      >
        <AddWalletModal familyId={family.id} />
      </PageHeader>

      {/* Client-rendered sections (need i18n) */}
      <WalletsClientSection
        wallets={wallets}
        totalBalance={totalBalance}
        currency={family.currency || "IDR"}
        familyId={family.id}
      />
    </AppLayout>
  );
}
