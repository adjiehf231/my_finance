"use client";

import { useState, useEffect } from "react";
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
  PieChart,
  ShieldCheck,
  Building2,
  Smartphone,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  createFamilyAction,
  joinFamilyByCodeAction,
  getCurrentFamilyAction,
} from "@/features/family/actions/family-actions";
import { createWalletAction } from "@/features/wallets/actions/wallet-actions";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Auto-redirect if user already has an active family
  useEffect(() => {
    async function checkExistingFamily() {
      try {
        const res = await getCurrentFamilyAction();
        if (res.success && res.data?.family) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // Continue with onboarding
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkExistingFamily();
  }, [router]);

  // Family State
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
      if (familyName.trim().length < 2) {
        toast.error(locale === "en" ? "Family name must be at least 2 characters" : "Nama keluarga minimal 2 karakter");
        return;
      }

      setIsLoading(true);
      const res = await createFamilyAction({ name: familyName.trim(), currency: "IDR" });
      setIsLoading(false);

      if (res.success && res.data) {
        setCreatedFamilyId(res.data.id);
        toast.success(locale === "en" ? `Family "${res.data.name}" created!` : `Keluarga "${res.data.name}" berhasil dibuat!`);
        setStep(3);
      } else {
        toast.error(res.error || (locale === "en" ? "Failed to create family" : "Gagal membuat keluarga"));
      }
    } else {
      if (inviteCode.trim().length < 6) {
        toast.error(locale === "en" ? "Invite code must be at least 6 characters" : "Kode undangan minimal 6 karakter");
        return;
      }

      setIsLoading(true);
      const res = await joinFamilyByCodeAction({ inviteCode: inviteCode.trim().toUpperCase() });
      setIsLoading(false);

      if (res.success && res.data) {
        setCreatedFamilyId(res.data.id);
        toast.success(locale === "en" ? `Joined family "${res.data.name}"!` : `Berhasil bergabung ke keluarga "${res.data.name}"!`);
        setStep(7);
      } else {
        toast.error(res.error || (locale === "en" ? "Invalid invite code" : "Kode undangan tidak valid"));
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
      toast.error(locale === "en" ? "Account name cannot be empty" : "Nama dompet tidak boleh kosong");
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
      color: walletType === "bank" ? "#2563EB" : walletType === "ewallet" ? "#4F46E5" : "#0891B2",
      icon: walletType,
    });
    setIsLoading(false);

    if (res.success) {
      toast.success(locale === "en" ? "First account created successfully!" : "Rekening pertama berhasil dibuat!");
      setStep(5);
    } else {
      toast.error(res.error || (locale === "en" ? "Failed to create account" : "Gagal membuat rekening"));
    }
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Memeriksa ruang kerja...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (step / 7) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Progress Bar */}
      <header className="max-w-2xl w-full mx-auto pt-4 pb-2 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-sm text-slate-900 dark:text-white block leading-none font-display">
                My<span className="text-blue-600 dark:text-blue-400">Finance</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {t("onboarding.headerTitle")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              {t("onboarding.stepIndicator", { current: step, total: 7 })}
            </span>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 rounded-full bg-slate-200 dark:bg-white/[0.08]" />
      </header>

      {/* Main Wizard Form Card */}
      <main className="flex-1 flex items-center justify-center py-6 z-10">
        <Card className="max-w-xl w-full rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl shadow-xl shadow-blue-500/5 p-6 sm:p-8">
          <CardContent className="p-0">
            {/* STEP 1: Welcome */}
            {step === 1 && (
              <div className="text-center py-4 space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Sparkles className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                    {t("onboarding.step1Title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed font-medium">
                    {t("onboarding.step1Subtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/70 dark:border-white/[0.06]">
                    <ShieldCheck className="h-5 w-5 text-blue-500 mb-1" />
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-200">{t("onboarding.feature1Title")}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t("onboarding.feature1Desc")}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/70 dark:border-white/[0.06]">
                    <Users className="h-5 w-5 text-indigo-500 mb-1" />
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-200">{t("onboarding.feature2Title")}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t("onboarding.feature2Desc")}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/70 dark:border-white/[0.06]">
                    <PieChart className="h-5 w-5 text-cyan-500 mb-1" />
                    <p className="font-bold text-xs text-slate-900 dark:text-slate-200">{t("onboarding.feature3Title")}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t("onboarding.feature3Desc")}</p>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/25"
                >
                  {t("onboarding.startBtn")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* STEP 2: Create or Join Family */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                    {t("onboarding.step2Title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {t("onboarding.step2Subtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFamilyMode("create")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      familyMode === "create"
                        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{t("onboarding.createFamilyOpt")}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t("onboarding.createFamilyDesc")}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFamilyMode("join")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      familyMode === "join"
                        ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-white/[0.08]"
                    }`}
                  >
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{t("onboarding.joinFamilyOpt")}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t("onboarding.joinFamilyDesc")}</p>
                  </button>
                </div>

                {familyMode === "create" ? (
                  <div className="space-y-2">
                    <Label htmlFor="family-name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t("onboarding.familyNameLabel")}
                    </Label>
                    <Input
                      id="family-name"
                      placeholder={t("onboarding.familyNamePlaceholder")}
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-sm font-medium"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="invite-code" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t("onboarding.inviteCodeLabel")}
                    </Label>
                    <Input
                      id="invite-code"
                      placeholder={t("onboarding.inviteCodePlaceholder")}
                      className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 uppercase font-mono tracking-widest text-sm font-bold"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      maxLength={16}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-2xl h-11 text-xs font-bold">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> {t("onboarding.backBtn")}
                  </Button>
                  <Button
                    onClick={handleFamilyStep}
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                  >
                    {isLoading ? t("onboarding.processingBtn") : t("onboarding.nextBtn")}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: First Wallet Setup */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                    {t("onboarding.step3Title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {t("onboarding.step3Subtitle")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("onboarding.walletTypeLabel")}</Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setWalletType("bank");
                        setWalletName("BCA Tabungan");
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        walletType === "bank"
                          ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                          : "border-slate-200 dark:border-white/[0.08]"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mx-auto mb-1.5" />
                      <span className="text-xs">{t("onboarding.bankOpt")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWalletType("ewallet");
                        setWalletName("GoPay / OVO");
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        walletType === "ewallet"
                          ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm"
                          : "border-slate-200 dark:border-white/[0.08]"
                      }`}
                    >
                      <Smartphone className="h-5 w-5 mx-auto mb-1.5" />
                      <span className="text-xs">{t("onboarding.ewalletOpt")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWalletType("cash");
                        setWalletName("Dompet Tunai");
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        walletType === "cash"
                          ? "border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm"
                          : "border-slate-200 dark:border-white/[0.08]"
                      }`}
                    >
                      <Wallet className="h-5 w-5 mx-auto mb-1.5" />
                      <span className="text-xs">{t("onboarding.cashOpt")}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step3-wallet-name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("onboarding.walletNameLabel")}
                  </Label>
                  <Input
                    id="step3-wallet-name"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-sm font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-2xl h-11 text-xs font-bold">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> {t("onboarding.backBtn")}
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="flex-1 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                  >
                    {t("onboarding.nextBtn")}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Initial Balance */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                    {t("onboarding.step4Title", { name: walletName })}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {t("onboarding.step4Subtitle")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step4-balance" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("onboarding.balanceLabel")}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-base">
                      Rp
                    </span>
                    <Input
                      id="step4-balance"
                      type="number"
                      min="0"
                      className="pl-12 text-lg font-bold h-12 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(3)} className="rounded-2xl h-11 text-xs font-bold">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> {t("onboarding.backBtn")}
                  </Button>
                  <Button
                    onClick={handleWalletStep}
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                  >
                    {isLoading ? t("onboarding.processingBtn") : t("onboarding.saveAndContinueBtn")}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 5: Monthly Budget Setup */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                    {t("onboarding.step5Title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {t("onboarding.step5Subtitle")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("onboarding.categoriesLabel")}</Label>
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
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          selectedCategories.includes(cat)
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                            : "border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="step5-budget" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("onboarding.budgetLimitLabel")}
                  </Label>
                  <Input
                    id="step5-budget"
                    type="number"
                    min="0"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-sm font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(4)} className="rounded-2xl h-11 text-xs font-bold">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> {t("onboarding.backBtn")}
                  </Button>
                  <Button
                    onClick={() => setStep(6)}
                    className="flex-1 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                  >
                    {t("onboarding.nextBtn")}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 6: First Financial Goal */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                    {t("onboarding.step6Title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {t("onboarding.step6Subtitle")}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="step6-goal-name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t("onboarding.goalNameLabel")}
                    </Label>
                    <Input
                      id="step6-goal-name"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="step6-goal-target" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t("onboarding.goalTargetLabel")}
                    </Label>
                    <Input
                      id="step6-goal-target"
                      type="number"
                      min="0"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      className="h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(5)} className="rounded-2xl h-11 text-xs font-bold">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> {t("onboarding.backBtn")}
                  </Button>
                  <Button
                    onClick={() => setStep(7)}
                    className="flex-1 h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                  >
                    {t("onboarding.finishSetupBtn")}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 7: Celebration & Ready */}
            {step === 7 && (
              <div className="text-center py-4 space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                    {t("onboarding.step7Title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed font-medium">
                    {t("onboarding.step7Subtitle")}
                  </p>
                </div>

                <Button
                  onClick={handleFinish}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/25"
                >
                  {t("onboarding.openDashboardBtn")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl w-full mx-auto py-2 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} My Finance — Modern Family Financial Hub
      </footer>
    </div>
  );
}
