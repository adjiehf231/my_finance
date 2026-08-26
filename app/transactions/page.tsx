import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentFamilyAction } from "@/features/family/actions/family-actions";
import { getWalletsAction } from "@/features/wallets/actions/wallet-actions";
import { getCategoriesAction } from "@/features/categories/actions/category-actions";
import { getTransactionsAction } from "@/features/transactions/actions/transaction-actions";
import { TransactionsView } from "@/features/transactions/components/transactions-view";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/ui/page-header";

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
    startDate?: string;
    endDate?: string;
    minAmount?: string;
    maxAmount?: string;
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
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      minAmount: params.minAmount ? parseFloat(params.minAmount) : undefined,
      maxAmount: params.maxAmount ? parseFloat(params.maxAmount) : undefined,
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
        iconName="transactions"
        familyName={family.name}
      />

      {/* Transactions View with Interactive Filter Drawer */}
      <TransactionsView
        familyId={family.id}
        transactions={transactions}
        wallets={wallets}
        categories={categories}
        initialFilters={{
          type: params.type as any,
          walletId: params.walletId,
          categoryId: params.categoryId,
          startDate: params.startDate,
          endDate: params.endDate,
          minAmount: params.minAmount ? parseFloat(params.minAmount) : undefined,
          maxAmount: params.maxAmount ? parseFloat(params.maxAmount) : undefined,
          search: params.search,
        }}
      />
    </AppLayout>
  );
}
