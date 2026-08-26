import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { AppLayout } from "@/components/layout/app-layout";
import { AddCategoryModal } from "@/features/categories/components/add-category-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, ShieldCheck } from "lucide-react";

import { CategoryCard } from "@/features/categories/components/category-card";

export const metadata: Metadata = {
  title: "Kelola Kategori Keuangan",
  description: "Daftar kategori pengeluaran dan pemasukan keluarga.",
};

export default async function CategoriesPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const categoriesRes = await getCategoriesAction(family.id);
  const categories = categoriesRes.data || [];

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <AppLayout>
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kategori Keuangan
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
            </p>
          </div>
        </div>

        <AddCategoryModal familyId={family.id} />
      </div>

      {/* Expense Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            Kategori Pengeluaran ({expenseCategories.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {expenseCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>

      {/* Income Categories Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            Kategori Pemasukan ({incomeCategories.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {incomeCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
