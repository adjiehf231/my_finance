import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getCurrentFamilyAction,
  getFamilyMembersAction,
} from "@/features/family/actions/family-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { MemberListCard } from "@/features/family/components/member-list-card";
import { EditFamilyModal } from "@/features/family/components/edit-family-modal";
import { InviteMemberModal } from "@/features/family/components/invite-member-modal";
import { PermissionMatrixModal } from "@/features/family/components/permission-matrix-modal";
import { DeleteFamilyModal } from "@/features/family/components/delete-family-modal";
import { FamilyStatsCard } from "@/features/family/components/family-stats-card";
import { FamilyRulesCard } from "@/features/family/components/family-rules-card";

export const metadata: Metadata = {
  title: "Family Management & Permissions | My Finance",
  description: "Manage family workspace, member roles, permissions, and invitations.",
};

export default async function FamilyPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const { family, role } = familyRes.data;
  const membersRes = await getFamilyMembersAction(family.id);
  const members = (membersRes.data || []) as any[];

  const isOwner = role === "owner";
  const isManager = role === "owner" || role === "admin";

  const roleCounts = {
    owner: members.filter((m) => m.role === "owner").length,
    admin: members.filter((m) => m.role === "admin").length,
    member: members.filter((m) => m.role === "member" || !m.role).length,
    viewer: members.filter((m) => m.role === "viewer").length,
  };

  return (
    <AppLayout>
      {/* FinTech Page Header with Mobile Responsive Action Grid */}
      <PageHeader
        titleKey="familyManagement.title"
        subtitleKey="familyManagement.subtitle"
        iconName="family"
        familyName={family.name}
      >
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <PermissionMatrixModal
            familyId={family.id}
            currentUserRole={role as any}
            initialPermissions={(family as any).custom_permissions}
          />
          {isManager && (
            <>
              <EditFamilyModal familyId={family.id} currentName={family.name} />
              <InviteMemberModal
                familyId={family.id}
                familyName={family.name}
                inviteCode={family.invite_code}
              />
            </>
          )}
          {isOwner && (
            <DeleteFamilyModal
              familyId={family.id}
              familyName={family.name}
            />
          )}
        </div>
      </PageHeader>

      {/* Section 1: Summary Stats */}
      <FamilyStatsCard
        totalMembers={members.length}
        roleCounts={roleCounts}
        inviteCode={family.invite_code}
      />

      {/* Section 2: Members List & RBAC Control */}
      <MemberListCard
        family={family}
        currentUserRole={role as "owner" | "admin" | "member" | "viewer"}
        members={members}
      />

      {/* Section 3: Shared Financial Guidelines & Rules */}
      <FamilyRulesCard />
    </AppLayout>
  );
}
