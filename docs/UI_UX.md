## 1. Design Vision & Direction (Gen-Z & Premium Aesthetic)

**My Finance** dirancang sebagai platform pengelolaan keuangan keluarga modern dengan standar visual kelas atas:

### 🌟 Design Direction Checklist:
- **Anti AI-Slop & Premium Finish**: Desain orisinil dengan kurasi warna yang tajam, kedalaman visual berlapis (*subtle layered glassmorphism*), border lembut (*1px border-slate-800/20*), dan bebas dari tampilan template murah.
- **Modern & Minimalist**: Menghilangkan distraksi visual yang tidak perlu, menonjolkan angka keuangan dengan visual hierarchy yang jelas.
- **Gen-Z Vibrant & Elegant Palette**: Menggabungkan warna netral pekat (*Dark Slate #0B0F17* / *Light Porcelain #F8FAFC*) dengan aksen *Emerald Glow (#10B981)*, *Electric Indigo (#6366F1)*, dan *Amber Flame (#F59E0B)*.
- **Accessible Typography**: Tipografi modern **Outfit** untuk Display Headings dan **Inter** untuk angka finansial monospace yang presisi.
- **Real-Time Currency Formatting**: Seluruh input uang otomatis terformat rupiah (`Rp 50.000`) saat jari mengetik tanpa glitch cursor.
- **Zero-Latency Optimistic UI**: Reaksi antarmuka seketika (0 ms delay) saat pengguna menekan aksi tambah/edit/hapus data.
- **Skeleton Shimmer Loading**: Menggantikan spinner berputar dengan animasi placeholder transparan shimmer yang halus.
- **Command Palette & Keyboard Accessibility**: Dukungan shortcut global (`Ctrl + K` / `Cmd + K` untuk pencarian instan, dan `N` untuk catat transaksi kilat).

---

## 2. Theme & Internationalization (i18n)

### 🌓 Theme Selector (Dark/Light/System)
- **Light Mode**: Latar belakang bersih porselen (*#F8FAFC*), kartu putih dengan shadow lembut (*shadow-sm shadow-slate-200*), teks *Slate-900*.
- **Dark Mode**: Latar belakang pekat (*#0B0F17*), kartu *#131B2E* dengan border *#1E293B*, teks *#F8FAFC*.
- **System Default**: Sinkronisasi dinamis mengikuti preferensi OS pengguna.

### 🌐 Dual-Language Switcher (ID / EN)
- Tombol switch bendera/kode bahasa elegan di navbar atas dan pengaturan.
- Menggunakan dictionary JSON terstruktur (`lib/i18n/dictionaries/id.json` & `en.json`).
- Preferensi tersimpan otomatis di cookie dan state sesi.

---

## 3. Responsive Layout Architecture

### 📱 Mobile-First Principles
- **Sticky Header**: Menampilkan sapaan nama pengguna, avatar, tombol switch bahasa, dan badge status sinkronisasi.
- **Responsive Cards**: Kartu saldo keluarga dengan nomor rekening dan tombol salin instan (*Copy to Clipboard*).
- **Interactive Form Ergonomics**: Komponen `<CurrencyInput />` yang otomatis menyisipkan titik pemisah ribuan dan prefix "Rp ".
- **Smart Budget Warning Banner**: Banner interaktif di bagian atas dashboard jika terdapat anggaran yang menyentuh batas bahaya (> 80%).
- **Mobile Bottom Navigation Bar (5 Tab Utama)**:
  1. 🏠 **Home** (Dashboard)
  2. 💸 **Transactions** (Histori, Filter Lanjutan & Rekonsiliasi)
  3. 🎯 **Budget** (Anggaran Bulanan & Indikator Peringatan)
  4. 🏆 **Goals** (Target Tabungan & Kalkulator Finansial)
  5. ⚙️ **Settings** (Pengaturan, Multi-Bahasa, Hak Akses RBAC & Activity Log)

---

## 4. Screen-by-Screen UI Specifications

### 4.1 Onboarding Wizard (7-Step Guide)
1. **Welcome Screen**: Pengenalan nilai aplikasi & ilustrasi minimalis.
2. **Create / Join Family**: Pilihan membuat ruang kerja baru atau memasukkan 6-digit invite code.
3. **First Wallet Setup**: Memasukkan rekening utama + nomor rekening opsional.
4. **Initial Balance**: Mengisi nominal saldo awal dengan CurrencyInput.
5. **Monthly Budget**: Memilih 3 kategori pengeluaran utama dan menetapkan limit bulanan.
6. **Financial Goal**: Menentukan target tabungan pertama (misal: "Dana Darurat").
7. **Workspace Ready Celebration**: Konfeti animasi dan tombol "Buka Dashboard".

### 4.2 Quick Action Transaction Drawer / Modal
- **Pilihan Jenis Transaksi**: Tab Segmented (`Pemasukan` / `Pengeluaran` / `Transfer`).
- **Nominal Input**: Ukuran font besar (*Large Display Input*) dengan auto-format real-time (`Rp 150.000`).
- **Auto-Category AI Suggestion**: Saat pengguna mengetik keterangan (misal: *"Beli bensin"*), dropdown kategori otomatis memilih *"Transportasi / Bensin"*.
- **Transfer with Admin Fee**: Opsi input biaya admin (Rp 2.500 / Rp 6.500) yang otomatis tercatat sebagai mutasi pengeluaran terpisah.

### 4.3 Budgeting Interface & Smart Warning Banner
- **Tampilan Kartu Berwarna Dinamis**:
  - Hijau jika penggunaan < 70%.
  - Oranye jika 70% - 90%.
  - Merah menyala dengan badge `OVERBUDGET` jika > 100%.
- **Dashboard Warning Banner**: Menampilkan peringatan dini *"Perhatian: Anggaran Makan & Minum sudah 85% terpakai"* dengan tombol pintas tinjau alokasi.

### 4.4 Financial Goals & Simulation Calculators Screen
- **Visual Goal Card**: Progress lingkaran persentase (*Radial Progress Bar*).
- **Suite Kalkulator Finansial**:
  - *Emergency Fund Calculator*: Menghitung dana darurat berdasarkan pengeluaran bulanan (3, 6, atau 12 bulan).
  - *Compound Interest Calculator*: Proyeksi pertumbuhan investasi majemuk dengan grafik pertumbuhan tahunan.
  - *Debt Repayment Simulator*: Komparasi durasi dan penghematan bunga antara metode *Snowball* vs *Avalanche*.

### 4.5 AI Smart Interfaces (Batch OCR & Advisor)
- **📸 Batch / Multi-Receipt Camera Modal**:
  - Mendukung upload 2–5 foto struk nota sekaligus.
  - Efek antrian animasi pemindaian AI dengan status per lembar struk (*Scanning... -> Extracted -> Drafted*).
- **💬 Family Financial Advisor**:
  - Widget chat perencana keuangan dengan rekomendasi kontekstual berdasarkan arus kas keluarga 7 hari terakhir.

### 4.6 Family Governance & Activity Audit Screen (`/activity`)
- **Family Member Management**: Matriks peran (Owner, Admin, Member, View-Only) dan pengaturan dompet yang dapat diakses.
- **Activity Log Stream**: Timeline kronologis yang mencatat mutasi data oleh setiap anggota keluarga lengkap dengan detail perubahan (*Diff View*).

---

## 5. Feedback, Skeleton Shimmers & Toasts

### 5.1 Skeleton Shimmer Loading
Saat data sedang diambil dari Supabase via Server Components, seluruh kartu dashboard, tabel transaksi, dan grafik menampilkan placeholder animasi shimmer transparan untuk pengalaman transisi 60 FPS tanpa kedipan.

### 5.2 Toast Notifications (Sonner)
- ✅ *Transaksi berhasil disimpan!*
- ⚠️ *Peringatan: Anggaran Makanan telah mencapai 85%!*
- 🔄 *Saldo dompet berhasil direkonsiliasi dengan total mutasi.*
- 🌐 *Bahasa berhasil dialihkan ke English.*

---

## 6. Accessibility & Inclusivity (WCAG 2.1 AA)

- **Color Contrast**: Rasio kontras teks terhadap latar belakang minimal `4.5:1` untuk teks normal dan `3:1` untuk teks besar.
- **Focus Rings**: Seluruh elemen interaktif memiliki ring fokus tajam untuk navigasi keyboard.
- **Screen Reader Support**: Atribut `aria-label`, `aria-expanded`, dan `role="status"` disematkan pada seluruh dialog dan indikator progres.

