import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getActivityLogsAction } from "@/features/activity/actions/activity-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { ActivityFeed } from "@/features/activity/components/activity-feed";
import { Activity, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Riwayat Aktivitas & Audit Trail",
  description: "Catatan transparan seluruh mutasi dan aktivitas keluarga di My Finance.",
};

export default async function ActivityPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const logsRes = await getActivityLogsAction(family.id, 100, 0);
  const logs = logsRes.data || [];

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity className="h-7 w-7 text-emerald-600" />
              Riwayat Aktivitas Keluarga
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Ruang Kerja: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-white dark:bg-[#131B2E] px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Audit Trail Terenkripsi</span>
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed logs={logs} />
    </AppLayout>
  );
}
