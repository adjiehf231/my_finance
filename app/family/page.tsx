import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction, getFamilyMembersAction } from "@/features/family/actions/family-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { MemberListCard } from "@/features/family/components/member-list-card";
import { EditFamilyModal } from "@/features/family/components/edit-family-modal";

export const metadata: Metadata = {
  title: "Ruang Kerja Keluarga & Anggota",
  description: "Kelola anggota keluarga, ubah nama, dan kode undangan My Finance.",
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
      <PageHeader
        titleKey="familyManagement.title"
        subtitleKey="familyManagement.subtitle"
        iconName="family"
        familyName={family.name}
      >
        {(role === "owner" || role === "admin") && (
          <EditFamilyModal familyId={family.id} currentName={family.name} />
        )}
      </PageHeader>

      <MemberListCard
        family={family}
        currentUserRole={role as "owner" | "admin" | "member"}
        members={members}
      />
    </AppLayout>
  );
}
