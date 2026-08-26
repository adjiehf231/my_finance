import { describe, it, expect } from "vitest";

function calculateEmergencyFund(monthlyExpense: number, multiplier: number, currentSavings: number) {
  const target = monthlyExpense * multiplier;
  const shortfall = Math.max(0, target - currentSavings);
  const progress = target > 0 ? Math.min(100, Math.round((currentSavings / target) * 100)) : 0;
  return { target, shortfall, progress };
}

function calculateLoanMonthlyPayment(principal: number, annualInterestRate: number, tenorYears: number): {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
} {
  const r = annualInterestRate / 100 / 12;
  const n = tenorYears * 12;
  let monthlyPayment = 0;
  if (r === 0) {
    monthlyPayment = principal / n;
  } else {
    monthlyPayment = (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }
  const totalRepayment = monthlyPayment * n;
  const totalInterest = totalRepayment - principal;
  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
  };
}

function calculateCompoundInterest(
  initialDeposit: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number
) {
  const r = annualReturnRate / 100 / 12;
  const n = years * 12;
  let futureValue = initialDeposit;
  const totalPrincipal = initialDeposit + monthlyContribution * n;

  if (r > 0) {
    const fvInit = initialDeposit * Math.pow(1 + r, n);
    const fvSeries = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    futureValue = fvInit + fvSeries;
  } else {
    futureValue = totalPrincipal;
  }

  return {
    futureValue: Math.round(futureValue),
    totalPrincipal,
    totalGains: Math.round(futureValue - totalPrincipal),
  };
}

describe("Financial Calculators Math Engine", () => {
  it("calculates Emergency Fund target and shortfall correctly", () => {
    const res = calculateEmergencyFund(5000000, 6, 15000000);
    expect(res.target).toBe(30000000); // 5jt * 6 = 30jt
    expect(res.shortfall).toBe(15000000); // 30jt - 15jt = 15jt
    expect(res.progress).toBe(50); // 50%
  });

  it("calculates Loan / KPR amortization correctly using PMT formula", () => {
    // 500jt KPR, 12% p.a., 10 years (120 months)
    const res = calculateLoanMonthlyPayment(500000000, 12, 10);
    // Standard PMT(1%, 120, -500000000) ~ 7.173.547 / month
    expect(res.monthlyPayment).toBe(7173547);
    expect(res.totalRepayment).toBe(860825690);
    expect(res.totalInterest).toBe(360825690);
  });

  it("calculates Compound Interest & Investment wealth growth accurately", () => {
    // 10jt initial, 1jt/month, 12% p.a., 10 years (120 months)
    const res = calculateCompoundInterest(10000000, 1000000, 12, 10);
    expect(res.totalPrincipal).toBe(130000000); // 10jt + 120jt = 130jt
    // Future Value should exceed 260jt due to compounding
    expect(res.futureValue).toBeGreaterThan(260000000);
    expect(res.totalGains).toBeGreaterThan(130000000);
  });
});
