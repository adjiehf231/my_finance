import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction, getFamilyMembersAction } from "@/features/family/actions/family-actions";
import { MemberListCard } from "@/features/family/components/member-list-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
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
      </div>
    </div>
  );
}
