"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createFamilySchema,
  joinFamilySchema,
  updateMemberRoleSchema,
  removeMemberSchema,
  type CreateFamilyInput,
  type JoinFamilyInput,
  type UpdateMemberRoleInput,
  type RemoveMemberInput,
} from "@/lib/validations/family";
import type { FamilyRole } from "@/lib/auth/rbac";

/**
 * Generate a cryptographically strong 6-8 character uppercase alphanumeric invite code
 */
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Omit confusing letters 0, O, 1, I
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get currently active family for the logged-in user
 */
export async function getCurrentFamilyAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthenticated", data: null };
  }

  const { data: memberData, error: memberError } = await (supabase as any)
    .from("family_members")
    .select("family_id, role, families (*)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (memberError || !memberData) {
    return { success: false, data: null, error: "No active family found" };
  }

  return {
    success: true,
    data: {
      family: memberData.families as {
        id: string;
        name: string;
        invite_code: string;
        currency: string;
      },
      role: memberData.role as FamilyRole,
    },
  };
}

/**
 * Create a new family workspace & set creator as Owner
 */
export async function createFamilyAction(input: CreateFamilyInput) {
  try {
    const validated = createFamilySchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus masuk terlebih dahulu" };
    }

    const inviteCode = generateInviteCode();

    // 1. Insert into families table
    const { data: family, error: familyError } = await (supabase as any)
      .from("families")
      .insert({
        name: validated.name,
        invite_code: inviteCode,
        currency: validated.currency,
        created_by: user.id,
      })
      .select()
      .single();

    if (familyError || !family) {
      return {
        success: false,
        error: `Gagal membuat keluarga: ${familyError?.message || "Unknown error"}`,
      };
    }

    // 2. Insert creator as Owner in family_members
    const { error: memberError } = await (supabase as any)
      .from("family_members")
      .insert({
        family_id: family.id,
        user_id: user.id,
        role: "owner",
        is_active: true,
      });

    if (memberError) {
      return {
        success: false,
        error: `Gagal menambahkan pemilik keluarga: ${memberError.message}`,
      };
    }

    // 3. Log activity
    await (supabase as any).from("activity_logs").insert({
      family_id: family.id,
      user_id: user.id,
      action: "create",
      entity: "family",
      entity_id: family.id,
      description: `Ruang kerja keluarga "${family.name}" dibuat oleh pemilik.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/family");
    revalidatePath("/onboarding");

    return { success: true, data: family as { id: string; name: string; invite_code: string } };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Join an existing family workspace using a valid Invite Code
 */
export async function joinFamilyByCodeAction(input: JoinFamilyInput) {
  try {
    const validated = joinFamilySchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Anda harus masuk terlebih dahulu" };
    }

    // 1. Find active family with invite code
    const { data: family, error: familyError } = await (supabase as any)
      .from("families")
      .select("*")
      .eq("invite_code", validated.inviteCode.toUpperCase())
      .eq("status", "active")
      .single();

    if (familyError || !family) {
      return {
        success: false,
        error: "Kode undangan tidak ditemukan atau keluarga sudah tidak aktif.",
      };
    }

    // 2. Check if already a member
    const { data: existingMember } = await (supabase as any)
      .from("family_members")
      .select("id, is_active")
      .eq("family_id", family.id)
      .eq("user_id", user.id)
      .single();

    if (existingMember) {
      if (existingMember.is_active) {
        return { success: true, data: family, message: "Anda sudah menjadi anggota keluarga ini." };
      } else {
        // Reactivate membership
        await (supabase as any)
          .from("family_members")
          .update({ is_active: true })
          .eq("id", existingMember.id);
      }
    } else {
      // 3. Add as Member
      const { error: memberError } = await (supabase as any)
        .from("family_members")
        .insert({
          family_id: family.id,
          user_id: user.id,
          role: "member",
          is_active: true,
        });

      if (memberError) {
        return {
          success: false,
          error: `Gagal bergabung ke keluarga: ${memberError.message}`,
        };
      }
    }

    // 4. Log activity
    await (supabase as any).from("activity_logs").insert({
      family_id: family.id,
      user_id: user.id,
      action: "join",
      entity: "family_member",
      description: `Anggota baru bergabung ke keluarga dengan kode undangan.`,
    });

    revalidatePath("/dashboard");
    revalidatePath("/family");
    revalidatePath("/onboarding");

    return { success: true, data: family as { id: string; name: string; invite_code: string } };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Get all members belonging to a family workspace
 */
export async function getFamilyMembersAction(familyId: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("family_members")
    .select(`
      id,
      role,
      is_active,
      joined_at,
      users:user_id (
        id,
        email,
        full_name,
        avatar_url,
        phone
      )
    `)
    .eq("family_id", familyId)
    .eq("is_active", true)
    .order("joined_at", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Update member role (Owner / Admin authorization required)
 */
export async function updateMemberRoleAction(input: UpdateMemberRoleInput) {
  try {
    const validated = updateMemberRoleSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthenticated" };
    }

    const { error } = await (supabase as any)
      .from("family_members")
      .update({ role: validated.role })
      .eq("family_id", validated.familyId)
      .eq("user_id", validated.userId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Log activity
    await (supabase as any).from("activity_logs").insert({
      family_id: validated.familyId,
      user_id: user.id,
      action: "update",
      entity: "family_member",
      description: `Peran hak akses anggota diubah menjadi "${validated.role}".`,
    });

    revalidatePath("/family");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Remove a member from the family workspace (Owner / Admin required)
 */
export async function removeMemberAction(input: RemoveMemberInput) {
  try {
    const validated = removeMemberSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthenticated" };
    }

    const { error } = await (supabase as any)
      .from("family_members")
      .update({ is_active: false })
      .eq("family_id", validated.familyId)
      .eq("user_id", validated.userId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Log activity
    await (supabase as any).from("activity_logs").insert({
      family_id: validated.familyId,
      user_id: user.id,
      action: "delete",
      entity: "family_member",
      description: `Anggota dinonaktifkan / dikeluarkan dari ruang kerja keluarga.`,
    });

    revalidatePath("/family");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Regenerate family invitation code
 */
export async function regenerateInviteCodeAction(familyId: string) {
  const supabase = await createClient();
  const newCode = generateInviteCode();

  const { data, error } = await (supabase as any)
    .from("families")
    .update({ invite_code: newCode })
    .eq("id", familyId)
    .select("invite_code")
    .single();

  if (error || !data) {
    return { success: false, error: "Gagal memperbarui kode undangan" };
  }

  revalidatePath("/family");
  return { success: true, data: data.invite_code };
}
