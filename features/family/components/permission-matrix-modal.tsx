"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Check, X, ShieldAlert } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface PermissionMatrixModalProps {
  triggerButton?: React.ReactNode;
}

export function PermissionMatrixModal({ triggerButton }: PermissionMatrixModalProps) {
  const [open, setOpen] = useState(false);
  const { t, locale } = useTranslation();

  const permissions = [
    {
      feature: locale === "en" ? "Manage Workspace & Family Name" : "Kelola Ruang Kerja & Nama Keluarga",
      owner: true,
      admin: true,
      member: false,
      viewer: false,
    },
    {
      feature: locale === "en" ? "Invite & Remove Members" : "Undang & Keluarkan Anggota",
      owner: true,
      admin: true,
      member: false,
      viewer: false,
    },
    {
      feature: locale === "en" ? "Change Member Permissions (Roles)" : "Ubah Peran Hak Akses Anggota",
      owner: true,
      admin: false,
      member: false,
      viewer: false,
    },
    {
      feature: locale === "en" ? "Add / Edit / Delete Wallets & Accounts" : "Tambah / Edit / Hapus Rekening & Dompet",
      owner: true,
      admin: true,
      member: false,
      viewer: false,
    },
    {
      feature: locale === "en" ? "Record & Edit Transactions (Income/Expense)" : "Catat & Edit Transaksi Pemasukan/Pengeluaran",
      owner: true,
      admin: true,
      member: true,
      viewer: false,
    },
    {
      feature: locale === "en" ? "AI Receipt Scanning (OCR)" : "Scan Struk Belanja dengan AI Vision",
      owner: true,
      admin: true,
      member: true,
      viewer: false,
    },
    {
      feature: locale === "en" ? "Manage Budgets & Savings Goals" : "Kelola Anggaran Bulanan & Target Tabungan",
      owner: true,
      admin: true,
      member: true,
      viewer: false,
    },
    {
      feature: locale === "en" ? "View Financial Reports & Cashflow Charts" : "Lihat Laporan Keuangan & Grafik Arus Kas",
      owner: true,
      admin: true,
      member: true,
      viewer: true,
    },
    {
      feature: locale === "en" ? "Export Data (CSV / JSON Takeout)" : "Ekspor Laporan CSV / JSON Takeout",
      owner: true,
      admin: true,
      member: false,
      viewer: false,
    },
    {
      feature: locale === "en" ? "Delete Entire Family Workspace" : "Hapus Ruang Kerja Keluarga Permanen",
      owner: true,
      admin: false,
      member: false,
      viewer: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-xs font-bold gap-2 text-slate-700 dark:text-slate-200"
          >
            <Shield className="h-3.5 w-3.5 text-indigo-500" />
            {t("familyManagement.permissionMatrixBtn")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            {t("familyManagement.matrixTitle")}
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed -mt-2">
          {t("familyManagement.matrixDesc")}
        </p>

        {/* Roles Badges Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <div className="p-2.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-500/20 text-center">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">{t("familyManagement.roleOwner")}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Full Control" : "Akses Penuh"}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/20 text-center">
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">{t("familyManagement.roleAdmin")}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Operations" : "Operasional"}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/20 text-center">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">{t("familyManagement.roleMember")}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Transactions" : "Pencatatan"}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-center">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">{t("familyManagement.roleViewer")}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Read Only" : "Hanya Lihat"}</span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] overflow-hidden mt-3">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#07090E] border-b border-slate-200/80 dark:border-white/[0.08] text-[11px] font-bold text-slate-500">
              <tr>
                <th className="p-3 font-semibold">{locale === "en" ? "Feature / Capability" : "Fitur & Hak Operasional"}</th>
                <th className="p-3 text-center text-blue-600 font-bold">Owner</th>
                <th className="p-3 text-center text-indigo-600 font-bold">Admin</th>
                <th className="p-3 text-center text-emerald-600 font-bold">Member</th>
                <th className="p-3 text-center text-slate-400 font-bold">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] font-medium">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 text-slate-800 dark:text-slate-200">{p.feature}</td>
                  <td className="p-3 text-center">
                    {p.owner ? <Check className="h-4 w-4 text-blue-500 mx-auto" /> : <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {p.admin ? <Check className="h-4 w-4 text-indigo-500 mx-auto" /> : <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {p.member ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                  </td>
                  <td className="p-3 text-center">
                    {p.viewer ? <Check className="h-4 w-4 text-slate-500 mx-auto" /> : <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
