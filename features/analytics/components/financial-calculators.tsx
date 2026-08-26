"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  Calculator,
  ShieldCheck,
  Building2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface FinancialCalculatorsProps {
  currentMonthlyExpense?: number;
  currentLiquidBalance?: number;
}

export function FinancialCalculators({
  currentMonthlyExpense = 5000000,
  currentLiquidBalance = 0,
}: FinancialCalculatorsProps) {
  const { t } = useTranslation();

  // 1. Emergency Fund State
  const [expense, setExpense] = useState<number | string>(currentMonthlyExpense || 5000000);
  const [multiplier, setMultiplier] = useState<number>(6); // 3, 6, 9, 12 months

  const numericExpense = typeof expense === "number" ? expense : parseFloat(String(expense).replace(/[^0-9.-]+/g, "")) || 0;
  const emergencyTarget = numericExpense * multiplier;
  const emergencyShortfall = Math.max(0, emergencyTarget - currentLiquidBalance);
  const emergencyFundProgress = emergencyTarget > 0 ? Math.min(100, Math.round((currentLiquidBalance / emergencyTarget) * 100)) : 0;

  // 2. Loan / KPR Amortization State
  const [loanPrincipal, setLoanPrincipal] = useState<number | string>(500000000); // 500jt default
  const [annualInterest, setAnnualInterest] = useState<string>("7.5"); // 7.5% per annum
  const [loanTenorYears, setLoanTenorYears] = useState<string>("15"); // 15 years

  const numericPrincipal = typeof loanPrincipal === "number" ? loanPrincipal : parseFloat(String(loanPrincipal).replace(/[^0-9.-]+/g, "")) || 0;
  const ratePerMonth = (parseFloat(annualInterest) || 0) / 100 / 12;
  const totalMonths = (parseInt(loanTenorYears) || 0) * 12;

  let monthlyInstallment = 0;
  let totalLoanRepayment = 0;
  let totalLoanInterest = 0;

  if (numericPrincipal > 0 && totalMonths > 0) {
    if (ratePerMonth > 0) {
      monthlyInstallment =
        (numericPrincipal *
          (ratePerMonth * Math.pow(1 + ratePerMonth, totalMonths))) /
        (Math.pow(1 + ratePerMonth, totalMonths) - 1);
    } else {
      monthlyInstallment = numericPrincipal / totalMonths;
    }
    totalLoanRepayment = monthlyInstallment * totalMonths;
    totalLoanInterest = Math.max(0, totalLoanRepayment - numericPrincipal);
  }

  // 3. Compound Interest & Investment Growth State
  const [initialDeposit, setInitialDeposit] = useState<number | string>(10000000); // 10jt
  const [monthlyContribution, setMonthlyContribution] = useState<number | string>(1000000); // 1jt/bln
  const [expectedReturn, setExpectedReturn] = useState<string>("10"); // 10% / year
  const [investmentYears, setInvestmentYears] = useState<string>("10"); // 10 years

  const numericInitDeposit = typeof initialDeposit === "number" ? initialDeposit : parseFloat(String(initialDeposit).replace(/[^0-9.-]+/g, "")) || 0;
  const numericMonthlyContrib = typeof monthlyContribution === "number" ? monthlyContribution : parseFloat(String(monthlyContribution).replace(/[^0-9.-]+/g, "")) || 0;
  const rMonth = (parseFloat(expectedReturn) || 0) / 100 / 12;
  const invMonths = (parseInt(investmentYears) || 0) * 12;

  let futureValue = numericInitDeposit;
  let totalPrincipalInvested = numericInitDeposit + numericMonthlyContrib * invMonths;

  if (invMonths > 0) {
    if (rMonth > 0) {
      const fvInitial = numericInitDeposit * Math.pow(1 + rMonth, invMonths);
      const fvSeries =
        numericMonthlyContrib *
        ((Math.pow(1 + rMonth, invMonths) - 1) / rMonth);
      futureValue = fvInitial + fvSeries;
    } else {
      futureValue = totalPrincipalInvested;
    }
  }
  const totalGains = Math.max(0, futureValue - totalPrincipalInvested);

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.06] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              {t("calculators.title")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {t("calculators.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <Tabs defaultValue="emergency" className="w-full space-y-6">
        <TabsList className="grid grid-cols-3 w-full h-13 rounded-2xl p-1.5 bg-slate-100 dark:bg-[#07090E] border border-slate-200/40 dark:border-white/[0.04]">
          <TabsTrigger
            value="emergency"
            className="rounded-xl font-bold text-xs flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{t("calculators.emergencyTab")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="kpr"
            className="rounded-xl font-bold text-xs flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
          >
            <Building2 className="h-4 w-4" />
            <span>{t("calculators.kprTab")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="compound"
            className="rounded-xl font-bold text-xs flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{t("calculators.compoundTab")}</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Emergency Fund Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                  {t("calculators.monthlyExpenseLabel")}
                </Label>
                <CurrencyInput
                  value={expense}
                  onValueChange={setExpense}
                  placeholder="5.000.000"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                  {t("calculators.multiplierLabel")}
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMultiplier(m)}
                      className={`py-3 rounded-2xl text-xs font-black transition-all border ${
                        multiplier === m
                          ? "bg-blue-600 text-white border-blue-500 shadow-glow"
                          : "bg-slate-50 dark:bg-[#07090E] text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-white/[0.08] hover:border-blue-500/40"
                      }`}
                    >
                      {t("calculators.months", { count: m })}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Fund Outcome Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-700 text-white p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-blue-600/15 relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-100 flex items-center gap-1.5 font-display">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    {t("calculators.emergencyIdealTarget", { multiplier })}
                  </span>
                  <span className="text-xs font-black bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xl">
                    {t("calculators.fulfilled", { percent: emergencyFundProgress })}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                  {formatCurrency(emergencyTarget)}
                </h3>

                <p className="text-xs text-blue-100 font-medium">
                  {currentLiquidBalance >= emergencyTarget
                    ? "✓ Saldo likuiditas kas keluarga Anda telah mencukupi standar ketahanan darurat ideal."
                    : `Saldo kas saat ini ${formatCurrency(currentLiquidBalance)}. Sisa kekurangan tabungan adalah ${formatCurrency(emergencyShortfall)}.`}
                </p>
              </div>

              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden mt-4">
                <div
                  className="bg-white h-full transition-all duration-500 rounded-full"
                  style={{ width: `${emergencyFundProgress}%` }}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 2. Loan & KPR Amortization Tab */}
        <TabsContent value="kpr" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                  {t("calculators.loanPrincipalLabel")}
                </Label>
                <CurrencyInput
                  value={loanPrincipal}
                  onValueChange={setLoanPrincipal}
                  placeholder="500.000.000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                    {t("calculators.interestRateLabel")}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={annualInterest}
                    onChange={(e) => setAnnualInterest(e.target.value)}
                    className="rounded-2xl h-14 text-xl font-bold font-mono bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                    {t("calculators.tenorLabel")}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="35"
                    value={loanTenorYears}
                    onChange={(e) => setLoanTenorYears(e.target.value)}
                    className="rounded-2xl h-14 text-xl font-bold font-mono bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                  />
                </div>
              </div>
            </div>

            {/* Loan Outcome Card */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-[#0D111A] to-[#0A1224] text-white p-6 sm:p-7 flex flex-col justify-between shadow-2xl border border-white/[0.08]">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-display">
                    {t("calculators.monthlyInstallment")}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-rose-400 font-mono tracking-tight mt-1">
                    {formatCurrency(Math.round(monthlyInstallment))}
                    <span className="text-xs font-normal text-slate-400 ml-1">/bulan</span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.08]">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-display">
                      {t("calculators.totalPrincipal")}
                    </span>
                    <p className="text-base font-black font-mono text-white mt-0.5">{formatCurrency(numericPrincipal)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-rose-400 font-display">
                      {t("calculators.totalInterest")}
                    </span>
                    <p className="text-base font-black font-mono text-rose-400 mt-0.5">+{formatCurrency(Math.round(totalLoanInterest))}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-display">
                    {t("calculators.totalRepayment")}
                  </span>
                  <p className="text-lg font-black font-mono text-cyan-300">{formatCurrency(Math.round(totalLoanRepayment))}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. Compound Interest & Investment Growth Tab */}
        <TabsContent value="compound" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                    {t("calculators.initialDepositLabel")}
                  </Label>
                  <CurrencyInput
                    value={initialDeposit}
                    onValueChange={setInitialDeposit}
                    placeholder="10.000.000"
                    className="text-lg h-12"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                    {t("calculators.monthlyDepositLabel")}
                  </Label>
                  <CurrencyInput
                    value={monthlyContribution}
                    onValueChange={setMonthlyContribution}
                    placeholder="1.000.000"
                    className="text-lg h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                    {t("calculators.returnRateLabel")}
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="rounded-2xl h-12 text-lg font-bold font-mono bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400 font-display">
                    {t("calculators.durationLabel")}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={investmentYears}
                    onChange={(e) => setInvestmentYears(e.target.value)}
                    className="rounded-2xl h-12 text-lg font-bold font-mono bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08]"
                  />
                </div>
              </div>
            </div>

            {/* Investment Growth Outcome Card */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-700 text-white p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-blue-600/15">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-100 flex items-center gap-1.5 font-display">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    {t("calculators.futureAssetValue", { years: investmentYears })}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-300">
                  {formatCurrency(Math.round(futureValue))}
                </h3>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-100 font-display">
                      {t("calculators.totalContributed")}
                    </span>
                    <p className="text-base font-black font-mono text-white mt-0.5">{formatCurrency(totalPrincipalInvested)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 font-display">
                      {t("calculators.totalGain")}
                    </span>
                    <p className="text-base font-black font-mono text-emerald-300 mt-0.5">+{formatCurrency(Math.round(totalGains))}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
