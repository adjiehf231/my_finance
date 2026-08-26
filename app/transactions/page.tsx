import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getTransactionsAction } from "@/features/transactions/actions/transaction-actions";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { TransactionTable } from "@/features/transactions/components/transaction-table";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowRightLeft, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      {/* FinTech Page Header */}
      <PageHeader
        titleKey="transactions.title"
        subtitleKey="transactions.subtitle"
        icon={ArrowRightLeft}
        familyName={family.name}
      >
        <Link href="/categories">
          <Button variant="outline" className="rounded-2xl border-slate-200/80 dark:border-white/[0.1] text-xs font-bold gap-1.5 bg-white/50 dark:bg-white/[0.03]">
            <Tags className="h-3.5 w-3.5 text-emerald-500" />
            <span>Kategori</span>
          </Button>
        </Link>
        <AddTransactionModal
          familyId={family.id}
          wallets={wallets}
          categories={categories}
        />
      </PageHeader>

      {/* Transactions Table & Ledger */}
      <TransactionTable transactions={transactions} categories={categories} />
    </AppLayout>
  );
}
