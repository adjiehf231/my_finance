"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/lib/validations/category";

export interface CategoryItem {
  id: string;
  family_id: string | null;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export const DEFAULT_CATEGORIES_DATA = [
  // Expense
  { name: "Makanan & Minuman", type: "expense" as const, icon: "utensils", color: "#EF4444" },
  { name: "Transportasi", type: "expense" as const, icon: "car", color: "#F97316" },
  { name: "Kebutuhan Rumah Tangga", type: "expense" as const, icon: "home", color: "#F59E0B" },
  { name: "Listrik, Air & Internet", type: "expense" as const, icon: "zap", color: "#EAB308" },
  { name: "Pendidikan Anak", type: "expense" as const, icon: "graduation-cap", color: "#3B82F6" },
  { name: "Kesehatan & Obat", type: "expense" as const, icon: "heart-pulse", color: "#EC4899" },
  { name: "Hiburan & Liburan", type: "expense" as const, icon: "film", color: "#8B5CF6" },
  { name: "Belanja & Pakaian", type: "expense" as const, icon: "shopping-bag", color: "#06B6D4" },
  { name: "Sosial & Sedekah", type: "expense" as const, icon: "hand-heart", color: "#10B981" },
  { name: "Lain-lain", type: "expense" as const, icon: "more-horizontal", color: "#6B7280" },
  // Income
  { name: "Gaji Pokok", type: "income" as const, icon: "briefcase", color: "#10B981" },
  { name: "Bonus & THR", type: "income" as const, icon: "gift", color: "#059669" },
  { name: "Hasil Usaha / Bisnis", type: "income" as const, icon: "store", color: "#047857" },
  { name: "Investasi & Dividen", type: "income" as const, icon: "trending-up", color: "#0D9488" },
  { name: "Freelance & Side Hustle", type: "income" as const, icon: "laptop", color: "#0284C7" },
  { name: "Hadiah & Hibah", type: "income" as const, icon: "sparkles", color: "#6366F1" },
  { name: "Pemasukan Lainnya", type: "income" as const, icon: "plus-circle", color: "#64748B" },
];

/**
 * Get all available categories (System Defaults + Family Custom Categories)
 */
export async function getCategoriesAction(
  familyId?: string,
  type?: "income" | "expense"
) {
  const supabase = await createClient();

  let query = (supabase as any)
    .from("categories")
    .select("*")
    .eq("is_active", true);

  if (familyId) {
    query = query.or(`family_id.is.null,family_id.eq.${familyId}`);
  } else {
    query = query.is("family_id", null);
  }

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query.order("name", { ascending: true });

  // If categories are empty in DB, auto-seed default categories for this family
  if (!error && (!data || data.length === 0) && familyId) {
    const seedRows = DEFAULT_CATEGORIES_DATA.map((cat) => ({
      family_id: familyId,
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      color: cat.color,
      is_default: true,
      is_active: true,
    }));

    const { data: inserted } = await (supabase as any)
      .from("categories")
      .insert(seedRows)
      .select();

    if (inserted && inserted.length > 0) {
      const filtered = type ? inserted.filter((c: any) => c.type === type) : inserted;
      return { success: true, data: filtered as CategoryItem[] };
    }
  }

  if (error) {
    return { success: false, error: error.message, data: [] as CategoryItem[] };
  }

  return { success: true, data: (data || []) as CategoryItem[] };
}

/**
 * Create a new family custom category
 */
export async function createCategoryAction(input: CreateCategoryInput) {
  try {
    const validated = createCategorySchema.parse(input);
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from("categories")
      .insert({
        family_id: validated.familyId || null,
        name: validated.name,
        type: validated.type,
        icon: validated.icon,
        color: validated.color,
        is_default: false,
        is_active: true,
      })
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Gagal membuat kategori" };
    }

    revalidatePath("/categories");
    revalidatePath("/transactions");
    return { success: true, data: data as CategoryItem };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Update category details
 */
export async function updateCategoryAction(input: UpdateCategoryInput) {
  try {
    const validated = updateCategorySchema.parse(input);
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from("categories")
      .update({
        ...(validated.name && { name: validated.name }),
        ...(validated.icon && { icon: validated.icon }),
        ...(validated.color && { color: validated.color }),
      })
      .eq("id", validated.categoryId)
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Gagal memperbarui kategori" };
    }

    revalidatePath("/categories");
    revalidatePath("/transactions");
    return { success: true, data: data as CategoryItem };
  } catch (err: any) {
    return {
      success: false,
      error: err.errors ? err.errors[0].message : err.message || "Terjadi kesalahan",
    };
  }
}

/**
 * Delete / deactivate a custom category
 */
export async function deleteCategoryAction(categoryId: string) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("categories")
    .update({ is_active: false })
    .eq("id", categoryId)
    .eq("is_default", false); // Prevent deleting default system categories

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/transactions");
  return { success: true };
}
