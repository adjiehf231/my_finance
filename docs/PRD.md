# 📋 Product Requirements Document (PRD)
## My Finance — Family Finance Management Web Application

---

## 1. Executive Summary & Product Vision

### 1.1 Product Summary
**My Finance** adalah aplikasi web manajemen keuangan keluarga berbasis *shared workspace* yang dirancang untuk membantu keluarga modern mencatat transaksi harian, mengelola anggaran (*budgeting*), merencanakan target tabungan (*financial goals*), memantau likuiditas multi-rekening (*multi-wallet*), melacak kekayaan bersih (*net worth*), serta menganalisis kesehatan finansial keluarga secara *real-time*, aman, dan kolaboratif.

### 1.2 Product Vision
> *"Menjadi platform manajemen finansial keluarga modern terdepan yang memberdayakan setiap rumah tangga untuk mencapai kemandirian dan kestabilan finansial melalui kolaborasi transparan, otomatisasi cerdas, dan wawasan data yang dapat ditindaklanjuti."*

---

## 2. Problem Statement & Value Proposition

### 2.1 Problem Statement
1. **Pencatatan Terisolasi (*Siloed Records*)**: Suami dan istri sering mencatat pengeluaran masing-masing di aplikasi atau catatan pribadi yang terpisah, menyulitkan visibilitas arus kas keluarga secara komprehensif.
2. **Ketiadaan Visibilitas Saldo Multi-Akun**: Dana keluarga tersebar di kas tunai, berbagai rekening bank, e-wallet, dan instrumen investasi, menyebabkan kebingungan mengenai total likuiditas nyata.
3. **Kebocoran Anggaran (*Budget Overspending*)**: Tidak adanya sistem pemantauan batas pengeluaran (*budget alerts*) membuat keluarga sering melebihi batas pengeluaran bulanan tanpa disadari.
4. **Target Tabungan Tanpa Arah**: Rencana tabungan (dana darurat, liburan, pendidikan anak) tidak memiliki buku alokasi terstruktur (*goal contributions ledger*).
5. **Kurangnya Analisis Keuangan**: Banyak aplikasi hanya berfokus pada pencatatan transaksi sederhana (*expense tracking*) tanpa memberikan penilaian kesehatan finansial (*financial health score*) atau pelacakan kekayaan bersih (*net worth*).

### 2.2 Value Proposition
- **Shared Workspace yang Aman**: Satu ruang kerja keuangan keluarga terpusat berbasis `family_id` dengan kontrol hak akses berjenjang (Role-Based Access Control) dan perlindungan data tingkat database (PostgreSQL Row Level Security).
- **Pencatatan Finansial Holistik**: Mendukung transaksi Pemasukan (*Income*), Pengeluaran (*Expense*), dan Transfer Antar-Dompet (*Transfer*) dengan lampiran bukti struk.
- **Sistem Anggaran Cerdas**: Alokasi anggaran bulanan dinamis dengan peringatan visual bergradasi (Aman, Waspada, Bahaya).
- **Pengalaman Pengguna Modern & Mobile-First**: Antarmuka responsif bernuansa minimalis, mendukung Light/Dark Mode, serta lokalisasi multibahasa (ID/EN).

---

## 3. User Personas & Target Audience

| Persona | Profil & Kebutuhan | Peran di My Finance |
|---|---|---|
| **Adjie (32 thn, Kepala Keluarga)** | Pencari nafkah utama, memiliki beberapa rekening bank dan instrumen investasi. Ingin memantau total saldo keluarga, cash flow bulanan, alokasi dana darurat, dan net worth. | **Owner / Admin** |
| **Sarah (30 thn, Pasangan / Pengelola Anggaran)** | Mengelola belanja harian rumah tangga, tagihan utilitas, dan cicilan. Membutuhkan pencatatan cepat struk belanja di ponsel dan notifikasi saat anggaran mendekati batas. | **Admin / Member** |
| **Rian (19 thn, Anggota Keluarga / Anak)** | Menerima uang saku bulanan. Perlu mencatat pengeluaran harian pribadi yang masuk dalam laporan keluarga tanpa memiliki izin mengubah alokasi budget utama. | **Member** |

---

## 4. User Journey & Core Workflows

### 4.1 Onboarding Flow
```
[User Login via Google OAuth]
            │
            ▼
[Cek Apakah User Sudah Memiliki Family?]
   ├─── TIDAK ───► [Pilihan: Buat Family Baru ATAU Masukkan Kode Undangan]
   │                     │
   │                     ▼
   │               [Setup Wizard: Tambah Rekening Pertama -> Atur Saldo Awal -> Atur Budget & Goal]
   │                     │
   │                     ▼
   └─── YA ──────► [Masuk ke Dashboard Utama Family Workspace]
```

### 4.2 Transaction Logging Flow
```
[Klik Quick Action: + Income / + Expense / + Transfer]
            │
            ▼
[Isi Form: Nominal, Tanggal, Wallet Sumber, Kategori, Deskripsi, Upload Struk (Opsional)]
            │
            ▼
[Validasi Client & Server (Zod Schema)]
            │
            ▼
[Eksekusi Database Transaction: Simpan Catatan + Update Saldo Wallet + Catat Audit Log]
            │
            ▼
[Real-time Update pada Dashboard & Indikator Budget]
```

---

## 5. Functional Requirements (FR)

### 5.1 Modul Autentikasi & Workspace Keluarga (FR-01)
- **FR-01.1**: Autentikasi aman menggunakan **Google OAuth** melalui Supabase Auth.
- **FR-01.2**: Auto-provisioning profil pengguna (`users`) pada saat pertama kali login.
- **FR-01.3**: Pembuatan ruang kerja keluarga (*Family Workspace*) dengan `family_id` unik.
- **FR-01.4**: Fitur undangan anggota keluarga menggunakan kode undangan (*Invitation Token*) atau email.
- **FR-01.5**: Manajemen Role berbasis RBAC:
  - **Owner**: Kontrol penuh workspace, mengelola anggota, mengubah role, menghapus workspace.
  - **Admin**: Menambah/mengedit/menghapus transaksi, rekening, budget, target finansial, serta mengundang member.
  - **Member**: Menambah transaksi harian, melihat dashboard, budget, dan progres tabungan.

### 5.2 Modul Rekening & Dompet (*Wallets*) (FR-02)
- **FR-02.1**: Pengguna dapat membuat dompet dengan kategori: `cash`, `bank`, `ewallet`, `credit_card`, `investment`, `other`.
- **FR-02.2**: Setiap dompet menyimpan `initial_balance` dan menghitung `current_balance` secara atomik.
- **FR-02.3**: Dukungan arsip/nonaktifkan (*soft delete / status active/inactive*) pada rekening yang tidak digunakan.
- **FR-02.4**: Dukungan kolom `account_number` (nomor rekening bank / no. HP e-wallet / nomor kartu) pada setiap dompet beserta tombol salin cepat (*one-click clipboard copy*).
- **FR-02.5 (Auto-Reconciliation)**: Fitur rekonsiliasi saldo dompet otomatis yang menghitung ulang total mutasi dari awal untuk memastikan akurasi saldo 100% tanpa drift.

### 5.3 Modul Transaksi (*Transactions Engine*) (FR-03)
- **FR-03.1**: Pencatatan tiga jenis transaksi:
  - **Income**: Menambah saldo dompet tujuan, dihitung dalam arus kas masuk.
  - **Expense**: Mengurangi saldo dompet sumber, dihitung dalam arus kas keluar.
  - **Transfer**: Memindahkan saldo dari `from_wallet_id` ke `to_wallet_id` dengan dukungan biaya admin otomatis.
- **FR-03.2**: Pengunggahan bukti transaksi (nota/struk) format JPG, PNG, WEBP, atau PDF (maksimal 5MB) ke Supabase Storage.
- **FR-03.3 (Deep Filtering)**: Pencarian dan filter transaksi multi-dimensi: rentang tanggal custom (date picker), rentang nominal min-max, tipe akun dompet, kategori multi-select, dan pencarian kata kunci real-time.
- **FR-03.4**: Fitur Transaksi Berulang (*Recurring Transactions*) dengan frekuensi Harian, Mingguan, Bulanan, atau Tahunan.
- **FR-03.5 (Currency Formatter)**: Auto-formatting input Rupiah real-time (`Rp 50.000`) pada seluruh form input nominal guna mencegah salah ketik nol.
- **FR-03.6 (Zero-Latency Optimistic UI)**: Pembaruan data instan di antarmuka tabel (0 ms delay) menggunakan React 19 `useOptimistic` saat operasi create, update, dan delete.

### 5.4 Modul Anggaran (*Budgeting*) (FR-04)
- **FR-04.1**: Penetapan batas anggaran per bulan per kategori (*Family + Month (YYYY-MM) + Category + Limit*).
- **FR-04.2**: Perhitungan persentase realisasi otomatis: `(actual_expense / budget_limit) * 100%`.
- **FR-04.3**: Penandaan status visual: `Aman` (< 70%), `Waspada` (70% - 90%), `Bahaya / Overbudget` (> 100%).
- **FR-04.4 (Smart Budget Warning Banner)**: Banner notifikasi visual interaktif di Dashboard utama saat salah satu kategori pengeluaran mendekati atau melampaui batas anggaran (80% / 100%).

### 5.5 Modul Target Finansial (*Financial Goals*) (FR-05)
- **FR-05.1**: Pembuatan target finansial dengan target dana, batas waktu (*deadline*), prioritas, ikon, dan deskripsi.
- **FR-05.2**: Buku besar alokasi tabungan (*goal_contributions*) untuk mencatat penyisihan saldo dompet ke dalam target dana.
- **FR-05.3**: Pemantauan progres akumulasi dana dan estimasi waktu pencapaian target.

### 5.6 Modul Dashboard & Analitik (FR-06)
- **FR-06.1**: Summary Cards: Total Likuiditas (*Total Balance*), Pemasukan Bulan Ini, Pengeluaran Bulan Ini, *Net Cash Flow*, Total Tabungan, Total Kewajiban/Cicilan.
- **FR-06.2**: Visualisasi Grafik Interaktif (Recharts): Arus kas bulanan, distribusi pengeluaran per kategori, dan kontribusi anggota keluarga.
- **FR-06.3**: Algoritma **Financial Health Score** (Skala 0 - 100) berdasarkan rasio tabungan, ketertiban anggaran, dan rasio utang.
- **FR-06.4**: Perhitungan **Net Worth** (`Total Assets - Total Liabilities`).
- **FR-06.5 (Interactive Financial Calculators)**: Suite kalkulator finansial interaktif di `/analytics`:
  - Kalkulator Target Dana Darurat (Emergency Fund Target).
  - Kalkulator Investasi & Bunga Majemuk (Compound Interest).
  - Simulasi Pelunasan Hutang Tercepat (*Debt Snowball vs Avalanche Method*).

### 5.7 Modul Ekspor & Pelaporan (FR-07)
- **FR-07.1 (Printable Monthly PDF Statement)**: Ekspor Laporan Keuangan format **PDF** resmi siap cetak berlayout rapi, menyertakan kop keluarga, tabel mutasi, dan ringkasan arus kas bulanan.
- **FR-07.2**: Ekspor data mentah terstruktur format **Excel (.xlsx)** dan **CSV**.
- **FR-07.3 (GDPR & UU PDP Data Takeout & Restore)**: Ekspor cadangan data utuh (JSON) dan pemulihan data cadangan (*Restore Backup*) ke dalam workspace.

### 5.8 Modul Pengaturan, Desain & Lokalisasi (FR-08)
- **FR-08.1**: Tema antarmuka: *Light*, *Dark*, dan *System Default*.
- **FR-08.2 (Dual-Language Switcher ID/EN)**: Tombol switch dwibahasa instan antara Bahasa Indonesia dan English dengan persistensi preference.
- **FR-08.3**: Konfigurasi mata uang default (`IDR`) dan zona waktu default (`Asia/Jakarta`).
- **FR-08.4 (Gen-Z Premium UI Redesign)**: Desain antarmuka modern non-AI generic dengan tipografi kontemporer (Outfit/Inter), aksen visual elegan, dan responsivitas mobile-first mutakhir.
- **FR-08.5 (Skeleton Shimmer Loading)**: Efek shimmer card placeholder transparan untuk transisi antar halaman instan tanpa blank spinner.

### 5.9 Modul Kecerdasan Buatan / AI Financial Assistant (FR-09)
- **FR-09.1 (Smart Receipt OCR)**: Ekstraksi otomatis nominal, tanggal, merchant, dan rekomendasi kategori dari foto struk belanja via Gemini Vision AI.
- **FR-09.2 (Batch / Multi-Receipt Upload)**: Kemampuan mengunggah 2–5 foto nota sekaligus untuk diekstrak dan didrafkan secara berurutan.
- **FR-09.3 (Real-Time Auto-Category Suggestion)**: AI memprediksi dan memilih kategori yang tepat secara instan saat pengguna mengetik deskripsi transaksi.
- **FR-09.4 (Weekly Spending Trends & AI Insights)**: Ringkasan narasi mingguan perbandingan pola belanja 7 hari terakhir beserta tips penghematan kontekstual.
- **FR-09.5 (One-Click Bill & Debt Due Reminders)**: Tombol pembuat template pengingat jatuh tempo hutang / tagihan berulang via WhatsApp Link dan Email.

### 5.10 Modul Kolaborasi Keluarga & Audit Observabilitas (FR-10)
- **FR-10.1 (Granular Family RBAC)**: Manajemen izin anggota keluarga dengan 4 level peran (Owner, Admin, Member, View-Only) serta pengaturan izin akses per dompet (*wallet-level permissions*).
- **FR-10.2 (Comprehensive Activity Audit Log)**: Halaman pelacakan riwayat aktivitas keluarga (`/activity`) yang mencatat siapa yang menambah, mengedit, atau menghapus data lengkap dengan timestamp.

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Keamanan & Privasi Data
- **NFR-01 (Database Isolation)**: Seluruh tabel dilindungi oleh **PostgreSQL Row Level Security (RLS)**. Data antar-keluarga terisolasi total.
- **NFR-02 (Enkripsi Transmisi & Storage)**: Komunikasi HTTPS (TLS 1.3), enkripsi AES-256 data cadangan, PIN Lock SHA-256.
- **NFR-03 (Audit Trail)**: Setiap penambahan, pengubahan, dan penghapusan data krusial tercatat dalam `activity_logs`.
- **NFR-04 (AI Data Privacy & PII Scrubbing)**: Data pribadi disamarkan sebelum dikirim ke AI API.

### 6.2 Performa & Keandalan
- **NFR-05 (Composite Indexing)**: Indeks komposit PostgreSQL pada kolom relasi utama memastikan query di bawah `50 ms` pada dataset skala besar.
- **NFR-06 (Response Time)**: Waktu muat halaman pertama (*FCP*) `< 1.0 detik`.
- **NFR-07 (Zero-Latency Optimistic UI)**: Reaktivitas antarmuka instan pada mutasi data.
- **NFR-08 (Uptime Target)**: SLA ketersediaan sistem `99.9%`.

---

## 7. MVP Success Metrics & KPI

1. **User Activation Rate**: > 85% pengguna baru berhasil menyelesaikan Onboarding Wizard dan mencatat transaksi dalam 24 jam.
2. **Data Integrity Score**: 100% konsistensi saldo dompet terhadap total mutasi (*Zero Drift*).
3. **AI Logging Adoption**: > 50% transaksi belanja dicatat menggunakan AI Multi-Receipt OCR / Auto-Category Suggestion.
4. **Monthly Retention**: > 75% keluarga aktif mencatat transaksi secara rutin setiap minggunya.
5. **QA Test Pass Rate**: 100% lolos automated unit & E2E test gates.
