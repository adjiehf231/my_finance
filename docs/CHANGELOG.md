# 📝 Changelog & Release Notes
## My Finance — Family Finance Management Platform

Semua perubahan penting pada proyek **My Finance** akan didokumentasikan dalam berkas ini. Format penulisan mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan menganut prinsip [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] (Phase 7 – 10: Enterprise & Gen-Z Evolution)

### 🔮 Planned (Sprint 13 – 20)
- **Sprint 13 (Gen-Z Redesign & i18n)**: Redesign antarmuka modern non-AI generic, tipografi Outfit/Inter, glassmorphism halus, skeleton shimmer loading, dan tombol switch dwibahasa (ID/EN).
- **Sprint 14 (Currency Formatter & Optimistic UI)**: Auto-format rupiah real-time (`<CurrencyInput />`), React 19 `useOptimistic` 0 ms latency, dan global shortcut (`Ctrl+K` & `N`).
- **Sprint 15 (Deep Filters & Balance Reconciliation)**: Filter transaksi multi-kriteria, auto-rekonsiliasi saldo dompet, dan composite indexing PostgreSQL.
- **Sprint 16 (Budget Warning, Simulators & PDF)**: Smart Budget Warning Banner di Dashboard, kalkulator simulasi finansial (Dana Darurat, Compound Interest, Debt Snowball/Avalanche), dan Printable Monthly Financial Statement PDF.
- **Sprint 17 (Multi-Receipt & Auto-Categorization)**: Batch 2–5 struk belanja sekaligus via Gemini Vision OCR dan live auto-category predictor saat mengetik deskripsi.
- **Sprint 18 (Weekly AI Digest & Due Reminders)**: Wawasan tren pengeluaran mingguan AI dan one-click bill/debt due reminders (WhatsApp & Email).
- **Sprint 19 (Family RBAC & Member Management)**: Matriks peran berjenjang (Owner, Admin, Member, View-Only) dan pengaturan hak akses per-dompet.
- **Sprint 20 (Activity Audit Logs & Observability)**: Halaman pelacakan riwayat aktivitas keluarga (`/activity`) dengan timestamp dan diff viewer.

---

## [1.1.0] - 2026-08-26

### 🚀 Ditambahkan (Added)
- **Dukungan Nomor Rekening Dompet**: Penambahan kolom `account_number` pada seluruh tipe dompet (Bank, E-Wallet, Kartu) dengan tombol 1-klik *Copy to Clipboard* dan monospace badge.
- **Siklus Edit & Hapus Lengkap**: Seluruh 7 entitas data (Transaksi, Rekening, Anggaran, Target Tabungan, Hutang/Piutang, Transaksi Berulang, Kategori) kini memiliki modal edit dan aksi hapus aman.
- **Fitur Restore & Refresh Data di Pengaturan**: Fitur pemulihan data cadangan JSON (*Restore Backup*) dengan UUID remapping dan validasi skema menyeluruh.
- **Kepatuhan Next.js 15 Server Actions**: Refactor konstanta kategori bawaan ke `lib/constants/` untuk mematuhi regulasi `"use server"` export async.
- **Database Migration 00003**: Penambahan kolom `account_number` ke tabel `public.wallets`.

---

## [1.0.0] - 2026-08-23

### 🎉 Initial Production Release & Architecture Baseline

#### 🚀 Ditambahkan (Added)
- **Otentikasi & Keamanan**:
  - Integrasi otentikasi aman **Google OAuth 2.0** via Supabase Auth dengan alur PKCE.
  - Sesi SSR aman menggunakan cookie HTTP-Only via `@supabase/ssr` dan Next.js Middleware.
  - Sinkronisasi otomatis profil pengguna ke tabel `public.users` via trigger database `handle_new_user()`.
  - Penegakan **Row Level Security (RLS)** pada seluruh 12 tabel database PostgreSQL untuk isolasi total antar-keluarga.

- **Family Shared Workspace & RBAC**:
  - Ruang kerja terpusat keluarga berbasis `family_id` dengan kode undangan unik (`invite_code`).
  - Sistem peran berjenjang (*Role-Based Access Control*): `owner`, `admin`, dan `member`.
  - Manajemen anggota: undang member, ubah role, dan keluarkan anggota.

- **Manajemen Dompet / Rekening (Wallets)**:
  - Dukungan multi-rekening fleksibel: `cash`, `bank`, `ewallet`, `credit_card`, `investment`, dan `other`.
  - Perhitungan saldo atomik otomatis via database trigger `update_wallet_balance_on_transaction()`.
  - Fitur arsip dompet (*soft delete*) untuk menjaga integritas riwayat mutasi masa lalu.

- **Engine Transaksi Finansial**:
  - Pencatatan tiga tipe mutasi: **Pemasukan (Income)**, **Pengeluaran (Expense)**, dan **Transfer Antar-Dompet (Transfer)**.
  - Validasi ketat nominal, tanggal, dan rekening sumber/tujuan via skema Zod.
  - Penyimpanan bukti struk/nota terenkripsi di **Supabase Storage** bucket `receipts`.
  - Filter pencarian transaksi multi-parameter: rentang tanggal, kategori, dompet, jenis, dan pencarian kata kunci.

- **Sistem Anggaran Bulanan (Budgeting)**:
  - Penetapan limit anggaran per kategori per periode bulan (*Family + Month + Category + Limit*).
  - Indikator status visual adaptif:
    - 🟢 **Aman**: Realisasi `< 70%`
    - 🟡 **Waspada**: Realisasi `70% - 90%`
    - 🔴 **Bahaya / Overbudget**: Realisasi `> 100%`

- **Target Finansial & Tabungan (Financial Goals)**:
  - Pembuatan target dana impian keluarga (Dana Darurat, Rumah, Pendidikan Anak, Liburan).
  - Buku besar alokasi tabungan (`goal_contributions`) untuk mencatat penyisihan saldo dompet secara transparan.
  - Indikator progres radial dan estimasi waktu pencapaian target.

- **Dashboard Eksekutif & Visualisasi Data**:
  - Summary KPI cards: Total Likuiditas Saldo, Pemasukan Bulan Ini, Pengeluaran Bulan Ini, *Net Cash Flow*, dan *Savings Rate*.
  - Visualisasi grafik interaktif Recharts: Arus kas bulanan, komposisi kategori pengeluaran, dan kontribusi pengeluaran per anggota.

- **Pelaporan & Ekspor Data**:
  - Ekspor Laporan Keuangan formal berformat **PDF**.
  - Ekspor data mentah terstruktur berformat **Excel (.xlsx)** dan **CSV**.

- **Pengalaman Pengguna Modern**:
  - Desain antarmuka modern, minimalis, dan *mobile-first* dengan tema **Light Mode**, **Dark Mode**, dan **System Default**.
  - Lokalisasi multibahasa: **Bahasa Indonesia (`id`)** dan **English (`en`)**.
  - **7-Step Onboarding Wizard** untuk memandu pengguna baru menyiapkan keluarga dan rekening pertamanya.
  - Komponen aksesibel berstandar **WCAG 2.1 AA** berbasis Tailwind CSS & shadcn/ui.

- **Kecerdasan Buatan (AI Engine Subsystem)**:
  - Arsitektur **Smart Receipt Vision OCR** (Gemini 1.5 Flash) untuk ekstraksi data struk instan.
  - Modul **Natural Language & Voice Transaction Input** via LLM Function Calling.
  - **Interactive Family Financial Advisor** berbasis streaming context grounding.
  - Spesifikasi lengkap didokumentasikan di [docs/AI_SPECIFICATION.md](AI_SPECIFICATION.md).

- **Otomatisasi Kualitas & Pengujian (QA Automation)**:
  - Kerangka pengujian otomatis terpadu: **Vitest** (Unit/Integration), **Playwright** (E2E Multi-device), **pgTAP** (Database RLS), dan **Axe-core** (A11y).
  - Standar *Quality Gates* CI/CD GitHub Actions dengan ambang batas coverage minimal 80%.
  - Panduan lengkap didokumentasikan di [docs/QA_AUTOMATION.md](QA_AUTOMATION.md).
