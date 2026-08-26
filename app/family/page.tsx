import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction, getFamilyMembersAction } from "@/features/family/actions/family-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { MemberListCard } from "@/features/family/components/member-list-card";

export const metadata: Metadata = {
  title: "Ruang Kerja Keluarga & Anggota",
  description: "Kelola anggota keluarga dan kode undangan My Finance.",
};

export default async function FamilyPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const { family, role } = familyRes.data;
  const membersRes = await getFamilyMembersAction(family.id);
  const members = (membersRes.data || []) as any[];

  return (
    <AppLayout>
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manajemen Keluarga
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Atur hak akses dan undang anggota keluarga ke ruang kerja bersama.
          </p>
        </div>
      </div>

      <MemberListCard
        family={family}
        currentUserRole={role as "owner" | "admin" | "member"}
        members={members}
      />
    </AppLayout>
  );
}
