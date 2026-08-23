# 💰 My Finance - Family Finance Management Web Application

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **My Finance** adalah platform web modern untuk manajemen dan perencanaan keuangan keluarga terpadu (*Shared Workspace*). Dirancang dengan estetika minimalis, elegan, dan *mobile-first*, aplikasi ini memungkinkan suami, istri, dan anggota keluarga mencatat transaksi multi-rekening, mengelola anggaran (*budgeting*), menabung untuk target finansial (*goals*), melacak kekayaan bersih (*net worth*), serta menganalisis kesehatan keuangan keluarga secara *real-time* dan aman.

---

## 📌 Daftar Isi
- [✨ Fitur Utama](#-fitur-utama)
- [🏗️ Arsitektur Sistem & Tech Stack](#️-arsitektur-sistem--tech-stack)
- [📁 Struktur Folder](#-struktur-folder)
- [🚀 Panduan Memulai (Quick Start)](#-panduan-memulai-quick-start)
- [🔐 Konfigurasi Environment Variables](#-konfigurasi-environment-variables)
- [🗄️ Database & Migrasi Supabase](#️-database--migrasi-supabase)
- [🗺️ Dokumentasi Lengkap](#️-dokumentasi-lengkap)
- [👥 Kontribusi & Lisensi](#-kontribusi--lisensi)

---

## ✨ Fitur Utama

### 1. 👨‍👩‍👧‍👦 Family Shared Workspace & Multi-Role
- Ruang kerja terpusat berbasis `family_id` untuk seluruh anggota keluarga.
- Sistem hak akses berjenjang (RBAC):
  - **Owner**: Kontrol penuh workspace, invite/remove member, ganti role, konfigurasi akun & hapus workspace.
  - **Admin**: Mengelola transaksi, budget, goals, rekening, dan mengundang member.
  - **Member**: Menambahkan transaksi harian, melihat dashboard, budget, dan progress tabungan keluarga.

### 2. 💳 Multi-Wallet & Multi-Account Management
- Pemisahan sumber dana fleksibel: **Kas Tunai**, **Rekening Bank (BCA, Mandiri, dll)**, **E-Wallet (GoPay, OVO, ShopeePay)**, **Kartu Kredit**, hingga **Portofolio Investasi**.
- Perhitungan saldo atomik otomatis (*initial balance* + mutasi transaksi & transfer).
- Monitoring saldo per dompet dan total likuiditas keluarga.

### 3. 💸 Transaksi Lengkap (Income, Expense, Transfer)
- **Pemasukan (Income)**: Pencatatan gaji, bonus, dividen, freelance, dan bisnis sampingan.
- **Pengeluaran (Expense)**: Kategorisasi detail (kebutuhan dapur, utilitas listrik/air, transportasi, pendidikan, cicilan).
- **Transfer Antar-Akun**: Perpindahan dana antar-dompet tanpa mendistorsi arus kas (*net cash flow*).
- **Lampiran Struk/Nota**: Upload bukti transaksi ke Supabase Storage terenkripsi.
- **Transaksi Berulang (Recurring)**: Otomatisasi pengeluaran rutin bulanan (kontrak rumah, asuransi, tagihan internet).

### 4. 🎯 Budgeting & Dynamic Warning Alerts
- Alokasi anggaran bulanan per kategori (*Family + Month + Category + Limit*).
- Indikator visual pintar (*Progress Bar* & Status):
  - 🟢 **Aman**: Realisasi `< 70%`
  - 🟡 **Waspada**: Realisasi `70% - 90%`
  - 🔴 **Bahaya / Melebihi**: Realisasi `> 100%`

### 5. 🏆 Financial Goals & Alokasi Tabungan
- Rencana tabungan keluarga terarah (Dana Darurat, Rumah Impian, Liburan, Pendidikan Anak, Ibadah).
- Buku besar kontribusi (*goal_contributions*) yang mencatat setiap pengalihan dana dari wallet ke target tabungan.

### 6. 📊 Dashboard, Analytics & Health Score
- Kartu ringkasan finansial: Total Saldo, Pemasukan Bulan Ini, Pengeluaran Bulan Ini, *Net Cash Flow*, *Savings Rate*.
- Visualisasi interaktif dengan Chart modern (Recharts): Arus kas bulanan, komposisi pengeluaran per kategori, kontribusi pengeluaran per anggota keluarga.
- **Financial Health Score (0 - 100)**: Penilaian kesehatan keuangan keluarga berdasarkan rasio tabungan, disiplin anggaran, dan rasio utang.

### 7. 📑 Export Laporan (PDF, Excel & CSV)
- **PDF Report**: Desain formal dan rapi untuk arsip bulanan keluarga.
- **Excel (.xlsx) & CSV**: Ekspor data mentah terstruktur untuk analisis mendalam di spreadsheet.

### 8. 🌐 Pengalaman Pengguna Modern
- 🌓 **Dark Mode / Light Mode / System Default**.
- 🇮🇩 **Bilingual Localization**: Bahasa Indonesia & English.
- 📱 **Mobile-First & PWA Ready**: Navigasi bawah (*bottom bar*) di smartphone, *sidebar navigation* di desktop.
- 🧙‍♂️ **Interactive Onboarding Wizard**: Panduan praktis bagi pengguna baru untuk menyiapkan workspace keluarga dalam hitungan menit.

---

## 🏗️ Arsitektur Sistem & Tech Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │                  Next.js 16 Web Client                  │
   │  (React, TypeScript, Tailwind CSS, shadcn/ui, Recharts) │
   └────────────────────────────┬────────────────────────────┘
                                │
                      HTTPS / REST / Actions
                                │
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                     Vercel Edge/SSR                     │
   │     Next.js App Router Server Components & Actions      │
   └────────────────────────────┬────────────────────────────┘
                                │
                   Supabase Client SDK (PostgREST)
                                │
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │               Supabase Backend Platform                 │
   │  ┌──────────────────┐ ┌───────────────┐ ┌────────────┐  │
   │  │ PostgreSQL 15+   │ │ Supabase Auth │ │  Storage   │  │
   │  │ + RLS Multi-Tenant│ │ (Google OAuth)│ │ (Receipts) │  │
   │  └──────────────────┘ └───────────────┘ └────────────┘  │
   └─────────────────────────────────────────────────────────┘
```

| Layer | Teknologi | Deskripsi |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server Components, Server Actions, Dynamic Rendering |
| **Language** | TypeScript 5.x | *Strict Type-Safety*, *End-to-End type inference* |
| **Styling & UI** | Tailwind CSS 4 + shadcn/ui | Komponen aksesibel (Radix UI), kustomisasi desain modern |
| **Icons** | Lucide React | Icon set modern dan ringan |
| **Charts** | Recharts | Visualisasi data interaktif & responsif |
| **Forms & Validation** | React Hook Form + Zod | Validasi skema tipe data ketat pada client & server |
| **State Management** | Zustand | Global UI state (theme, active filter, sidebar state) |
| **Database & Auth** | Supabase (PostgreSQL 15+) | Database relasional dengan Row Level Security (RLS) & Google OAuth |
| **File Storage** | Supabase Storage | Penyimpanan aman lampiran struk/invoice |
| **Export Tools** | jsPDF / @react-pdf & SheetJS | Generator PDF & Excel |
| **Deployment** | Vercel | Hosting frontend otomatis dengan CI/CD |

---

## 📁 Struktur Folder

Proyek ini menggunakan struktur direktori terorganisir berbasis *feature-driven architecture*:

```
my_finance/
├── app/                        # Next.js App Router (Pages, Layouts, API Route Handlers)
│   ├── (auth)/                 # Route group untuk otentikasi (login, register, callback)
│   ├── (dashboard)/            # Route group untuk aplikasi utama (dashboard, wallets, transactions, dll.)
│   ├── api/                    # API endpoints & webhook handlers
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Landing page
├── components/                 # Shared UI & Reusable Components
│   ├── ui/                     # shadcn/ui primitive components (Button, Dialog, Card, etc.)
│   ├── layout/                 # Sidebar, Header, Mobile Nav, Footer
│   ├── charts/                 # Komponen visualisasi grafik (Recharts)
│   └── feedback/               # Modals, Toast notifications, Empty states, Skeleton loaders
├── features/                   # Domain / Feature Modules
│   ├── auth/                   # Komponen, hook, & helper login/session
│   ├── family/                 # Manajemen anggota keluarga & role
│   ├── wallets/                # CRUD rekening & saldo
│   ├── transactions/           # Pencatatan income, expense, transfer & upload struk
│   ├── budgeting/              # Perencanaan budget & progress tracker
│   ├── goals/                  # Financial goals & alokasi tabungan
│   ├── reports/                # Laporan keuangan & analytics
│   └── onboarding/             # Step-by-step setup wizard
├── hooks/                      # Custom React Hooks
├── lib/                        # Utility functions, Supabase client/server instances, helpers
├── services/                   # Database access layer, Server Actions, Supabase RPC calls
├── stores/                     # Zustand state stores
├── types/                      # TypeScript definitions & Supabase generated database types
├── schemas/                    # Zod validation schemas
├── config/                     # Konfigurasi aplikasi, navigation links, app metadata
├── locales/                    # File kamus multibahasa (i18n)
│   ├── id/                     # Bahasa Indonesia
│   └── en/                     # English
├── public/                     # Static assets (logo, icons, images)
├── supabase/                   # Konfigurasi Supabase
│   ├── migrations/             # File SQL migrasi skema tabel & RLS policies
│   ├── seed.sql                # Data awalan untuk testing/development
│   └── config.toml             # Konfigurasi Supabase CLI
├── tests/                      # Testing suite
│   ├── unit/                   # Unit test (Vitest)
│   ├── integration/            # Integration test
│   └── e2e/                    # End-to-End test (Playwright)
├── docs/                       # Dokumentasi Teknis Lengkap
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── AUTHENTICATION.md
│   ├── RLS.md
│   ├── UI_UX.md
│   ├── ROADMAP.md
│   ├── TESTING.md
│   ├── DEPLOYMENT.md
│   └── CHANGELOG.md
├── README.md                   # Dokumentasi Utama
└── package.json
```

---

## 🚀 Panduan Memulai (Quick Start)

### Prasyarat
- **Node.js**: `v20.x` atau lebih baru
- **Package Manager**: `npm` atau `pnpm`
- **Akun Supabase**: [supabase.com](https://supabase.com)
- **Google Cloud Console**: Untuk Google OAuth Client ID

### 1. Kloning Repositori
```bash
git clone https://github.com/adjiehf231/my_finance.git
cd my_finance
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Setup Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lengkapi variabel lingkungan sesuai dengan kredensial Supabase Anda.

### 4. Jalankan Supabase Migrations
Jalankan migrasi database ke Supabase lokal atau remote:
```bash
npx supabase db push
# Atau eksekusi script SQL yang berada di docs/DATABASE.md pada SQL Editor Supabase Dashboard
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## 🔐 Konfigurasi Environment Variables

File `.env.local` harus memiliki variabel berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="My Finance"

# Storage Bucket
NEXT_PUBLIC_STORAGE_BUCKET_RECEIPTS="receipts"
```

---

## 🗄️ Database & Migrasi Supabase

Database **My Finance** dibangun di atas PostgreSQL dengan fitur **Row Level Security (RLS)** yang ketat untuk menjamin keamanan multi-keluarga.

Daftar tabel utama:
1. `users` — Profil data pengguna (tersinkronisasi dari `auth.users`).
2. `families` — Entitas workspace keluarga.
3. `family_members` — Relasi member ke family beserta role (`owner`, `admin`, `member`).
4. `wallets` — Rekening & dompet sumber dana.
5. `categories` — Kategori pemasukan dan pengeluaran.
6. `transactions` — Catatan pemasukan, pengeluaran, dan transfer.
7. `budgets` — Anggaran bulanan per kategori.
8. `financial_goals` — Target finansial tabungan.
9. `goal_contributions` — Histori alokasi saldo ke target tabungan.
10. `recurring_transactions` — Transaksi berulang terjadwal.
11. `notifications` — Notifikasi sistem dan peringatan anggaran.
12. `activity_logs` — Audit log aktivitas keluarga.

> 📖 **Pelajari detail DDL, relasi ERD, dan trigger database di [docs/DATABASE.md](docs/DATABASE.md)**.

---

## 🗺️ Dokumentasi Lengkap

Dokumentasi arsitektur dan teknis mendalam tersedia di direktori `docs/`:

- 📋 [**PRD.md**](docs/PRD.md) — *Product Requirements Document* lengkap, user persona, user stories, dan acceptance criteria.
- 🏛️ [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) — Arsitektur sistem, data flow, pola Server Actions, dan modul sistem.
- 🗄️ [**DATABASE.md**](docs/DATABASE.md) — Skema database lengkap (DDL SQL), relasi ERD, index, function, dan trigger.
- 🔌 [**API.md**](docs/API.md) — Spesifikasi API contract, Next.js Server Actions, REST endpoints, dan request/response schema.
- 🔑 [**AUTHENTICATION.md**](docs/AUTHENTICATION.md) — Alur Google OAuth, session management, middleware auth, dan RBAC.
- 🛡️ [**RLS.md**](docs/RLS.md) — Kebijakan PostgreSQL Row Level Security (RLS) lengkap untuk keamanan data multi-tenant.
- 🎨 [**UI_UX.md**](docs/UI_UX.md) — Desain sistem, palet warna, tipografi, wireframe layout, micro-interactions, dan aksesibilitas.
- 🚀 [**ROADMAP.md**](docs/ROADMAP.md) — Rencana pengembangan bertahap (*Phases & Sprints*) dengan estimasi dan deliverables.
- 🧪 [**TESTING.md**](docs/TESTING.md) — Strategi pengujian unit, integrasi, E2E, test cases, dan code coverage.
- 🤖 [**QA_AUTOMATION.md**](docs/QA_AUTOMATION.md) — Kerangka kerja otomatisasi pengujian (Playwright, Vitest, Axe-core, pgTAP, CI/CD).
- 🤖 [**AI_SPECIFICATION.md**](docs/AI_SPECIFICATION.md) — Arsitektur AI Financial Advisor, Vision OCR Struk, dan Function Calling.
- 🚢 [**DEPLOYMENT.md**](docs/DEPLOYMENT.md) — Panduan deployment produksi ke Vercel & Supabase, CI/CD, backup & rollback.
- 📝 [**CHANGELOG.md**](docs/CHANGELOG.md) — Riwayat versi, rilis fitur, dan pembaruan sistem.

---

## 👥 Kontribusi & Lisensi

Proyek ini dikembangkan untuk memberikan solusi pengelolaan keuangan keluarga yang transparan, aman, dan modern. 

- **Repository**: [https://github.com/adjiehf231/my_finance](https://github.com/adjiehf231/my_finance)
- **Lisensi**: Proyek ini dilisensikan di bawah [MIT License](LICENSE).
