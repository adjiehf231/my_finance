# 🏛️ Architecture & System Blueprint: My Finance

**My Finance** is an enterprise-grade, multi-tenant personal and family financial operating system built on Next.js 15 App Router, React 19, Supabase PostgreSQL, and Google Gemini AI.

---

## 1. High-Level Architecture

```
[ Client Layer (PWA / Mobile / Web Browser) ]
                    │
                    ▼
[ Next.js 15 Edge & Server Layer ]
   ├── Middleware (Auth Guard, Token Rotation, CSRF)
   ├── Server Components (Zero-Waterfall Data Hydration)
   ├── Server Actions (Zod Validation, RBAC Enforcement)
   └── API Route Handlers (Cron Recurring, Health, Sync)
                    │
                    ▼
[ Database Layer: Supabase (PostgreSQL 15+) ]
   ├── Row-Level Security (Multi-Tenant Family Isolation)
   ├── Database Triggers & Auto-Calculated Balances
   └── Composite Performance Indexes
                    │
                    ▼
[ AI Microservice: Google Gemini Vision ]
   └── Receipt OCR & Financial Advisor Engine
```

---

## 2. Multi-Tenant Security & Isolation Model

Every family workspace represents an isolated tenant in the database.

### 🛡️ Row-Level Security (RLS)
1. **Tenant Identification**: Every financial row (`wallets`, `transactions`, `budgets`, `goals`, `debts`) contains a `family_id` foreign key.
2. **Access Control**: PostgreSQL RLS policies evaluate `family_members` to verify that `auth.uid()` belongs to the `family_id` with `is_active = true`.
3. **No Cross-Tenant Leaks**: Even if a malicious request attempts to inject another family's UUID, PostgreSQL automatically returns 0 rows.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Capability / Module | Pemilik (Owner) | Administrator | Anggota (Member) | Peninjau (Viewer) |
| :--- | :---: | :---: | :---: | :---: |
| **Kelola Ruang Kerja & Hapus Keluarga** | ✅ Penuh | ❌ | ❌ | ❌ |
| **Ubah Peran & Hak Akses Anggota** | ✅ Penuh | ❌ | ❌ | ❌ |
| **Undang & Keluarkan Anggota** | ✅ | ✅ | ❌ (Dapat Diaktifkan) | ❌ |
| **Buku Kas Transaksi** | CRUD | CRUD (Kustom) | CRU (Kustom) | R (Lihat Saja) |
| **Rekening & Dompet** | CRUD | CRUD (Kustom) | R (Kustom) | R (Lihat Saja) |
| **Anggaran & Target Tabungan** | CRUD | CRUD (Kustom) | CRU (Kustom) | R (Lihat Saja) |
| **Hutang & Piutang** | CRUD | CRUD (Kustom) | CRU (Kustom) | R (Lihat Saja) |
| **Scan Struk AI Vision (OCR)** | ✅ | ✅ (Kustom) | ✅ (Kustom) | ❌ |
| **Ekspor Data (CSV / JSON)** | ✅ | ✅ (Kustom) | ❌ (Dapat Diaktifkan) | ❌ |

---

## 4. Key Performance Optimizations

1. **Sub-millisecond Query Indexes**:
   - `idx_transactions_family_date`: Composite index on `(family_id, date DESC)` for instant ledger pagination.
   - `idx_wallets_family_active`: Index on `(family_id, is_active)` for dashboard summary aggregation.
2. **Server-Side Rendering (SSR)**:
   - Dashboard, Wallets, and Reports pages fetch data directly on the server without client-side waterfall loading.
3. **Smart Optimistic UI**:
   - Immediate feedback on transaction entries with automatic rollback on network failure.
4. **Formula Injection Sanitization**:
   - All exported CSV & JSON takeout files sanitize potentially dangerous spreadsheet characters (`=`, `+`, `-`, `@`).

---

## 5. Automated Testing & Quality Assurance

* **Framework**: Vitest + React Testing Library.
* **Test Suites**: 31 test files, 110 automated tests covering:
  - Multi-role RBAC & Custom CRUD matrix
  - AI Receipt OCR parser
  - Wallets, Balances, & Currency Input formatting
  - Budget calculations & Debt reminders
  - Activity logging and reconciliation
