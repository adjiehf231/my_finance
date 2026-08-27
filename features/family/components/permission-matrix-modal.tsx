"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Check,
  X,
  Settings2,
  RotateCcw,
  Save,
  Loader2,
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  DEFAULT_ROLE_PERMISSIONS,
  type FamilyPermissionsConfig,
  type RolePermissions,
  type CrudPermission,
  type FamilyRole,
} from "@/lib/auth/rbac";
import { updateFamilyPermissionsAction } from "../actions/family-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface PermissionMatrixModalProps {
  familyId: string;
  currentUserRole: FamilyRole;
  initialPermissions?: FamilyPermissionsConfig | null;
  triggerButton?: React.ReactNode;
}

export function PermissionMatrixModal({
  familyId,
  currentUserRole,
  initialPermissions,
  triggerButton,
}: PermissionMatrixModalProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMobileViewRole, setSelectedMobileViewRole] = useState<"owner" | "admin" | "member" | "viewer">("owner");
  const [permissions, setPermissions] = useState<FamilyPermissionsConfig>(
    initialPermissions || DEFAULT_ROLE_PERMISSIONS
  );
  const { t, locale } = useTranslation();

  const isOwner = currentUserRole === "owner";

  const handleToggleCrud = (
    role: "admin" | "member" | "viewer",
    moduleKey: keyof Omit<RolePermissions, "receiptOcr" | "exportData" | "inviteMembers" | "editFamily">,
    action: keyof CrudPermission
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [moduleKey]: {
          ...prev[role][moduleKey],
          [action]: !prev[role][moduleKey][action],
        },
      },
    }));
  };

  const handleToggleFeature = (
    role: "admin" | "member" | "viewer",
    featureKey: "receiptOcr" | "exportData" | "inviteMembers" | "editFamily"
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [featureKey]: !prev[role][featureKey],
      },
    }));
  };

  const handleResetDefaults = () => {
    setPermissions(DEFAULT_ROLE_PERMISSIONS);
    toast.info(locale === "en" ? "Permissions reset to system defaults" : "Konfigurasi di-reset ke standar sistem");
  };

  const handleSavePermissions = async () => {
    try {
      setIsSaving(true);
      const res = await updateFamilyPermissionsAction(familyId, permissions);

      if (res.success) {
        toast.success(
          locale === "en"
            ? "Role & CRUD permissions configured successfully!"
            : "Matriks perizinan dan kontrol CRUD berhasil disimpan!"
        );
        setIsEditing(false);
      } else {
        toast.error(res.error || "Gagal menyimpan konfigurasi");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSaving(false);
    }
  };

  const modulesList: Array<{
    key: keyof Omit<RolePermissions, "receiptOcr" | "exportData" | "inviteMembers" | "editFamily">;
    label: string;
  }> = [
    { key: "transactions", label: locale === "en" ? "Transactions Ledger" : "Buku Kas & Transaksi" },
    { key: "wallets", label: locale === "en" ? "Wallets & Accounts" : "Rekening & Dompet" },
    { key: "budgets", label: locale === "en" ? "Monthly Budgets" : "Anggaran Bulanan" },
    { key: "goals", label: locale === "en" ? "Savings Goals" : "Target Tabungan (Goals)" },
    { key: "debts", label: locale === "en" ? "Debts & Receivables" : "Hutang & Piutang" },
  ];

  const featuresList: Array<{
    key: "receiptOcr" | "exportData" | "inviteMembers" | "editFamily";
    label: string;
  }> = [
    { key: "receiptOcr", label: locale === "en" ? "AI Vision Receipt OCR" : "Scan Struk Belanja AI Vision" },
    { key: "exportData", label: locale === "en" ? "Export CSV & JSON Takeout" : "Ekspor Data CSV / JSON" },
    { key: "inviteMembers", label: locale === "en" ? "Invite & Remove Members" : "Undang & Keluarkan Anggota" },
    { key: "editFamily", label: locale === "en" ? "Edit Family Workspace Name" : "Ubah Nama Ruang Kerja" },
  ];

  // Helper for Mobile Role Capabilities Check
  const getRoleCrud = (role: "owner" | "admin" | "member" | "viewer", key: keyof Omit<RolePermissions, "receiptOcr" | "exportData" | "inviteMembers" | "editFamily">): CrudPermission => {
    if (role === "owner") return { create: true, read: true, update: true, delete: true };
    return permissions[role][key];
  };

  const getRoleFeature = (role: "owner" | "admin" | "member" | "viewer", key: "receiptOcr" | "exportData" | "inviteMembers" | "editFamily" | "deleteFamily"): boolean => {
    if (role === "owner") return true;
    if (key === "deleteFamily") return false;
    return permissions[role][key];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-xs font-bold gap-1.5 text-slate-700 dark:text-slate-200 w-full sm:w-auto h-9"
          >
            <Shield className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{t("familyManagement.permissionMatrixBtn")}</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-24px)] sm:max-w-2xl rounded-3xl p-4 sm:p-6 max-h-[88vh] overflow-y-auto">
        <DialogHeader className="pr-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="leading-tight">
                {isEditing
                  ? (locale === "en" ? "Configure Role & CRUD" : "Konfigurasi Hak Akses & CRUD")
                  : t("familyManagement.matrixTitle")}
              </span>
            </DialogTitle>

            {isOwner && !isEditing && (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 h-8 px-3 self-start sm:self-auto shrink-0 shadow-sm"
              >
                <Settings2 className="h-3.5 w-3.5" />
                {locale === "en" ? "Configure (Owner)" : "Konfigurasi (Owner)"}
              </Button>
            )}
          </div>
        </DialogHeader>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
          {isEditing
            ? (locale === "en"
              ? "Toggle active/inactive access and granular CRUD permissions for each role."
              : "Atur aktif/non-aktif hak akses dan operasi CRUD (Create, Read, Update, Delete) untuk setiap peran.")
            : t("familyManagement.matrixDesc")}
        </p>

        {/* VIEW MODE: Read-Only */}
        {!isEditing ? (
          <div className="space-y-4 pt-1">
            {/* --- MOBILE VIEW (Segmented Role Tabs + Card List) --- */}
            <div className="block sm:hidden space-y-3">
              {/* Role Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-2xl">
                {(["owner", "admin", "member", "viewer"] as const).map((r) => {
                  const active = selectedMobileViewRole === r;
                  const labels: Record<string, string> = {
                    owner: "Owner",
                    admin: "Admin",
                    member: "Member",
                    viewer: "Viewer",
                  };
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedMobileViewRole(r)}
                      className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                        active
                          ? "bg-white dark:bg-[#0E131F] text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {labels[r]}
                    </button>
                  );
                })}
              </div>

              {/* Role Header Info */}
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-[#07090E]/80 border border-slate-200/70 dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    {selectedMobileViewRole === "owner" && "Pemilik (Owner)"}
                    {selectedMobileViewRole === "admin" && "Administrator"}
                    {selectedMobileViewRole === "member" && "Anggota (Member)"}
                    {selectedMobileViewRole === "viewer" && "Peninjau (Viewer)"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {selectedMobileViewRole === "owner" && "Akses penuh tanpa batas (Terkunci)"}
                    {selectedMobileViewRole === "admin" && "Dapat dikonfigurasi oleh Owner"}
                    {selectedMobileViewRole === "member" && "Dapat dikonfigurasi oleh Owner"}
                    {selectedMobileViewRole === "viewer" && "Dapat dikonfigurasi oleh Owner"}
                  </span>
                </div>
                {selectedMobileViewRole === "owner" && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-500/20 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Full
                  </span>
                )}
              </div>

              {/* Modules CRUD Card List for Mobile */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display block px-1">
                  {locale === "en" ? "Module CRUD Access" : "Akses CRUD per Modul"}
                </span>

                {modulesList.map((m) => {
                  const crud = getRoleCrud(selectedMobileViewRole, m.key);
                  return (
                    <div
                      key={m.key}
                      className="p-3 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-2 shadow-sm"
                    >
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {m.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {(["create", "read", "update", "delete"] as const).map((action) => {
                          const active = crud[action];
                          const shortLabels: Record<string, string> = {
                            create: "C",
                            read: "R",
                            update: "U",
                            delete: "D",
                          };
                          return (
                            <span
                              key={action}
                              className={`h-6 w-6 rounded-lg text-[10px] font-black flex items-center justify-center border ${
                                active
                                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                  : "bg-slate-100 dark:bg-white/[0.04] text-slate-300 dark:text-slate-600 border-slate-200/50 dark:border-white/[0.04]"
                              }`}
                              title={`${shortLabels[action]}: ${active ? "Aktif" : "Non-Aktif"}`}
                            >
                              {shortLabels[action]}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Features Card List for Mobile */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display block px-1">
                  {locale === "en" ? "Feature Access" : "Akses Fitur Khusus"}
                </span>

                {featuresList.map((f) => {
                  const active = getRoleFeature(selectedMobileViewRole, f.key);
                  return (
                    <div
                      key={f.key}
                      className="p-2.5 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-2 shadow-sm"
                    >
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {f.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        active
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-100 dark:bg-white/[0.04] text-slate-400 border border-slate-200/60 dark:border-white/[0.06]"
                      }`}>
                        {active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {active ? "Aktif" : "Non-Aktif"}
                      </span>
                    </div>
                  );
                })}

                {/* Workspace Deletion Row for Mobile */}
                <div className="p-2.5 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between gap-2 shadow-sm">
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                    {locale === "en" ? "Delete Family Workspace" : "Hapus Ruang Kerja Keluarga"}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    selectedMobileViewRole === "owner"
                      ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      : "bg-slate-100 dark:bg-white/[0.04] text-slate-400 border border-slate-200/60 dark:border-white/[0.06]"
                  }`}>
                    {selectedMobileViewRole === "owner" ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {selectedMobileViewRole === "owner" ? "Owner Only" : "Non-Aktif"}
                  </span>
                </div>
              </div>
            </div>

            {/* --- DESKTOP VIEW (Comparative Table) --- */}
            <div className="hidden sm:block space-y-4">
              {/* Roles Badges */}
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-500/20 text-center">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">{t("familyManagement.roleOwner")}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Full Access" : "Akses Penuh"}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/20 text-center">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">{t("familyManagement.roleAdmin")}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Custom" : "Kustom"}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/20 text-center">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">{t("familyManagement.roleMember")}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Custom" : "Kustom"}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-center">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">{t("familyManagement.roleViewer")}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Custom" : "Kustom"}</span>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-[#07090E] border-b border-slate-200/80 dark:border-white/[0.08] text-[11px] font-bold text-slate-500">
                    <tr>
                      <th className="p-3 font-semibold">{locale === "en" ? "Capability / Module" : "Modul & Wewenang"}</th>
                      <th className="p-3 text-center text-blue-600 font-bold">Owner</th>
                      <th className="p-3 text-center text-indigo-600 font-bold">Admin</th>
                      <th className="p-3 text-center text-emerald-600 font-bold">Member</th>
                      <th className="p-3 text-center text-slate-400 font-bold">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] font-medium">
                    {modulesList.map((m) => (
                      <tr key={m.key} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 text-slate-800 dark:text-slate-200 font-bold">
                          {m.label}
                          <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                            CRUD (Buat, Lihat, Edit, Hapus)
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                            CRUD
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            permissions.admin[m.key].create && permissions.admin[m.key].delete
                              ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50"
                              : "text-slate-500 bg-slate-100 dark:bg-white/[0.04]"
                          }`}>
                            {[
                              permissions.admin[m.key].create ? "C" : "",
                              permissions.admin[m.key].read ? "R" : "",
                              permissions.admin[m.key].update ? "U" : "",
                              permissions.admin[m.key].delete ? "D" : "",
                            ].filter(Boolean).join("") || "-"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            permissions.member[m.key].create
                              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"
                              : "text-slate-500 bg-slate-100 dark:bg-white/[0.04]"
                          }`}>
                            {[
                              permissions.member[m.key].create ? "C" : "",
                              permissions.member[m.key].read ? "R" : "",
                              permissions.member[m.key].update ? "U" : "",
                              permissions.member[m.key].delete ? "D" : "",
                            ].filter(Boolean).join("") || "-"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                            {[
                              permissions.viewer[m.key].create ? "C" : "",
                              permissions.viewer[m.key].read ? "R" : "",
                              permissions.viewer[m.key].update ? "U" : "",
                              permissions.viewer[m.key].delete ? "D" : "",
                            ].filter(Boolean).join("") || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Feature Toggles */}
                    {featuresList.map((f) => (
                      <tr key={f.key} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 text-slate-800 dark:text-slate-200">{f.label}</td>
                        <td className="p-3 text-center"><Check className="h-4 w-4 text-blue-500 mx-auto" /></td>
                        <td className="p-3 text-center">
                          {permissions.admin[f.key] ? <Check className="h-4 w-4 text-indigo-500 mx-auto" /> : <X className="h-4 w-4 text-slate-400 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {permissions.member[f.key] ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-slate-400 mx-auto" />}
                        </td>
                        <td className="p-3 text-center">
                          {permissions.viewer[f.key] ? <Check className="h-4 w-4 text-slate-500 mx-auto" /> : <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />}
                        </td>
                      </tr>
                    ))}

                    {/* Permanent Delete Workspace Row */}
                    <tr className="hover:bg-rose-50/20 dark:hover:bg-rose-950/10 transition-colors">
                      <td className="p-3 text-rose-600 dark:text-rose-400 font-bold">
                        {locale === "en" ? "Delete Family Workspace Permanently" : "Hapus Ruang Kerja Keluarga Permanen"}
                      </td>
                      <td className="p-3 text-center"><Check className="h-4 w-4 text-rose-500 mx-auto" /></td>
                      <td className="p-3 text-center"><X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" /></td>
                      <td className="p-3 text-center"><X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" /></td>
                      <td className="p-3 text-center"><X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE: Owner Configurator */
          <div className="space-y-4 pt-1">
            <Tabs defaultValue="member" className="w-full">
              <TabsList className="grid grid-cols-3 rounded-2xl h-10 p-1 bg-slate-100 dark:bg-white/[0.04]">
                <TabsTrigger value="admin" className="rounded-xl text-[11px] sm:text-xs font-bold gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F] text-indigo-600 truncate">
                  {t("familyManagement.roleAdmin")}
                </TabsTrigger>
                <TabsTrigger value="member" className="rounded-xl text-[11px] sm:text-xs font-bold gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F] text-emerald-600 truncate">
                  {t("familyManagement.roleMember")}
                </TabsTrigger>
                <TabsTrigger value="viewer" className="rounded-xl text-[11px] sm:text-xs font-bold gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F] text-slate-600 truncate">
                  {t("familyManagement.roleViewer")}
                </TabsTrigger>
              </TabsList>

              {(["admin", "member", "viewer"] as const).map((role) => (
                <TabsContent key={role} value={role} className="space-y-3 pt-2">
                  {/* CRUD Modules Header */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] p-3 sm:p-4 bg-slate-50/50 dark:bg-[#07090E]/50 space-y-2.5">
                    <span className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-display block">
                      {locale === "en" ? "Granular CRUD Operations" : "Operasi CRUD per Modul"}
                    </span>

                    <div className="space-y-2">
                      {modulesList.map((m) => {
                        const crud = permissions[role][m.key];
                        return (
                          <div
                            key={m.key}
                            className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200/70 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {m.label}
                            </span>
                            <div className="grid grid-cols-4 sm:flex items-center gap-1">
                              {(["create", "read", "update", "delete"] as const).map((action) => {
                                const active = crud[action];
                                const labels: Record<string, string> = {
                                  create: "Buat (C)",
                                  read: "Lihat (R)",
                                  update: "Ubah (U)",
                                  delete: "Hapus (D)",
                                };
                                return (
                                  <button
                                    key={action}
                                    type="button"
                                    onClick={() => handleToggleCrud(role, m.key, action)}
                                    className={`h-8 px-2 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border text-center ${
                                      active
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-slate-100 dark:bg-white/[0.04] text-slate-400 border-slate-200/60 dark:border-white/[0.06] hover:bg-slate-200"
                                    }`}
                                  >
                                    {labels[action]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] p-3 sm:p-4 bg-slate-50/50 dark:bg-[#07090E]/50 space-y-2.5">
                    <span className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-display block">
                      {locale === "en" ? "Special Feature Access" : "Akses Fitur Khusus"}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {featuresList.map((f) => {
                        const active = permissions[role][f.key];
                        return (
                          <button
                            key={f.key}
                            type="button"
                            onClick={() => handleToggleFeature(role, f.key)}
                            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                              active
                                ? "bg-blue-50/80 dark:bg-blue-950/30 border-blue-500 text-blue-900 dark:text-blue-200 font-bold"
                                : "bg-white dark:bg-[#0E131F] border-slate-200/80 dark:border-white/[0.06] text-slate-500 font-medium"
                            }`}
                          >
                            <span className="text-xs">{f.label}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${active ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-white/[0.08] text-slate-400"}`}>
                              {active ? "AKTIF" : "NON-AKTIF"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Bottom Actions Sticky */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none rounded-2xl text-xs font-bold h-9"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  {locale === "en" ? "Back" : "Kembali"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetDefaults}
                  className="flex-1 sm:flex-none rounded-2xl text-xs font-bold gap-1.5 h-9"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {locale === "en" ? "Reset" : "Reset Standar"}
                </Button>
              </div>

              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSavePermissions}
                className="w-full sm:w-auto rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 h-9 gap-1.5 shadow-md shadow-blue-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    {locale === "en" ? "Saving..." : "Menyimpan..."}
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    {locale === "en" ? "Save Permissions" : "Simpan Hak Akses"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
