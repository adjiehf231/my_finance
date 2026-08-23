import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getRecurringTransactionsAction } from "@/features/recurring/actions/recurring-actions";
import { RecurringCard } from "@/features/recurring/components/recurring-card";
import { AddRecurringModal } from "@/features/recurring/components/add-recurring-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Repeat, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transaksi Berulang & Tagihan Rutin",
  description: "Otomatisasi pencatatan tagihan langganan, sewa, listrik, dan gaji rutin keluarga.",
};

export default async function RecurringPage() {
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const [walletsRes, categoriesRes, recurringRes] = await Promise.all([
    getWalletsAction(family.id),
    getCategoriesAction(family.id),
    getRecurringTransactionsAction(family.id),
  ]);

  const wallets = walletsRes.data || [];
  const categories = categoriesRes.data || [];
  const recurringList = recurringRes.data || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Transaksi Berulang & Tagihan
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
              </p>
            </div>
          </div>

          <AddRecurringModal
            familyId={family.id}
            wallets={wallets}
            categories={categories}
          />
        </div>

        {/* Schedules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Jadwal Tagihan Aktif ({recurringList.length})
            </h3>
          </div>

          {recurringList.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 p-12 text-center">
              <CardContent className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
                  <Repeat className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Belum Ada Tagihan Terjadwal
                </h4>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  Jadwalkan tagihan rutin seperti listrik, wifi, langganan streaming, atau gaji bulanan.
                </p>
                <AddRecurringModal
                  familyId={family.id}
                  wallets={wallets}
                  categories={categories}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recurringList.map((rec) => (
                <RecurringCard key={rec.id} recurring={rec} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
