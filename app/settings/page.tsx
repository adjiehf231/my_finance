import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { ExportModal } from "@/features/export/components/export-modal";
import { RestoreModal } from "@/features/export/components/restore-modal";
import { RefreshDataCard } from "@/features/export/components/refresh-data-card";
import { SettingsPreferencesSection } from "@/components/layout/settings-preferences-section";
import { SettingsPrivacySection } from "@/components/layout/settings-privacy-section";

export const metadata: Metadata = {
  title: "Settings & Security | My Finance",
  description: "Configure security settings, language preferences, data privacy, and export reports.",
};

export default async function SettingsPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;

  return (
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="settings.title"
        subtitleKey="settings.subtitle"
        iconName="settings"
        familyName={family.name}
      />

      {/* Section 0: Sync & Refresh Cache */}
      <RefreshDataCard />

      {/* Section 1 & 2: Language, Theme, Export — client-rendered for i18n */}
      <SettingsPreferencesSection familyId={family.id} />

      {/* Section 3: Privacy Compliance */}
      <SettingsPrivacySection />
    </AppLayout>
  );
}
