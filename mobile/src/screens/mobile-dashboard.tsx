import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  Plus,
  Camera,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react-native";

export interface MobileDashboardProps {
  familyName?: string;
  totalBalance?: number;
  monthlyIncome?: number;
  monthlyExpense?: number;
  netWorth?: number;
  isSyncing?: boolean;
  onAddPress?: () => void;
  onScanPress?: () => void;
  onSyncPress?: () => void;
  recentTransactions?: Array<{
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense" | "transfer";
    date: string;
  }>;
}

export function MobileDashboardScreen({
  familyName = "Keluarga Bahagia",
  totalBalance = 15750000,
  monthlyIncome = 12000000,
  monthlyExpense = 4500000,
  isSyncing = false,
  onAddPress,
  onScanPress,
  onSyncPress,
  recentTransactions = [
    { id: "1", description: "Gaji Bulanan", amount: 12000000, type: "income", date: "25 Agt" },
    { id: "2", description: "Belanja Bulanan Supermarket", amount: 1250000, type: "expense", date: "24 Agt" },
    { id: "3", description: "Kopi & Makan Siang", amount: 45000, type: "expense", date: "23 Agt" },
    { id: "4", description: "Listrik & Internet", amount: 650000, type: "expense", date: "20 Agt" },
  ],
}: MobileDashboardProps) {
  const formatRupiah = (val: number) => {
    return "Rp " + val.toLocaleString("id-ID");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Finance</Text>
            <Text style={styles.headerSubtitle}>{familyName}</Text>
          </View>
          <TouchableOpacity
            style={[styles.syncBadge, isSyncing && styles.syncingBadge]}
            onPress={onSyncPress}
            activeOpacity={0.7}
          >
            <RefreshCw size={12} color={isSyncing ? "#F59E0B" : "#10B981"} />
            <Text style={[styles.syncText, isSyncing && styles.syncingText]}>
              {isSyncing ? "Sinkron..." : "Tersinkron"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>TOTAL SALDO KELUARGA</Text>
            <Wallet size={18} color="#94A3B8" />
          </View>
          <Text style={styles.balanceAmount}>{formatRupiah(totalBalance)}</Text>

          <View style={styles.cashflowRow}>
            <View style={styles.cashflowItem}>
              <View style={styles.cashflowIconWrapper}>
                <TrendingUp size={14} color="#10B981" />
              </View>
              <View>
                <Text style={styles.cashflowLabel}>Pemasukan</Text>
                <Text style={[styles.cashflowValue, { color: "#10B981" }]}>
                  +{formatRupiah(monthlyIncome)}
                </Text>
              </View>
            </View>

            <View style={styles.cashflowItem}>
              <View style={styles.cashflowIconWrapper}>
                <TrendingDown size={14} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.cashflowLabel}>Pengeluaran</Text>
                <Text style={[styles.cashflowValue, { color: "#EF4444" }]}>
                  -{formatRupiah(monthlyExpense)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButtonPrimary} onPress={onAddPress} activeOpacity={0.8}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonPrimaryText}>Catat Transaksi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButtonSecondary} onPress={onScanPress} activeOpacity={0.8}>
            <Camera size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonSecondaryText}>Scan Struk AI</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mutasi Terkini</Text>
          </View>

          <View style={styles.transactionList}>
            {recentTransactions.map((t) => (
              <View key={t.id} style={styles.transactionCard}>
                <View style={styles.txLeft}>
                  <View
                    style={[
                      styles.txIcon,
                      t.type === "income" ? styles.txIconIncome : styles.txIconExpense,
                    ]}
                  >
                    {t.type === "income" ? (
                      <ArrowDownLeft size={16} color="#10B981" />
                    ) : (
                      <ArrowUpRight size={16} color="#EF4444" />
                    )}
                  </View>
                  <View>
                    <Text style={styles.txDesc} numberOfLines={1}>
                      {t.description}
                    </Text>
                    <Text style={styles.txDate}>{t.date}</Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    t.type === "income" ? styles.txAmountIncome : styles.txAmountExpense,
                  ]}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatRupiah(t.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F17",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  syncingBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  syncText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
  },
  syncingText: {
    color: "#F59E0B",
  },
  balanceCard: {
    backgroundColor: "#131B2E",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 18,
  },
  cashflowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    gap: 12,
  },
  cashflowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  cashflowIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  cashflowLabel: {
    fontSize: 10,
    color: "#64748B",
  },
  cashflowValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionButtonSecondaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  section: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  transactionList: {
    gap: 8,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#131B2E",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txIconIncome: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  txIconExpense: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  txDesc: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  txDate: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
  txAmountIncome: {
    color: "#10B981",
  },
  txAmountExpense: {
    color: "#F8FAFC",
  },
});
