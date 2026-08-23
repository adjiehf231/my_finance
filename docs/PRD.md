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

### 5.3 Modul Transaksi (*Transactions Engine*) (FR-03)
- **FR-03.1**: Pencatatan tiga jenis transaksi:
  - **Income**: Menambah saldo dompet tujuan, dihitung dalam arus kas masuk.
  - **Expense**: Mengurangi saldo dompet sumber, dihitung dalam arus kas keluar.
  - **Transfer**: Memindahkan saldo dari `from_wallet_id` ke `to_wallet_id` tanpa memengaruhi total pendapatan/pengeluaran keluarga.
- **FR-03.2**: Pengunggahan bukti transaksi (nota/struk) format JPG, PNG, WEBP, atau PDF (maksimal 5MB) ke Supabase Storage.
- **FR-03.3**: Pencarian dan filter transaksi multi-parameter: rentang tanggal, jenis transaksi, kategori, dompet, anggota pembuat, dan nominal.
- **FR-03.4**: Fitur Transaksi Berulang (*Recurring Transactions*) dengan frekuensi Harian, Mingguan, Bulanan, atau Tahunan.

### 5.4 Modul Anggaran (*Budgeting*) (FR-04)
- **FR-04.1**: Penetapan batas anggaran per bulan per kategori (*Family + Month (YYYY-MM) + Category + Limit*).
- **FR-04.2**: Perhitungan persentase realisasi otomatis: `(actual_expense / budget_limit) * 100%`.
- **FR-04.3**: Penandaan status visual:
  - `Aman` (< 70%)
  - `Waspada` (70% - 90%)
  - `Bahaya / Overbudget` (> 100%)

### 5.5 Modul Target Finansial (*Financial Goals*) (FR-05)
- **FR-05.1**: Pembuatan target finansial dengan target dana, batas waktu (*deadline*), prioritas, ikon, dan deskripsi.
- **FR-05.2**: Buku besar alokasi tabungan (*goal_contributions*) untuk mencatat penyisihan saldo dompet ke dalam target dana.
- **FR-05.3**: Pemantauan progres akumulasi dana dan estimasi waktu pencapaian target.

### 5.6 Modul Dashboard & Analitik (FR-06)
- **FR-06.1**: Summary Cards: Total Likuiditas (*Total Balance*), Pemasukan Bulan Ini, Pengeluaran Bulan Ini, *Net Cash Flow*, Total Tabungan, Total Kewajiban/Cicilan.
- **FR-06.2**: Visualisasi Grafik Interaktif (Recharts):
  - Arus kas bulanan (Income vs Expense bar chart).
  - Distribusi pengeluaran per kategori (Donut / Pie chart).
  - Kontribusi pengeluaran per anggota keluarga (Stacked bar chart).
  - Pelacakan progress anggaran dan target tabungan.
- **FR-06.3**: Algoritma **Financial Health Score** (Skala 0 - 100) berdasarkan rasio tabungan, ketertiban anggaran, dan rasio utang.
- **FR-06.4**: Perhitungan **Net Worth** (`Total Assets - Total Liabilities`).

### 5.7 Modul Ekspor & Pelaporan (FR-07)
- **FR-07.1**: Ekspor Laporan Keuangan format **PDF** berdesain rapi untuk arsip bulanan keluarga.
- **FR-07.2**: Ekspor data mentah terstruktur format **Excel (.xlsx)** dan **CSV**.

### 5.8 Modul Pengaturan & Lokalisasi (FR-08)
- **FR-08.1**: Tema antarmuka: *Light*, *Dark*, dan *System Default*.
- **FR-08.2**: Pengaturan bahasa: Bahasa Indonesia (`id`) & English (`en`).
- **FR-08.3**: Konfigurasi mata uang default (`IDR`) dan zona waktu default (`Asia/Jakarta`).

### 5.9 Modul Kecerdasan Buatan / AI Financial Assistant (FR-09)
- **FR-09.1 (Smart Receipt OCR)**: Ekstraksi otomatis nominal, tanggal, merchant, dan rekomendasi kategori dari foto struk belanja via Vision AI.
- **FR-09.2 (Natural Language & Voice Input)**: Pencatatan transaksi kilat melalui teks percakapan biasa atau transkripsi pesan suara via LLM Function Calling.
- **FR-09.3 (Interactive Financial Advisor)**: Chatbot asisten finansial interaktif yang menganalisis cash flow keluarga dan menjawab pertanyaan strategis secara kontekstual dan aman.
- **FR-09.4 (Predictive Anomaly & Burn-Rate Alert)**: Deteksi dini laju pengeluaran abnormal dan proyeksi potensi overbudget sebelum akhir bulan.
- **FR-09.5 (Monthly Family Narrative Digest)**: Pembuatan ringkasan narasi pencapaian tabungan dan evaluasi keuangan keluarga bulanan.

---

## 6. Non-Functional Requirements (NFR)

### 6.1 Keamanan & Privasi Data
- **NFR-01 (Database Isolation)**: Seluruh tabel dilindungi oleh **PostgreSQL Row Level Security (RLS)**. Data antar-keluarga terisolasi total secara kriptografis & logis.
- **NFR-02 (Enkripsi Transmisi & Storage)**: Seluruh komunikasi menggunakan HTTPS (TLS 1.3). File struk pada Supabase Storage dilindungi RLS dan URL bertanda tangan (*Signed URLs*).
- **NFR-03 (Audit Trail)**: Setiap perubahan data krusial dicatat dalam `activity_logs`.
- **NFR-04 (AI Data Privacy & PII Scrubbing)**: Data pribadi sensitif disamarkan sebelum dikirim ke AI API, dan data pengguna tidak digunakan untuk pelatihan model.

### 6.2 Performa & Keandalan
- **NFR-05 (Response Time)**: Waktu muat halaman pertama (*First Contentful Paint*) `< 1.2 detik` pada koneksi 4G standar.
- **NFR-06 (Server Actions)**: Eksekusi transaksi database selesai dalam waktu `< 300 ms`.
- **NFR-07 (Uptime Target)**: SLA ketersediaan sistem `99.9%` didukung oleh infrastruktur Vercel Serverless & Supabase Cloud.

### 6.3 Aksesibilitas, Responsivitas & Kualitas Otomatisasi
- **NFR-08 (Mobile-First)**: Responsif sempurna dari layar smartphone (min. 320px) hingga layar desktop ultra-wide (4K).
- **NFR-09 (A11y)**: Memenuhi standar **WCAG 2.1 Level AA** untuk rasio kontras warna, pembaca layar (*screen reader*), dan navigasi keyboard.
- **NFR-10 (QA Automation Coverage)**: Minimal **80% code coverage** pada pipeline CI/CD (Vitest, Playwright, pgTAP).

---

## 7. Batasan & Edge Cases

| Skenario Edge Case | Solusi Sistem |
|---|---|
| User menghapus dompet yang memiliki riwayat ratusan transaksi. | Mencegah *hard delete*. Sistem memberlakukan *soft delete / archiving* (`is_active = false`) agar integritas saldo masa lalu tetap valid. |
| Transfer antar-dompet dengan mata uang berbeda. | Pada fase MVP, seluruh akun dibatasi dalam satu mata uang basis keluarga (default: IDR). |
| Pengeluaran melebihi saldo dompet yang tersedia. | Sistem memberikan peringatan (*warning dialog*), namun tetap mengizinkan transaksi tercatat (saldo negatif pada wallet khusus seperti kartu kredit atau talangan). |
| Dua anggota keluarga mengedit anggaran yang sama bersamaan. | Menggunakan transaksi database PostgreSQL dengan status penguncian optimis (*optimistic concurrency*) dan validasi timestamp `updated_at`. |
| User keluar (*leave family*) yang merupakan satu-satunya Owner. | Sistem mewajibkan Owner mentransfer hak kepemilikan (*transfer ownership*) ke admin lain sebelum dapat meninggalkan workspace. |
| Gambar struk buram atau rusak saat dipindai AI OCR. | Sistem memberikan notifikasi kegagalan ramah dan beralih otomatis ke mode input manual dengan foto tetap terlampir. |

---

## 8. MVP Success Metrics & KPI

1. **User Activation Rate**: > 85% pengguna baru berhasil menyelesaikan Onboarding Wizard dan mencatat minimal 1 transaksi dalam 48 jam pertama.
2. **Data Integrity Score**: 100% konsistensi saldo dompet terhadap jumlah akumulasi transaksi (*Zero Drift*).
3. **AI Logging Adoption**: > 50% transaksi belanja offline dicatat menggunakan fitur AI Vision OCR / Natural Language input.
4. **Monthly Retention**: > 70% keluarga aktif mencatat transaksi secara rutin setiap minggunya.
5. **QA Test Pass Rate**: 100% lolos automated test gates pada pipeline rilis CI/CD.
