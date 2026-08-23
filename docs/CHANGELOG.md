# 📝 Changelog & Release Notes
## My Finance — Family Finance Management Platform

Semua perubahan penting pada proyek **My Finance** akan didokumentasikan dalam berkas ini. Format penulisan mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan menganut prinsip [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🔮 Planned (Phase 5 & 6)
- **Recurring Transactions**: Penjadwalan transaksi rutin otomatis (gaji, tagihan bulanan, langganan).
- **Financial Health Score (0-100)**: Algoritma cerdas penilai kesehatan finansial keluarga berdasarkan rasio tabungan, disiplin anggaran, dan rasio utang.
- **Net Worth Tracking Engine**: Pelacakan nilai kekayaan bersih keluarga (*Total Assets - Total Liabilities*) dengan grafik tren historis.
- **Debt & Installment Management**: Modul khusus pelacakan sisa pokok pinjaman, bunga, dan tenggat waktu cicilan.
- **PWA (Progressive Web App)**: Dukungan instalasi ke home screen smartphone dengan service worker caching.
- **AI Financial Assistant**: Asisten pintar berbasis LLM untuk menganalisis anomali pengeluaran keluarga dan memberikan saran penghematan.

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
