import { describe, it, expect } from "vitest";
import { formatWhatsAppDebtMessage } from "@/features/debts/components/debt-reminder-button";
import type { DebtWithProgress } from "@/features/debts/actions/debt-actions";

describe("Debt & Receivable WhatsApp Reminder Formatter", () => {
  it("formats polite WhatsApp reminder for receivables (piutang)", () => {
    const debt: DebtWithProgress = {
      id: "d-1",
      family_id: "fam-1",
      user_id: "user-1",
      name: "Budi Santoso",
      type: "debt_receivable",
      total_amount: 1500000,
      remaining_amount: 500000,
      paid_amount: 1000000,
      percentage_paid: 67,
      interest_rate: 0,
      monthly_payment: 0,
      start_date: "2026-08-01",
      due_date: "2026-08-30",
      status: "active",
      notes: "Pinjaman modal usaha warung",
      created_at: "2026-08-01",
      updated_at: "2026-08-01",
    };

    const msg = formatWhatsAppDebtMessage(debt);
    expect(msg).toContain("Halo *Budi Santoso*");
    expect(msg).toContain("catatan tagihan piutang");
    expect(msg).toContain("500.000");
    expect(msg).toContain("30 Agu 2026");
  });

  it("formats internal reminder for payable loans (hutang)", () => {
    const debt: DebtWithProgress = {
      id: "d-2",
      family_id: "fam-1",
      user_id: "user-1",
      name: "Kredit Bank BCA",
      type: "loan_payable",
      total_amount: 50000000,
      remaining_amount: 35000000,
      paid_amount: 15000000,
      percentage_paid: 30,
      interest_rate: 8,
      monthly_payment: 2500000,
      start_date: "2026-01-01",
      due_date: "2026-08-28",
      status: "active",
      notes: "Bayar sebelum tanggal 28",
      created_at: "2026-01-01",
      updated_at: "2026-08-01",
    };

    const msg = formatWhatsAppDebtMessage(debt);
    expect(msg).toContain("Pengingat Jatuh Tempo Kewajiban");
    expect(msg).toContain("*Kredit Bank BCA*");
    expect(msg).toContain("35.000.000");
  });

  it("escapes/encodes properly for WhatsApp web URL parameter", () => {
    const debt: DebtWithProgress = {
      id: "d-3",
      family_id: "fam-1",
      user_id: "user-1",
      name: "Andi",
      type: "debt_receivable",
      total_amount: 200000,
      remaining_amount: 200000,
      paid_amount: 0,
      percentage_paid: 0,
      interest_rate: 0,
      monthly_payment: 0,
      start_date: "2026-08-01",
      due_date: null,
      status: "active",
      notes: null,
      created_at: "2026-08-01",
      updated_at: "2026-08-01",
    };

    const msg = formatWhatsAppDebtMessage(debt);
    const encoded = encodeURIComponent(msg);
    expect(encoded).not.toContain(" ");
    expect(encoded).toContain("%20");
  });
});
