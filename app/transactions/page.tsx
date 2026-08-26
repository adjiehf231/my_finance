import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getTransactionsAction } from "@/features/transactions/actions/transaction-actions";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { TransactionTable } from "@/features/transactions/components/transaction-table";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Riwayat Transaksi Finansial",
  description: "Daftar histori mutasi pemasukan, pengeluaran, dan transfer keluarga.",
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    walletId?: string;
    categoryId?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const familyRes = await getCurrentFamilyAction();

  if (!familyRes.success || !familyRes.data?.family) {
    redirect("/onboarding");
  }

  const family = familyRes.data.family;
  const [walletsRes, categoriesRes, transactionsRes] = await Promise.all([
    getWalletsAction(family.id),
    getCategoriesAction(family.id),
    getTransactionsAction({
      familyId: family.id,
      type: params.type && params.type !== "all" ? (params.type as any) : undefined,
      walletId: params.walletId && params.walletId !== "all" ? params.walletId : undefined,
      categoryId: params.categoryId && params.categoryId !== "all" ? params.categoryId : undefined,
      search: params.search,
      limit: 100,
      offset: 0,
    }),
  ]);

  const wallets = walletsRes.data || [];
  const categories = categoriesRes.data || [];
  const transactions = transactionsRes.data || [];

  return (
    <AppLayout>
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Riwayat Transaksi
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Keluarga: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{family.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/categories">
            <Button variant="outline" className="rounded-2xl">
              Kelola Kategori
            </Button>
          </Link>
          <AddTransactionModal
            familyId={family.id}
            wallets={wallets}
            categories={categories}
          />
        </div>
      </div>

      {/* Transactions Table & Ledger */}
      <TransactionTable transactions={transactions} categories={categories} />
    </AppLayout>
  );
}
