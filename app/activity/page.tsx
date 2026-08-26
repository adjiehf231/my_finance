import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getActivityLogsAction } from "@/features/activity/actions/activity-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { ActivityLogView } from "@/features/activity/components/activity-log-view";

export const metadata: Metadata = {
  title: "Log Audit Aktivitas Keluarga",
  description: "Rekam jejak seluruh transaksi, perubahan saldo, dan aktivitas anggota keluarga.",
};

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; entity?: string; search?: string }>;
}) {
  const params = await searchParams;
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;

  const logsRes = await getActivityLogsAction({
    familyId: family.id,
    limit: 50,
    offset: 0,
    action: params.action,
    entity: params.entity,
    search: params.search,
  });

  const logs = logsRes.data || [];
  const totalCount = logsRes.totalCount || 0;

  return (
    <AppLayout>
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="activity.title"
        subtitleKey="activity.subtitle"
        iconName="activity"
        familyName={family.name}
      />

      {/* Activity Log Table & Filters */}
      <ActivityLogView initialLogs={logs} totalCount={totalCount} />
    </AppLayout>
  );
}
