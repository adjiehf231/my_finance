import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { ExportModal } from "@/features/export/components/export-modal";
import { RestoreModal } from "@/features/export/components/restore-modal";
import { RefreshDataCard } from "@/features/export/components/refresh-data-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import {
  Settings,
  ShieldCheck,
  Download,
  Globe,
  SunMoon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pengaturan & Keamanan",
  description: "Pusat pengaturan keamanan, preferensi bahasa, privasi data UU PDP, dan ekspor laporan.",
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
        icon={Settings}
        familyName={family.name}
      />

      {/* Section 0: Sinkronisasi & Refresh Cache */}
      <RefreshDataCard />

      {/* Section 1: Preferensi Bahasa & Tampilan */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          Preferensi & Antarmuka
        </h3>
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm divide-y divide-slate-100 dark:divide-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Bahasa Tampilan (Display Language)
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Pilih antara Bahasa Indonesia (🇮🇩 ID) atau English (🇬🇧 EN).
              </p>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SunMoon className="h-4 w-4 text-amber-500" />
                Tema Tampilan
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Pilih mode Gelap (Dark Mode), Terang (Light Mode), atau Sistem.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Section 2: Ekspor & Data Backup / Restore */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          Pusat Data & Cadangan
        </h3>
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Ekspor & Pemulihan Cadangan Data
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-medium">
                Unduh mutasi transaksi dalam format CSV (Excel), ekspor cadangan data keluarga utuh (JSON), atau pulihkan data dari file backup.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RestoreModal familyId={family.id} />
              <ExportModal familyId={family.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Keamanan & Privasi Data (UU PDP) */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
          Kepatuhan & Privasi Data
        </h3>
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Kepatuhan UU No. 27 Tahun 2022 (UU PDP)
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Data transaksi Anda dilindungi dengan Row Level Security (RLS) PostgreSQL & enkripsi AES-256.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
              Terproteksi
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
