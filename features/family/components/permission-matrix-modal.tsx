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
  Layers,
  ArrowLeft,
  Sparkles,
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
      <DialogContent className="sm:max-w-2xl rounded-3xl p-6 max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              {isEditing
                ? (locale === "en" ? "Configure Role & CRUD Permissions" : "Konfigurasi Hak Akses & Kontrol CRUD")
                : t("familyManagement.matrixTitle")}
            </DialogTitle>

            {isOwner && !isEditing && (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-1.5 h-8 px-3.5"
              >
                <Settings2 className="h-3.5 w-3.5" />
                {locale === "en" ? "Configure (Owner)" : "Konfigurasi (Owner)"}
              </Button>
            )}
          </div>
        </DialogHeader>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed -mt-2">
          {isEditing
            ? (locale === "en"
              ? "As Owner, toggle active/inactive access and granular CRUD permissions for each role."
              : "Sebagai Pemilik (Owner), Anda dapat mengatur aktif/non-aktif hak akses dan operasi CRUD (Create, Read, Update, Delete) untuk setiap peran.")
            : t("familyManagement.matrixDesc")}
        </p>

        {/* VIEW MODE: Read-Only Comparison Matrix */}
        {!isEditing ? (
          <div className="space-y-4 pt-2">
            {/* Roles Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-500/20 text-center">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">{t("familyManagement.roleOwner")}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Full Access (Locked)" : "Akses Penuh (Kunci)"}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/20 text-center">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">{t("familyManagement.roleAdmin")}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Configurable" : "Dapat Diatur"}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/20 text-center">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">{t("familyManagement.roleMember")}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Configurable" : "Dapat Diatur"}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-center">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">{t("familyManagement.roleViewer")}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{locale === "en" ? "Configurable" : "Dapat Diatur"}</span>
              </div>
            </div>

            {/* Matrix Table */}
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
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* EDIT MODE: Owner Configurator */
          <div className="space-y-4 pt-2">
            <Tabs defaultValue="member" className="w-full">
              <TabsList className="grid grid-cols-3 rounded-2xl h-10 p-1 bg-slate-100 dark:bg-white/[0.04]">
                <TabsTrigger value="admin" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F] text-indigo-600">
                  {t("familyManagement.roleAdmin")}
                </TabsTrigger>
                <TabsTrigger value="member" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F] text-emerald-600">
                  {t("familyManagement.roleMember")}
                </TabsTrigger>
                <TabsTrigger value="viewer" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F] text-slate-600">
                  {t("familyManagement.roleViewer")}
                </TabsTrigger>
              </TabsList>

              {(["admin", "member", "viewer"] as const).map((role) => (
                <TabsContent key={role} value={role} className="space-y-4 pt-3">
                  {/* CRUD Modules Header */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] p-4 bg-slate-50/50 dark:bg-[#07090E]/50 space-y-3">
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-display block">
                      {locale === "en" ? "Granular CRUD Operations" : "Operasi CRUD per Modul"}
                    </span>

                    <div className="space-y-2.5">
                      {modulesList.map((m) => {
                        const crud = permissions[role][m.key];
                        return (
                          <div
                            key={m.key}
                            className="p-3 rounded-xl bg-white dark:bg-[#0E131F] border border-slate-200/70 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {m.label}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {(["create", "read", "update", "delete"] as const).map((action) => {
                                const active = crud[action];
                                const labels: Record<string, string> = {
                                  create: locale === "en" ? "Create (C)" : "Buat (C)",
                                  read: locale === "en" ? "Read (R)" : "Lihat (R)",
                                  update: locale === "en" ? "Edit (U)" : "Ubah (U)",
                                  delete: locale === "en" ? "Delete (D)" : "Hapus (D)",
                                };
                                return (
                                  <button
                                    key={action}
                                    type="button"
                                    onClick={() => handleToggleCrud(role, m.key, action)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
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
                  <div className="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] p-4 bg-slate-50/50 dark:bg-[#07090E]/50 space-y-3">
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-display block">
                      {locale === "en" ? "Special Feature Access" : "Akses Fitur Khusus"}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {featuresList.map((f) => {
                        const active = permissions[role][f.key];
                        return (
                          <button
                            key={f.key}
                            type="button"
                            onClick={() => handleToggleFeature(role, f.key)}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
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

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="rounded-2xl text-xs font-bold"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  {locale === "en" ? "Back to Overview" : "Kembali ke Ringkasan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetDefaults}
                  className="rounded-2xl text-xs font-bold gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {locale === "en" ? "Reset Defaults" : "Reset Standar"}
                </Button>
              </div>

              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSavePermissions}
                className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 gap-1.5 shadow-md shadow-blue-500/20"
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
