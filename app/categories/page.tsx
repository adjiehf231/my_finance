import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { AddCategoryModal } from "@/features/categories/components/add-category-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, ShieldCheck } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/transactions">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
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
              <Card
                key={cat.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-4 shadow-sm"
              >
                <CardContent className="p-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color || "#EF4444" }}
                    >
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-400">Pengeluaran</p>
                    </div>
                  </div>

                  {cat.is_default && (
                    <Badge variant="secondary" className="text-[10px] flex items-center gap-1 font-normal">
                      <ShieldCheck className="h-3 w-3 text-slate-400" /> Default
                    </Badge>
                  )}
                </CardContent>
              </Card>
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
              <Card
                key={cat.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-4 shadow-sm"
              >
                <CardContent className="p-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color || "#10B981" }}
                    >
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-400">Pemasukan</p>
                    </div>
                  </div>

                  {cat.is_default && (
                    <Badge variant="secondary" className="text-[10px] flex items-center gap-1 font-normal">
                      <ShieldCheck className="h-3 w-3 text-slate-400" /> Default
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
