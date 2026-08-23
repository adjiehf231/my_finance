"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  PiggyBank,
  PieChart,
  ShieldCheck,
  Building2,
  Smartphone,
  Layers,
} from "lucide-react";
import { createFamilyAction, joinFamilyByCodeAction } from "@/features/family/actions/family-actions";
import { createWalletAction } from "@/features/wallets/actions/wallet-actions";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // State
  const [familyMode, setFamilyMode] = useState<"create" | "join">("create");
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [createdFamilyId, setCreatedFamilyId] = useState<string | null>(null);

  // Wallet State
  const [walletName, setWalletName] = useState("BCA Tabungan Utama");
  const [walletType, setWalletType] = useState<"bank" | "ewallet" | "cash">("bank");
  const [initialBalance, setInitialBalance] = useState("5000000");

  // Budget State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Makanan & Minuman",
    "Transportasi",
    "Listrik & Air",
  ]);
  const [budgetLimit, setBudgetLimit] = useState("3000000");

  // Goal State
  const [goalName, setGoalName] = useState("Dana Darurat 6 Bulan");
  const [goalTarget, setGoalTarget] = useState("30000000");

  // Step 2: Handle Family Setup
  const handleFamilyStep = async () => {
    if (familyMode === "create") {
      if (familyName.trim().length < 3) {
        toast.error("Nama keluarga minimal 3 karakter");
        return;
      }

      setIsLoading(true);
      const res = await createFamilyAction({ name: familyName.trim(), currency: "IDR" });
      setIsLoading(false);

      if (res.success && res.data) {
        setCreatedFamilyId(res.data.id);
        toast.success(`Keluarga "${res.data.name}" berhasil dibuat!`);
        setStep(3);
      } else {
        toast.error(res.error || "Gagal membuat keluarga");
      }
    } else {
      if (inviteCode.trim().length < 6) {
        toast.error("Kode undangan minimal 6 karakter");
        return;
      }

      setIsLoading(true);
      const res = await joinFamilyByCodeAction({ inviteCode: inviteCode.trim().toUpperCase() });
      setIsLoading(false);

      if (res.success && res.data) {
        setCreatedFamilyId(res.data.id);
        toast.success(`Berhasil bergabung ke keluarga "${res.data.name}"!`);
        // Joined users can skip straight to celebration or complete remaining setup
        setStep(7);
      } else {
        toast.error(res.error || "Kode undangan tidak valid");
      }
    }
  };

  // Step 4: Handle Wallet Creation
  const handleWalletStep = async () => {
    if (!createdFamilyId) {
      setStep(2);
      return;
    }

    if (!walletName.trim()) {
      toast.error("Nama dompet tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    const balanceNum = parseFloat(initialBalance) || 0;
    const res = await createWalletAction({
      familyId: createdFamilyId,
      name: walletName.trim(),
      type: walletType,
      initialBalance: balanceNum,
      currency: "IDR",
      color: walletType === "bank" ? "#3B82F6" : walletType === "ewallet" ? "#10B981" : "#F59E0B",
      icon: walletType,
    });
    setIsLoading(false);

    if (res.success) {
      toast.success("Rekening pertama berhasil dibuat!");
      setStep(5);
    } else {
      toast.error(res.error || "Gagal membuat rekening");
    }
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  const progressPercentage = (step / 7) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300">
      {/* Top Header & Progress Indicator */}
      <header className="max-w-2xl w-full mx-auto pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              MF
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              Setup Keuangan Keluarga
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Langkah {step} dari 7
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 rounded-full" />
      </header>

      {/* Main Wizard Form Card */}
      <main className="flex-1 flex items-center justify-center py-6">
        <Card className="max-w-xl w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
          <CardContent className="p-0">
            {/* STEP 1: Welcome */}
            {step === 1 && (
              <div className="text-center py-4 space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                  <Sparkles className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Selamat Datang di My Finance! 🎉
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Platform cerdas untuk mengelola arus kas, anggaran, dan target impian bersama keluarga dalam satu ruang kerja transparan.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 mb-1" />
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-200">Aman & Terisolasi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">PostgreSQL RLS</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <Users className="h-5 w-5 text-blue-600 mb-1" />
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-200">Kolaborasi</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Ruang Bersama</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <PieChart className="h-5 w-5 text-purple-600 mb-1" />
                    <p className="font-semibold text-xs text-slate-900 dark:text-slate-200">Wawasan AI</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Scan Nota Instan</p>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base flex items-center justify-center gap-2 mt-4 shadow-md shadow-emerald-600/20"
                >
                  Mulai Setup Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* STEP 2: Create or Join Family */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Pilih Ruang Kerja Keluarga
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Buat keluarga baru atau gabung dengan kode undangan yang sudah ada.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFamilyMode("create")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      familyMode === "create"
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <Plus className="h-5 w-5 text-emerald-600 mb-2" />
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Buat Keluarga Baru</p>
                    <p className="text-xs text-slate-500 mt-0.5">Sebagai Pemilik (Owner)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFamilyMode("join")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      familyMode === "join"
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    <Users className="h-5 w-5 text-blue-600 mb-2" />
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Gabung Keluarga</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pakai Kode Undangan</p>
                  </button>
                </div>

                {familyMode === "create" ? (
                  <div className="space-y-2">
                    <Label htmlFor="family-name">Nama Keluarga</Label>
                    <Input
                      id="family-name"
                      placeholder="Contoh: Keluarga Adjie, Tanur Family"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="invite-code">Kode Undangan (6 Karakter)</Label>
                    <Input
                      id="invite-code"
                      placeholder="Contoh: 7K9X2M"
                      className="uppercase font-mono tracking-widest text-base"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      maxLength={16}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-2xl h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={handleFamilyStep}
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {isLoading ? "Memproses..." : "Lanjutkan"}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: First Wallet Setup */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Setup Rekening Pertama Anda
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Pilih tipe rekening utama yang sering Anda gunakan untuk bertransaksi.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Tipe Rekening</Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setWalletType("bank");
                        setWalletName("BCA Tabungan");
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        walletType === "bank"
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 font-semibold"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs">Bank</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWalletType("ewallet");
                        setWalletName("GoPay / OVO");
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        walletType === "ewallet"
                          ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 font-semibold"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <Smartphone className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs">E-Wallet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWalletType("cash");
                        setWalletName("Dompet Tunai");
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        walletType === "cash"
                          ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 font-semibold"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <Wallet className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs">Uang Tunai</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step3-wallet-name">Nama Dompet / Rekening</Label>
                  <Input
                    id="step3-wallet-name"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-2xl h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Lanjutkan ke Saldo
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Initial Balance */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Berapa Saldo Awal {walletName}?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Masukkan estimasi saldo saat ini untuk memulai pelacakan yang akurat.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step4-balance">Saldo Awal (Rupiah)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                      Rp
                    </span>
                    <Input
                      id="step4-balance"
                      type="number"
                      min="0"
                      className="pl-12 text-xl font-bold h-14 rounded-2xl"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(3)} className="rounded-2xl h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={handleWalletStep}
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {isLoading ? "Menyimpan..." : "Simpan & Lanjutkan"}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: Monthly Budget Setup */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Atur Batas Anggaran Bulanan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tentukan limit pengeluaran bulanan agar keuangan tetap terkendali.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Kategori Prioritas Terpilih</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Makanan & Minuman", "Transportasi", "Kebutuhan Rumah Tangga", "Listrik & Air", "Pendidikan"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          if (selectedCategories.includes(cat)) {
                            setSelectedCategories(selectedCategories.filter((c) => c !== cat));
                          } else {
                            setSelectedCategories([...selectedCategories, cat]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedCategories.includes(cat)
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                            : "border-slate-200 text-slate-600 dark:border-slate-800"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step5-budget">Limit Total Anggaran Bulan Ini (Rp)</Label>
                  <Input
                    id="step5-budget"
                    type="number"
                    min="0"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(4)} className="rounded-2xl h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={() => setStep(6)}
                    className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Lanjutkan ke Target Tabungan
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 6: First Financial Goal */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Target Tabungan Pertama (Goal)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Mulai menabung untuk impian keluarga seperti dana darurat atau liburan.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="step6-goal-name">Nama Target Tabungan</Label>
                    <Input
                      id="step6-goal-name"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="step6-goal-target">Nominal Target (Rp)</Label>
                    <Input
                      id="step6-goal-target"
                      type="number"
                      min="0"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(5)} className="rounded-2xl h-11">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={() => setStep(7)}
                    className="flex-1 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Selesaikan Setup
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 7: Celebration & Ready */}
            {step === 7 && (
              <div className="text-center py-4 space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Ruang Kerja Keluarga Siap! 🚀
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Selamat! Anda telah menyelesaikan seluruh setup awal. Anda siap mencatat transaksi dan memantau kesehatan finansial keluarga.
                  </p>
                </div>

                <Button
                  onClick={handleFinish}
                  className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-2 mt-4 shadow-lg shadow-emerald-600/20"
                >
                  Buka Dashboard Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl w-full mx-auto py-2 text-center text-xs text-slate-400">
        My Finance &copy; {new Date().getFullYear()} — Setup Wizard Keuangan Keluarga
      </footer>
    </div>
  );
}
