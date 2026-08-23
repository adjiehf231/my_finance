# 🎨 UI/UX Design System & Specification
## My Finance — Modern Family Financial Experience

---

## 1. Design Vision & Direction

**My Finance** dirancang sebagai platform pengelolaan keuangan keluarga dengan arahan desain:

### 🌟 Design Direction Checklist:
- **Modern**: Tampilan kontemporer, bersih, dan segar.
- **Minimalist**: Menghilangkan distraksi visual, fokus pada kejelasan data keuangan.
- **Elegant**: Estetika premium dengan rasio kontras tinggi dan aksen warna harmonis.
- **Gen-Z Friendly**: Interaksi dinamis, micro-interactions, badge visual, dan ilustrasi modern.
- **Professional Finance Experience**: Angka finansial disajikan presisi, terpercaya, dan aman.
- **Easy to Understand**: Menghindari istilah akuntansi rumit (debit/kredit diubah menjadi Pemasukan/Pengeluaran).
- **Intuitive Navigation**: Navigasi alami dengan akses satu jempol di smartphone (*Thumb Zone*).
- **Mobile-First**: Dioptimalkan pertama kali untuk perangkat genggam, lalu diskalakan ke desktop.
- **Responsive**: Transisi mulus di berbagai resolusi layar (320px hingga 4K).
- **Clear Visual Hierarchy**: Tipografi Display besar untuk saldo utama, kartu modul untuk rincian data.
- **Card-Based Interface**: Setiap metrik dan ringkasan dibungkus dalam kartu modular yang rapi.
- **Consistent Spacing**: Menerapkan kelipatan 4px / 8px grid system (*Tailwind spacing scale*).
- **Accessible Typography**: Font Google (Plus Jakarta Sans / Inter) yang mudah dibaca dengan kontras WCAG AA.
- **Meaningful Data Visualization**: Visualisasi grafik Recharts interaktif yang relevan dan dapat ditindaklanjuti.

> 🚫 **Prinsip Penting**: *The interface must avoid an overly complex accounting-software appearance* (Hindari tampilan spreadsheet kaku seperti software akuntansi lawas).

---

## 2. Theme & Internationalization (i18n)

### 🌓 Theme Selector
Sistem menyediakan pemilih tema terintegrasi (`next-themes`):
- **Light Mode**: Nuansa latar cerah dan bersih (*Slate 50*).
- **Dark Mode**: Nuansa gelap elegan hemat baterai (*Midnight Slate 900*).
- **System Default**: Mengikuti preferensi tema perangkat pengguna secara otomatis.

### 🌐 Language Selector & Localization
Aplikasi mendukung multi-bahasa terstruktur:
- **Bahasa Indonesia (`id`)** (Default)
- **English (`en`)**

> ⚠️ **Aturan Lokalisasi String**: Seluruh teks antarmuka (label tombol, dialog, placeholder, validasi, toast) **wajib menggunakan translation keys / localization dictionary** (misal: `t('dashboard.total_balance')`) dan dilarang keras menggunakan *hardcoded strings*, sehingga penambahan bahasa baru di masa depan dapat dilakukan tanpa mengubah kode komponen.

---

## 3. Responsive Layout Architecture

### 📱 Mobile-First Principles
- **Compact Header**: Menampilkan sapaan nama pengguna, avatar, tombol notifikasi, dan status keluarga.
- **Responsive Cards**: Kartu saldo yang dapat digeser (*swipeable horizontal carousel*).
- **Mobile-Friendly Forms**: Input nominal besar, picker kategori visual, dan tombol simpan di area jangkauan jempol bawah.
- **Swipe / Scroll-Friendly Tables**: Tabel transaksi yang otomatis beralih menjadi format kartu vertikal (*Card Stream*) di layar sempit.
- **Recommended Mobile Bottom Navigation Bar (5 Tab Utama)**:
  1. 🏠 **Home** (Dashboard)
  2. 💸 **Transactions** (Histori & Pencatatan)
  3. 🎯 **Budget** (Anggaran Bulanan)
  4. 🏆 **Goals** (Target Tabungan)
  5. 👤 **Profile** (Profil & Pengaturan)

### 💻 Desktop Layout
- **Collapsible Sidebar Navigation**: Navigasi vertikal tetap (lebar 240px) di sisi kiri.
- **Dashboard Content**: Tata letak multi-kolom (*grid 3-column / 4-column cards*).
- **Multi-Column Cards & Charts**: Komposisi berdampingan antara grafik arus kas dan distribusi kategori pengeluaran.

```
+----------------------------------------------------------------------------------------+
|  [Logo My Finance]   |  [Family Selector ▼]   [+ Quick Add]   [🔔] [🌙/☀️] [Avatar]     |
+----------------------+-----------------------------------------------------------------+
|  [Sidebar Nav]       |  [Dashboard Multi-Column Content Area]                          |
|  - 🏠 Dashboard      |  +------------------------------------------------------------+ |
|  - 💳 Wallets        |  | Total Balance Card | Income Card | Expense Card | Net Flow | |
|  - 💸 Transactions   |  +------------------------------------------------------------+ |
|  - 🎯 Budgeting      |  +-------------------------------+ +------------------------+  |
|  - 🏆 Goals          |  | Cash Flow Trend Chart         | | Expense by Category    |  |
|  - 📊 Reports        |  | (Recharts Area Chart)         | | (Recharts Donut Chart) |  |
|  - 👨‍👩‍👧 Family         |  +-------------------------------+ +------------------------+  |
|  - ⚙️ Settings       |  +------------------------------------------------------------+ |
|                      |  | Recent Transactions Ledger Table                           | |
|                      |  +------------------------------------------------------------+ |
+----------------------+-----------------------------------------------------------------+
```

```
[Mobile Viewport < 768px]
+------------------------------------------+
| [Avatar] Hi, Sarah! 👋       [🔔] [🌙]   |
| Family: Adjie Family                     |
+------------------------------------------+
| [Total Balance Card - Swipeable Wallets] |
| Rp 45.800.000                            |
| 🟢 +Rp18.5jt   🔴 -Rp9.2jt               |
+------------------------------------------+
| [Quick Action Pill Buttons]              |
| [➕ Pemasukan] [➖ Pengeluaran] [🔁 Transfer] |
+------------------------------------------+
| [Budget Progress Snapshot]               |
| 🛒 Dapur: 70% [=======>   ] Rp2.1jt/3.0jt|
+------------------------------------------+
| [Recent Transactions List]               |
| • Grab Food          -Rp45.000   14:20   |
| • Transfer ke GoPay   Rp500.000  11:00   |
| • Gaji Adjie        +Rp15.000.000 01/08  |
+------------------------------------------+
| [Mobile Bottom Navigation Bar (5 Tabs)]  |
| [ 🏠 Home | 💸 Trans | 🎯 Budget | 🏆 Goals | 👤 Profile ] |
+------------------------------------------+
```

---

## 4. Screen-by-Screen UI Specifications

---

### 4.1 Onboarding Wizard (7-Step Guide)
Untuk menyambut keluarga baru, wizard interaktif memandu setup tanpa friksi:
1. **Welcome Screen**: Pengenalan nilai aplikasi & ilustrasi minimalis.
2. **Create / Join Family**: Pilihan membuat ruang kerja baru atau memasukkan 6-digit invite code.
3. **First Wallet Setup**: Memasukkan rekening utama (misal: "BCA Tabungan" atau "Kas Tunai").
4. **Initial Balance**: Mengisi nominal saldo awal.
5. **Monthly Budget**: Memilih 3 kategori pengeluaran utama dan menetapkan limit bulanan.
6. **Financial Goal**: Menentukan target tabungan pertama (misal: "Dana Darurat").
7. **Workspace Ready Celebration**: Konfeti animasi dan tombol "Buka Dashboard".

---

### 4.2 Quick Action Transaction Drawer / Modal
- **Pilihan Jenis Transaksi**: Tab Segmented (`Pemasukan` / `Pengeluaran` / `Transfer`).
- **Nominal Input**: Ukuran font besar (*Large Display Input*) dengan format pemisah ribuan otomatis (IDR: `Rp 150.000`).
- **Date Picker**: Default `Hari Ini`, dengan opsi pemilihan kalender cepat.
- **Wallet & Category Picker**: Dropdown visual dengan ikon dan warna penanda.
- **Attachment Dropzone**: Pratinjau gambar struk dengan tombol kamera / upload cepat.

---

### 4.3 Budgeting Interface
- **Tampilan Kartu Berwarna Dinamis**:
  - Hijau jika penggunaan < 70%.
  - Oranye jika 70% - 90%.
  - Merah menyala dengan badge `OVERBUDGET` jika > 100%.
- **Progress Bar Beranimasi**: Menggunakan transisi CSS halus (*linear interpolation*).

---

### 4.4 Financial Goals Interface
- **Visual Goal Card**: Progress lingkaran persentase (*Radial Progress Bar*).
- **Target Deadline Badge**: Menampilkan jumlah hari tersisa (misal: `Tersisa 45 hari`).
- **Tombol "Tambah Tabungan"**: Membuka modal kontribusi instan yang memotong saldo dari wallet yang dipilih.

---

### 4.5 Reports & Analytics Screen
- **Filter Periode Cepat**: Bulan Ini, Bulan Lalu, 3 Bulan Terakhir, 1 Tahun, atau Kustom.
- **Chart Interaktif**: Tooltip dinamis yang menampilkan nominal rupiah lengkap saat cursor melayang (*hover*).
- **Export Bar**: Tombol `Export PDF`, `Export Excel (.xlsx)`, dan `Export CSV`.

---

### 4.6 AI Smart Interfaces (Vision OCR & Chat Advisor)
- **📸 Smart Receipt Camera Modal**:
  - Tampilan viewfinder kamera responsif dengan framing pemindaian struk otomatis.
  - Efek animasi *scan beam line* saat AI Vision memproses nota.
  - Formulir hasil ekstraksi dengan lencana (*badge*) penanda kecocokan AI (*Confidence Match Tag*) dan opsi satu klik "Konfirmasi & Simpan".
- **🎙️ Voice & Natural Language Bar**:
  - Tombol mikrofon dengan visualisasi gelombang audio (*audio wave waveform*) saat merekam suara.
  - Kotak input percakapan dengan saran template cepat (misal: *"Beli bensin 50rb pakai GoPay"*).
- **💬 Family Financial Advisor Drawer / Floating Widget**:
  - Tombol mengambang (*FAB*) berikon robot/bintang cerdas di pojok kanan bawah.
  - Antarmuka chat modern dengan efek teks mengalir (*streaming text animation*) dan kartu ringkasan interaktif.

---

## 5. Feedback, Empty States & Skeletons

### 5.1 Empty States
Setiap halaman memiliki ilustrasi dan pesan panduan yang ramah ketika belum ada data:
- **Belum Ada Transaksi**: *"Belum ada transaksi bulan ini. Catat pengeluaran atau pemasukan pertamamu!"* + Tombol `[+ Tambah Transaksi]`.
- **Belum Ada Budget**: *"Atur batas anggaran bulanan agar pengeluaran keluarga tetap terkendali."* + Tombol `[+ Buat Budget]`.
- **Belum Ada Goal**: *"Wujudkan impian keluarga dengan menetapkan target tabungan pertamamu."* + Tombol `[+ Buat Financial Goal]`.

### 5.2 Skeleton Loaders
Saat data sedang diambil dari Supabase via Server Components, sistem menampilkan layout placeholder abu-abu (*shimmer effect*) yang menyerupai bentuk kartu asli untuk mencegah *layout shift (CLS)*.

### 5.3 Toast Notifications
Menggunakan **Sonner** untuk feedback instan:
- ✅ *Transaksi berhasil disimpan!*
- ⚠️ *Peringatan: Anggaran Makan & Minum telah mencapai 85%!*
- ❌ *Gagal mengunggah struk. Ukuran file maksimal 5MB.*

---

## 6. Accessibility & Inclusivity (WCAG 2.1 AA)

- **Color Contrast**: Rasio kontras teks terhadap latar belakang minimal `4.5:1` untuk teks normal dan `3:1` untuk teks besar.
- **Focus Rings**: Seluruh elemen interaktif memiliki `focus-visible:ring-2 focus-visible:ring-emerald-500` untuk kemudahan navigasi keyboard.
- **Screen Reader Support**: Atribut `aria-label`, `aria-expanded`, dan `role="status"` disematkan pada seluruh dialog dan indikator progres.
