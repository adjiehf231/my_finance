export type FamilyRole = "owner" | "admin" | "member" | "viewer";

export interface RoleDefinition {
  role: FamilyRole;
  label: string;
  description: string;
  badgeClass: string;
}

export const ROLE_DEFINITIONS: Record<FamilyRole, RoleDefinition> = {
  owner: {
    role: "owner",
    label: "Pemilik (Owner)",
    description: "Akses penuh tanpa batas, kelola anggota, tagihan, dan hapus keluarga",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  admin: {
    role: "admin",
    label: "Administrator",
    description: "Kelola anggota, buat/ubah/hapus seluruh mutasi kas, anggaran, dan dompet",
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  member: {
    role: "member",
    label: "Anggota (Member)",
    description: "Catat transaksi pemasukan/pengeluaran, kelola hutang dan target pribadi",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  viewer: {
    role: "viewer",
    label: "Peninjau (Viewer)",
    description: "Hanya dapat melihat ringkasan, laporan, grafik, dan riwayat transaksi",
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
  },
};

export function canManageFamily(role?: string | null): boolean {
  return role === "owner";
}

export function canManageMembers(role?: string | null): boolean {
  return role === "owner" || role === "admin";
}

export function canMutateFinances(role?: string | null): boolean {
  return role === "owner" || role === "admin" || role === "member";
}

export function canViewFinances(role?: string | null): boolean {
  return role === "owner" || role === "admin" || role === "member" || role === "viewer";
}

export function canDeleteFamily(role?: string | null): boolean {
  return role === "owner";
}
