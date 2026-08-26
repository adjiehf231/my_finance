import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { ExportModal } from "@/features/export/components/export-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Settings,
  ShieldCheck,
  Download,
  Lock,
  Trash2,
  Globe,
  SunMoon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pengaturan & Keamanan",
  description: "Pusat pengaturan keamanan, privasi data UU PDP, dan ekspor laporan.",
};

export default async function SettingsPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="h-7 w-7 text-emerald-600" />
            Pengaturan & Keamanan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Ruang Kerja: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
          </p>
        </div>
      </div>

      {/* Section 1: Ekspor & Data Backup */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Pusat Data & Laporan
        </h3>
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm">
          <CardContent className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="h-5 w-5 text-emerald-600" />
                Ekspor & Cadangan Data
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unduh mutasi transaksi dalam format CSV (Excel) atau cadangan data keluarga utuh (JSON).
              </p>
            </div>
            <ExportModal familyId={family.id} />
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Keamanan & Privasi Data (UU PDP) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Kepatuhan & Privasi Data
        </h3>
        <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-6 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
          <CardContent className="p-0 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Kepatuhan UU No. 27 Tahun 2022 (UU PDP)
              </h4>
              <p className="text-xs text-slate-500">
                Data transaksi Anda dilindungi dengan Row Level Security (RLS) PostgreSQL & enkripsi AES-256.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              Terproteksi
            </span>
          </CardContent>

          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SunMoon className="h-4 w-4 text-amber-500" />
                Tema Tampilan
              </h4>
              <p className="text-xs text-slate-500">
                Pilih mode Gelap (Dark Mode), Terang (Light Mode), atau Sistem.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
