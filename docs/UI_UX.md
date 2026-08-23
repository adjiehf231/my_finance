# 🎨 UI/UX Design System & Specification
## My Finance — Modern Family Financial Experience

---

## 1. Design Vision & Principles

**My Finance** dirancang dengan filosofi visual **Modern, Minimalist, Elegant, and Gen-Z Friendly**. Aplikasi menjauhkan diri dari tampilan software akuntansi tradisional yang kaku dan membosankan, bertransformasi menjadi *financial hub* yang menyenangkan, intuitif, dan memberi rasa percaya diri (*financial empowerment*).

### Prinsip Utama Desain:
1. **Clarity over Complexity**: Angka-angka finansial disajikan dalam hierarki visual yang jelas, didukung kontras warna fungsional dan kartu (*card-based layout*).
2. **Mobile-First & Touch-Friendly**: Dirancang pertama kali untuk layar ponsel cerdas dengan navigasi jempol (*bottom bar*), area sentuh minimal 44x44px, dan form input yang ergonomis.
3. **Meaningful Visual Feedback**: Setiap status keuangan (Aman, Waspada, Overbudget) memiliki indikator visual yang intuitif tanpa menimbulkan kepanikan.
4. **Delightful Micro-interactions**: Transisi halus, animasi *skeleton loading*, konfeti saat mencapai target tabungan, dan *interactive charts* yang responsif.

---

## 2. Design System Tokens

### 2.1 Color Palette & Semantic Tokens

```
Light Mode:
- Background: #F8FAFC (Slate 50)
- Surface / Card: #FFFFFF (White)
- Border: #E2E8F0 (Slate 200)
- Text Primary: #0F172A (Slate 900)
- Text Secondary: #64748B (Slate 500)

Dark Mode:
- Background: #0B0F17 (Deep Navy Slate)
- Surface / Card: #131B2E (Midnight Slate)
- Border: #1E293B (Slate 800)
- Text Primary: #F8FAFC (Slate 50)
- Text Secondary: #94A3B8 (Slate 400)

Semantic Functional Colors:
- Brand Primary: #10B981 (Emerald 500) -> Aksen utama & kemakmuran finansial
- Income (Pemasukan): #10B981 (Emerald)
- Expense (Pengeluaran): #F43F5E (Rose 500)
- Transfer (Perpindahan): #3B82F6 (Blue 500)
- Budget Safe: #10B981 (< 70%)
- Budget Warning: #F59E0B (Amber 500 - 70% - 90%)
- Budget Danger / Exceeded: #EF4444 (Red 500 - > 90%)
- Financial Goal Accent: #8B5CF6 (Purple 500)
```

### 2.2 Typography (Google Font: Plus Jakarta Sans / Inter)

| Skala | Ukuran / Line Height | Bobot (*Weight*) | Penggunaan |
|---|---|---|---|
| **Display 1** | 32px / 40px | Bold (700) | Angka Total Saldo (*Net Balance Hero*) |
| **Heading 1** | 24px / 32px | SemiBold (600) | Judul Halaman Utama |
| **Heading 2** | 20px / 28px | SemiBold (600) | Judul Section & Modal Card |
| **Heading 3** | 16px / 24px | Medium (500) | Judul Widget & Subtitle |
| **Body Large** | 16px / 24px | Regular (400) | Paragraf Deskripsi & Input Form |
| **Body Medium** | 14px / 20px | Regular (400) | Teks Item Transaksi & Tabel |
| **Caption / Small** | 12px / 16px | Medium (500) | Badge, Kategori Tag, Timestamp |

---

## 3. Responsive Layout Architecture

### 3.1 Desktop Layout (Breakpoints: `lg`, `xl`, `2xl`)
```
+----------------------------------------------------------------------------------------+
|  [Logo My Finance]   |  [Family Selector ▼]   [+ Quick Add]   [🔔] [🌙/☀️] [Avatar]     |
+----------------------+-----------------------------------------------------------------+
|  [Sidebar Nav]       |  [Dashboard Content Area]                                       |
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

### 3.2 Mobile-First Layout (Breakpoints: `< 768px`)
```
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
| [Mobile Bottom Navigation Bar]           |
| [ 🏠 Home | 💸 Trans | 🎯 Budget | 🏆 Goals | ⚙️ ] |
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
