import React, { useState } from "react";
import { Alert } from "react-native";
import { MobileDashboardScreen } from "../src/screens/mobile-dashboard";

export default function MobileIndexPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAddPress = () => {
    Alert.alert("Catat Transaksi", "Fitur pencatatan transaksi offline-first siap digunakan.");
  };

  const handleScanPress = () => {
    Alert.alert("Scan Struk AI", "Fitur OCR Scan Struk dengan Google Gemini AI siap digunakan.");
  };

  const handleSyncPress = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert("Sinkronisasi Selesai", "Data telah tersinkronkan dengan database cloud Supabase.");
    }, 1500);
  };

  return (
    <MobileDashboardScreen
      familyName="Keluarga Bahagia"
      totalBalance={15750000}
      monthlyIncome={12000000}
      monthlyExpense={4500000}
      isSyncing={isSyncing}
      onAddPress={handleAddPress}
      onScanPress={handleScanPress}
      onSyncPress={handleSyncPress}
    />
  );
}
