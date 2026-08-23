# 🧪 Testing Strategy & Quality Assurance
## My Finance — Comprehensive QA & Test Plan

---

## 1. Testing Philosophy & Test Pyramid

Untuk menjamin keandalan data finansial, keamanan *multi-tenant*, dan pengalaman pengguna yang mulus, **My Finance** menerapkan strategi pengujian berlapis (*Testing Pyramid*):

```
                     ┌──────────────────┐
                     │   E2E Tests      │  10% (Playwright)
                     │  Critical Flows  │
                     ├──────────────────┤
                     │ Integration Tests│  30% (Server Actions,
                     │  & RLS Security  │   Database Triggers)
                     ├──────────────────┤
                     │    Unit Tests    │  60% (Calculations, Zod
                     │  Logic & Utils   │   Schemas, UI Components)
                     └──────────────────┘
```

### Sasaran Kualitas:
- **Zero Financial Drift**: 100% konsistensi antara mutasi transaksi dan saldo riil dompet.
- **Strict Data Isolation**: 0% kebocoran data antar-keluarga pada pengujian penetrasi RLS.
- **Code Coverage Target**: Minimal **80% statement & branch coverage** pada modul kritis.

---

## 2. Test Tooling Stack

| Kategori Pengujian | Tool / Library | Tujuan |
|---|---|---|
| **Unit Testing** | **Vitest** | Eksekusi test fungsi utilitas, kalkulasi saldo, dan skema Zod secepat kilat. |
| **Component Testing** | **React Testing Library** | Verifikasi render komponen UI, event klik, dan form input. |
| **Database & RLS Testing**| **Supabase Local CLI + pgTAP** | Pengujian keamanan kebijakan RLS dan trigger otomatis di PostgreSQL lokal. |
| **E2E Testing** | **Playwright** | Pengujian alur pengguna nyata (Cross-browser: Chrome, Firefox, Safari, Mobile). |
| **AI Mocking & Regression** | **Mock Service Worker (MSW)** | Simulasi respons Vision OCR dan LLM streaming tanpa memakan kuota token live. |
| **A11y Automated Testing** | **@axe-core/playwright** | Pengecekan kepatuhan aksesibilitas WCAG 2.1 Level AA. |
| **Linting & Type-Check** | **ESLint + TypeScript Compiler (`tsc`)** | Pencegahan bug statis sebelum kode di-build. |

> 📖 **Untuk panduan implementasi teknis lengkap, konfigurasi Playwright/Vitest, dan script pipeline, lihat [docs/QA_AUTOMATION.md](QA_AUTOMATION.md)**.

---

## 3. Test Suites & Matrix Skenario Kritis

---

### 3.1 Unit Test: Kalkulasi Finansial & Skema Zod
File: `tests/unit/financial-calculations.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { calculateBudgetProgress, calculateHealthScore, calculateNetWorth } from '@/lib/finance-math';

describe('Financial Calculation Utils', () => {
  it('harus menghitung persentase budget dan status dengan tepat', () => {
    const safeResult = calculateBudgetProgress(1400000, 2000000);
    expect(safeResult.percentage).toBe(70);
    expect(safeResult.status).toBe('warning');

    const dangerResult = calculateBudgetProgress(2100000, 2000000);
    expect(dangerResult.percentage).toBe(105);
    expect(dangerResult.status).toBe('danger');
  });

  it('harus menghitung Net Worth (Assets - Liabilities) secara benar', () => {
    const assets = 150000000;
    const liabilities = 35000000;
    expect(calculateNetWorth(assets, liabilities)).toBe(115000000);
  });
});
```

---

### 3.2 Integration Test: Server Actions & Atomic Balances
File: `tests/integration/transactions.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTransactionAction } from '@/features/transactions/actions';

describe('Transaction Server Actions Integration', () => {
  it('harus menolak transaksi transfer jika dompet asal dan tujuan sama', async () => {
    const result = await createTransactionAction({
      type: 'transfer',
      fromWalletId: 'wallet-123',
      toWalletId: 'wallet-123',
      amount: 50000,
      transactionDate: '2026-08-23',
    });

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('tidak boleh sama');
  });

  it('harus menolak transaksi dengan nominal negatif atau nol', async () => {
    const result = await createTransactionAction({
      type: 'expense',
      walletId: 'wallet-123',
      categoryId: 'cat-456',
      amount: -10000,
      transactionDate: '2026-08-23',
    });

    expect(result.success).toBe(false);
  });
});
```

---

### 3.3 AI OCR & Parser Mock Testing
File: `tests/integration/ai-receipt-scanner.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { scanReceiptAction } from '@/features/ai/actions';

describe('AI Receipt Vision Scanner Action', () => {
  it('harus memvalidasi output skema Zod dari payload OCR', async () => {
    const mockFile = new File(['fake-image-bytes'], 'receipt.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('receipt', mockFile);

    const result = await scanReceiptAction(formData);
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('totalAmount');
    expect(result.data).toHaveProperty('merchantName');
  });
});
```

---

### 3.4 Security & RLS Test: Multi-Tenant Data Isolation
File: `supabase/tests/rls_isolation.sql`

```sql
BEGIN;
SELECT plan(3);

-- Setup Mock Data
-- Family A (User A), Family B (User B)

-- Test 1: User A membaca transaksi Family A (Harus Berhasil)
SET LOCAL request.jwt.claim.sub = 'user-a-uuid';
SELECT is(
    (SELECT count(*)::int FROM public.transactions WHERE family_id = 'family-a-uuid'),
    5,
    'User A dapat melihat seluruh 5 transaksi keluarganya sendiri'
);

-- Test 2: User A mencoba membaca transaksi Family B (Harus Mengembalikan 0 baris)
SELECT is(
    (SELECT count(*)::int FROM public.transactions WHERE family_id = 'family-b-uuid'),
    0,
    'User A TIDAK BISA melihat transaksi milik Family B (RLS Blocked)'
);

-- Test 3: User B mencoba menyisipkan transaksi ke Family A (Harus Gagal / Ditolak)
SET LOCAL request.jwt.claim.sub = 'user-b-uuid';
PREPARE insert_illegal AS 
INSERT INTO public.transactions (family_id, user_id, type, amount, transaction_date)
VALUES ('family-a-uuid', 'user-b-uuid', 'expense', 100000, CURRENT_DATE);

SELECT throws_ok(
    'insert_illegal',
    'new row violates row-level security policy for table "transactions"',
    'User B dilarang menyisipkan transaksi ke Family A'
);

SELECT * FROM finish();
ROLLBACK;
```

---

### 3.5 End-to-End (E2E) Test: Alur Kritis Pengguna (Playwright)
File: `tests/e2e/family-workflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('End-to-End Critical Financial Flow', () => {
  test('Pengguna dapat login, menambah transaksi pengeluaran, dan melihat budget terupdate', async ({ page }) => {
    // 1. Buka aplikasi & login
    await page.goto('/login');
    await page.click('button:has-text("Masuk dengan Google")');
    
    // 2. Verifikasi masuk ke Dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');

    // 3. Tambah Pengeluaran Baru
    await page.click('button:has-text("Tambah Pengeluaran")');
    await page.fill('input[name="amount"]', '75000');
    await page.selectOption('select[name="walletId"]', { label: 'BCA Utama' });
    await page.selectOption('select[name="categoryId"]', { label: 'Makanan & Minuman' });
    await page.fill('input[name="description"]', 'Makan Siang Bersama Keluarga');
    await page.click('button[type="submit"]:has-text("Simpan Transaksi")');

    // 4. Verifikasi Toast Notifikasi & Ledger Transaksi
    await expect(page.locator('.sonner-toast')).toContainText('Transaksi berhasil disimpan');
    await expect(page.locator('table')).toContainText('Makan Siang Bersama Keluarga');
    await expect(page.locator('table')).toContainText('-Rp 75.000');

    // 5. Verifikasi Widget Budget Terupdate
    await page.goto('/budgeting');
    await expect(page.locator('.budget-card:has-text("Makanan & Minuman")')).toBeVisible();
  });
});
```

---

## 4. Perintah Eksekusi Pengujian (CLI Commands)

```bash
# Menjalankan seluruh Unit & Integration Test
npm run test

# Menjalankan Test dengan pemantauan perubahan file (Watch Mode)
npm run test:watch

# Menghasilkan Laporan Code Coverage
npm run test:coverage

# Menjalankan End-to-End Tests dengan UI Runner
npx playwright test --ui

# Menjalankan Pengujian Keamanan RLS di Supabase Lokal
npx supabase test db
```

---

## 5. Integrasi CI/CD Automated Testing (GitHub Actions)

Setiap Pull Request ke branch `main` wajib lolos tahapan otomatis:
1. **Type Check**: `npx tsc --noEmit`
2. **Lint**: `npm run lint`
3. **Unit & Integration Test**: `npm run test:coverage` (Threshold: min 80%)
4. **E2E Playwright Suite**: Eksekusi test di lingkungan browser headless.
5. **A11y Automated Scan**: Memastikan 0 pelanggaran aksesibilitas WCAG 2.1 AA.
