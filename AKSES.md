# 📖 PANDUAN LENGKAP AKSES & OPERASIONAL SISTEM (MY FINANCE)

Dokumen ini adalah **buku panduan operasional master (*Step-by-Step Production & Local Manual*)** untuk mengonfigurasi, menjalankan, menguji, dan mendeploy aplikasi **My Finance** dari awal hingga siap produksi secara mandiri.

---

## 📑 DAFTAR ISI
1. [Ringkasan Tech Stack & Biaya (100% Free & Open Source)](#-ringkasan-tech-stack--biaya-100-free--open-source)
2. [BAGIAN 1: Persiapan Akun & Cloud Services (Gratis)](#-bagian-1-persiapan-akun--cloud-services-gratis)
   - [Langkah 1.1: Buat Akun & Proyek Supabase](#langkah-11-buat-akun--proyek-supabase)
   - [Langkah 1.2: Eksekusi Skema Database SQL](#langkah-12-eksekusi-skema-database-sql)
   - [Langkah 1.3: Konfigurasi Storage Bucket Struk](#langkah-13-konfigurasi-storage-bucket-struk)
   - [Langkah 1.4: Setup Google OAuth Login](#langkah-14-setup-google-oauth-login)
   - [Langkah 1.5: Dapatkan API Key Google Gemini (Gratis)](#langkah-15-dapatkan-api-key-google-gemini-gratis)
3. [BAGIAN 2: Menjalankan di Lingkungan Lokal (Development Step-by-Step)](#-bagian-2-menjalankan-di-lingkungan-lokal-development-step-by-step)
   - [Langkah 2.1: Prasyarat Software](#langkah-21-prasyarat-software)
   - [Langkah 2.2: Setup Repository & Install Dependensi](#langkah-22-setup-repository--install-dependensi)
   - [Langkah 2.3: Konfigurasi File .env.local](#langkah-23-konfigurasi-file-envlocal)
   - [Langkah 2.4: Menjalankan Web App (Next.js)](#langkah-24-menjalankan-web-app-nextjs)
   - [Langkah 2.5: Menjalankan Mobile App (React Native Expo)](#langkah-25-menjalankan-mobile-app-react-native-expo)
   - [Langkah 2.6: Menjalankan Quality Assurance & Testing Suite](#langkah-26-menjalankan-quality-assurance--testing-suite)
4. [BAGIAN 3: Panduan Deployment ke Produksi (Production Deployment)](#-bagian-3-panduan-deployment-ke-produksi-production-deployment)
   - [OPSI A: Deployment ke Vercel (Rekomendasi Terbaik)](#opsi-a-deployment-ke-vercel-rekomendasi-terbaik)
   - [OPSI B: Deployment ke VPS / Server Mandiri (Docker & Docker Compose)](#opsi-b-deployment-ke-vps--server-mandiri-docker--docker-compose)
   - [OPSI C: Build Aplikasi Mobile Android & iOS (EAS Build)](#opsi-c-build-aplikasi-mobile-android--ios-eas-build)
5. [BAGIAN 4: Konfigurasi Otomasi Cron Job (Tagihan Berulang)](#-bagian-4-konfigurasi-otomasi-cron-job-tagihan-berulang)
6. [BAGIAN 5: Verifikasi Alur Pengguna (End-to-End Testing Checklist)](#-bagian-5-verifikasi-alur-pengguna-end-to-end-testing-checklist)
7. [BAGIAN 6: Pemantauan (Monitoring) & Maintenance Produksi](#-bagian-6-pemantauan-monitoring--maintenance-produksi)
8. [BAGIAN 7: Troubleshooting & Solusi Error Umum](#-bagian-7-troubleshooting--solusi-error-umum)

---

## 💎 Ringkasan Tech Stack & Biaya (100% Free & Open Source)

Aplikasi **My Finance** dirancang dengan arsitektur modern berstandar enterprise tanpa lisensi berbayar:

| Komponen Sistem | Teknologi | Penyedia Layanan | Estimasi Biaya |
| :--- | :--- | :--- | :--- |
| **Web Frontend & API** | Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui, Recharts | Vercel / VPS Docker | **Rp 0 / Bulan** |
| **Database Relasional** | PostgreSQL dengan Row Level Security (RLS) & Triggers | Supabase Free Tier | **Rp 0 / Bulan** |
| **Autentikasi Pengguna** | Supabase Auth (Google OAuth & Magic Link) | Supabase Free Tier | **Rp 0 / Bulan** |
| **Penyimpanan Berkas** | Supabase Storage (Bukti Nota Struk) | Supabase Free Tier (1 GB) | **Rp 0 / Bulan** |
| **Kecerdasan Buatan (AI)** | Google Gemini 1.5 Flash (OCR Struk & Financial Advisor) | Google AI Studio (15 RPM / 1.500 RPD) | **Rp 0 / Bulan** |
| **Mobile App (iOS/Android)** | React Native Expo SDK 52, SQLite Lokal, Biometrics | Expo / Android APK | **Rp 0 / Bulan** |
| **Push Notification** | Expo Push Notification Gateway (`exp.host`) | Expo Free Tier | **Rp 0 / Bulan** |
| **Otomasi Pengujian** | Vitest (60 Unit Tests Terverifikasi), GitHub Actions | GitHub Actions | **Rp 0 / Bulan** |

---

## ☁️ BAGIAN 1: Persiapan Akun & Cloud Services (Gratis)

Lakukan langkah-langkah berikut satu kali sebelum menjalankan aplikasi.

### Langkah 1.1: Buat Akun & Proyek Supabase
1. Kunjungi **[https://supabase.com](https://supabase.com)** dan klik **Sign Up** (dapat login langsung menggunakan akun GitHub).
2. Klik tombol **New Project**.
3. Isi form pembuatan proyek:
   - **Name**: `my_finance` (atau nama pilihan Anda).
   - **Database Password**: Buat password yang kuat dan catat dengan aman.
   - **Region**: Pilih `Singapore (ap-southeast-1)` untuk latensi tercepat di Indonesia.
   - **Pricing Plan**: Pilih **Free Plan**.
4. Klik **Create new project** dan tunggu proses inisialisasi (~1-2 menit).
5. Setelah selesai, buka menu **Settings** (ikon gerigi di kiri bawah) $\rightarrow$ **API**:
   - Salin **Project URL** (misal: `https://abcdefghijklm.supabase.co`) $\rightarrow$ Ini adalah `NEXT_PUBLIC_SUPABASE_URL`.
   - Salin **Project API keys** bagian `anon` / `public` $\rightarrow$ Ini adalah `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Salin **Project API keys** bagian `service_role` (klik *Reveal*) $\rightarrow$ Ini adalah `SUPABASE_SERVICE_ROLE_KEY`.

---

### Langkah 1.2: Eksekusi Skema Database SQL
1. Pada dashboard Supabase Anda, klik menu **SQL Editor** di panel navigasi sebelah kiri.
2. Klik tombol **+ New Query**.
3. Buka file [supabase/migrations/00001_initial_schema.sql](file:///d:/TMT/Prorgram/MY%20FINANCE/supabase/migrations/00001_initial_schema.sql) pada project Anda, salin seluruh kodenya, tempelkan ke SQL Editor Supabase, lalu klik tombol **Run** (atau tekan `Ctrl+Enter`).
   - *Hasil*: 13 tabel relasional dibuat beserta indeks performa dan triggers otomatis saldo dompet.
4. Buat query baru, buka file [supabase/migrations/00002_rls_policies.sql](file:///d:/TMT/Prorgram/MY%20FINANCE/supabase/migrations/00002_rls_policies.sql), salin kodenya, tempelkan ke SQL Editor, lalu klik **Run**.
   - *Hasil*: Keamanan Row Level Security (RLS) diaktifkan penuh pada 13 tabel.
5. *(Opsional)* Jika ingin mengisi data kategori awal, jalankan file [supabase/seed.sql](file:///d:/TMT/Prorgram/MY%20FINANCE/supabase/seed.sql).

---

### Langkah 1.3: Konfigurasi Storage Bucket Struk
1. Buka menu **Storage** di panel navigasi Supabase.
2. Klik tombol **New bucket**.
3. Beri nama bucket: `receipts`.
4. Aktifkan opsi **Public bucket** agar preview foto struk dapat ditampilkan secara instan.
5. Klik **Save**.
6. Masuk ke tab **Policies** pada bucket `receipts`:
   - Pastikan terdapat policy: `Allow authenticated uploads` (INSERT) dan `Allow public reads` (SELECT).

---

### Langkah 1.4: Setup Google OAuth Login
1. Buka **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Buat proyek baru (misal: `My Finance App`).
3. Masuk ke menu **APIs & Services** $\rightarrow$ **OAuth consent screen**:
   - Pilih User Type: **External** $\rightarrow$ Klik **Create**.
   - Isi Nama Aplikasi: `My Finance`, Email Dukungan Pengguna, dan Email Kontak Developer.
   - Klik **Save and Continue** sampai selesai.
4. Masuk ke menu **Credentials** $\rightarrow$ Klik **+ CREATE CREDENTIALS** $\rightarrow$ Pilih **OAuth client ID**:
   - Application type: **Web application**.
   - Name: `My Finance Web Client`.
   - **Authorized redirect URIs**: Tambahkan URL callback Supabase Anda:
     ```text
     https://<your-project-id>.supabase.co/auth/v1/callback
     ```
     *(Ganti `<your-project-id>` dengan ID proyek Supabase Anda)*.
   - Klik **Create** $\rightarrow$ Salin **Client ID** dan **Client Secret**.
5. Kembali ke dashboard **Supabase** $\rightarrow$ Menu **Authentication** $\rightarrow$ **Providers** $\rightarrow$ Pilih **Google**:
   - Aktifkan toggle **Enable Google provider**.
   - Masukkan **Client ID** dan **Client Secret** yang didapat dari Google Cloud.
   - Klik **Save**.
6. Pada Supabase menu **Authentication** $\rightarrow$ **URL Configuration**:
   - **Site URL**: Masukkan `http://localhost:3000` (untuk dev) atau domain produksi Anda.
   - **Redirect URLs**: Tambahkan:
     - `http://localhost:3000/**`
     - `http://localhost:3000/auth/callback`
     - `https://<domain-produksi-anda>.vercel.app/**`
     - `https://<domain-produksi-anda>.vercel.app/auth/callback`

---

### Langkah 1.5: Dapatkan API Key Google Gemini (Gratis)
1. Kunjungi **[https://aistudio.google.com/](https://aistudio.google.com/)** dan login dengan akun Google Anda.
2. Klik tombol **Get API key** di pojok kiri atas.
3. Klik **Create API key in new project**.
4. Salin API key yang dihasilkan (dimulai dengan `AIzaSy...`).
   - *Kuota Free Tier*: **15 Requests per Minute (RPM)** dan **1.500 Requests per Day (RPD)** tanpa biaya sepeser pun.
   - *Catatan*: Jika belum memiliki key, aplikasi tetap berfungsi normal karena telah dilengkapi *Heuristic Fallback Engine*.

---

## 🛠️ BAGIAN 2: Menjalankan di Lingkungan Lokal (Development Step-by-Step)

### Langkah 2.1: Prasyarat Software
Pastikan komputer Anda telah terinstal:
- **Node.js**: `v20.x` atau `v22.x` ([Download Node.js](https://nodejs.org/))
- **Git**: [Download Git](https://git-scm.com/)
- **Visual Studio Code / Antigravity IDE**

---

### Langkah 2.2: Setup Repository & Install Dependensi
Buka terminal (PowerShell / Command Prompt / Terminal Bash) pada komputer Anda:

```powershell
# 1. Masuk ke direktori proyek
cd "d:\TMT\Prorgram\MY FINANCE"

# 2. Install seluruh dependensi Next.js & React
npm install
```

---

### Langkah 2.3: Konfigurasi File `.env.local`
Buat file baru bernama `.env.local` di folder root proyek (sejajar dengan `package.json`), lalu isi dengan data kredensial yang telah Anda siapkan di Bagian 1:

```env
# ==========================================
# 1. SUPABASE (Database, Auth, Storage)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==========================================
# 2. GOOGLE GEMINI AI (Free Tier)
# ==========================================
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# ==========================================
# 3. CRON JOB SECURITY TOKEN
# ==========================================
CRON_SECRET=my_finance_secure_cron_token_2026

# ==========================================
# 4. APP CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="My Finance"
NEXT_PUBLIC_STORAGE_BUCKET_RECEIPTS="receipts"
```

---

### Langkah 2.4: Menjalankan Web App (Next.js)
Jalankan perintah berikut di terminal:

```powershell
npm run dev
```

Output terminal:
```text
  ▲ Next.js 15.1.7
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1.8s
```

Buka browser Anda dan akses:
- **Halaman Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Onboarding Wizard**: [http://localhost:3000/onboarding](http://localhost:3000/onboarding)
- **Dashboard Finansial**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

### Langkah 2.5: Menjalankan Mobile App (React Native Expo)
Untuk menjalankan aplikasi mobile:

```powershell
# 1. Buka terminal baru dan masuk ke direktori mobile
cd mobile

# 2. Install dependensi mobile
npm install

# 3. Jalankan Expo bundler
npx expo start
```

Pilihan menjalankan:
- **Di Smartphone Fisik**: Install aplikasi **Expo Go** dari Google Play Store / Apple App Store, lalu pindai (*scan*) QR code yang muncul di terminal.
- **Di Android Emulator**: Tekan huruf `a` pada keyboard terminal.
- **Di iOS Simulator (macOS)**: Tekan huruf `i` pada keyboard terminal.

---

### Langkah 2.6: Menjalankan Quality Assurance & Testing Suite
Jalankan perintah-perintah berikut untuk memastikan tidak ada kesalahan tipe data maupun regresi:

```powershell
# 1. Pengecekan Strict TypeScript (Harus 0 error)
npm run type-check

# 2. Menjalankan Seluruh 60 Unit Tests Vitest (Harus 100% Passed)
npm test

# 3. Menjalankan Verifikasi Build Produksi Lokal
npm run build
```

---

## 🚀 BAGIAN 3: Panduan Deployment ke Produksi (Production Deployment)

### OPSI A: Deployment ke Vercel (Rekomendasi Terbaik)

Vercel adalah platform hosting resmi untuk Next.js dengan fitur Serverless Edge, Global CDN, dan SSL otomatis gratis.

#### Langkah A.1: Push Kode ke Repositori GitHub
Pastikan seluruh perubahan terbaru telah di-commit dan di-push:
```powershell
git add .
git commit -m "feat: ready for production deployment"
git push origin main
```

#### Langkah A.2: Import Proyek di Vercel Dashboard
1. Buka **[https://vercel.com](https://vercel.com)** dan login menggunakan akun GitHub Anda.
2. Klik tombol **Add New...** $\rightarrow$ **Project**.
3. Cari repositori `my_finance` $\rightarrow$ Klik tombol **Import**.

#### Langkah A.3: Set Environment Variables Produksi di Vercel
Pada bagian **Environment Variables**, tambahkan 6 variabel berikut:

| Key | Value Contoh | Deskripsi |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefghijklm.supabase.co` | URL Project Supabase Anda |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1Ni...` | Public Anon Key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1Ni...` | Secret Service Role Key Supabase |
| `GEMINI_API_KEY` | `AIzaSy...` | API Key Google Gemini 1.5 Flash |
| `CRON_SECRET` | `my_finance_secure_cron_token_2026` | Token otentikasi worker cron |
| `NEXT_PUBLIC_APP_URL` | `https://myfinance.vercel.app` | Domain Vercel Anda |

#### Langkah A.4: Klik Deploy
1. Klik tombol **Deploy**.
2. Tunggu proses build selesai (~1 menit).
3. Vercel akan memberikan domain publik produksi Anda (misal: `https://my-finance-pro.vercel.app`).

#### Langkah A.5: Update Redirect URL di Supabase
Buka kembali Supabase $\rightarrow$ **Authentication** $\rightarrow$ **URL Configuration**:
- Ubah **Site URL** menjadi domain Vercel Anda: `https://my-finance-pro.vercel.app`.
- Tambahkan ke **Redirect URLs**:
  - `https://my-finance-pro.vercel.app/**`
  - `https://my-finance-pro.vercel.app/auth/callback`

---

### OPSI B: Deployment ke VPS / Server Mandiri (Docker & Docker Compose)

Jika Anda ingin mendeploy pada server VPS pribadi (Ubuntu / Debian di DigitalOcean, Hetzner, AWS EC2, Contabo, atau Coolify):

#### Langkah B.1: Siapkan Server VPS & Install Docker
Hubungkan ke server VPS via SSH:
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Langkah B.2: Clone Repositori ke VPS
```bash
git clone https://github.com/adjiehf231/my_finance.git
cd my_finance
```

#### Langkah B.3: Buat File `.env` di VPS
```bash
nano .env
```
Isi variabel lingkungan produksi Anda:
```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...
GEMINI_API_KEY=AIzaSy...
CRON_SECRET=my_finance_secure_cron_token_2026
NEXT_PUBLIC_APP_URL=https://myfinance.yourdomain.com
```
*(Tekan `Ctrl+O` lalu `Enter` untuk menyimpan, `Ctrl+X` untuk keluar)*.

#### Langkah B.4: Jalankan Container dengan Docker Compose
```bash
# Build dan jalankan container di background
docker compose up -d --build

# Cek status container
docker compose ps
```

#### Langkah B.5: Konfigurasi Nginx Reverse Proxy & SSL Let's Encrypt Gratis
```bash
# Install Nginx & Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Buat file konfigurasi Nginx
sudo nano /etc/nginx/sites-available/myfinance
```

Isi konfigurasi berikut:
```nginx
server {
    server_name myfinance.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan dan pasang sertifikat SSL:
```bash
sudo ln -s /etc/nginx/sites-available/myfinance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Dapatkan sertifikat SSL HTTPS otomatis
sudo certbot --nginx -d myfinance.yourdomain.com
```

---

### OPSI C: Build Aplikasi Mobile Android & iOS (EAS Build)

Untuk menghasilkan file installer APK Android siap pakai (*standalone*):

1. Masuk ke direktori `mobile`:
   ```powershell
   cd mobile
   ```
2. Install EAS CLI secara global:
   ```powershell
   npm install -g eas-cli
   ```
3. Login ke akun Expo Anda:
   ```powershell
   eas login
   ```
4. Konfigurasi proyek EAS:
   ```powershell
   eas build:configure
   ```
5. Jalankan build APK Android gratis:
   ```powershell
   eas build -p android --profile preview
   ```
6. Setelah proses cloud build selesai (~5-10 menit), terminal akan memberikan link download file `.apk` yang dapat langsung diinstal pada perangkat Android mana pun.

---

## ⏰ BAGIAN 4: Konfigurasi Otomasi Cron Job (Tagihan Berulang)

Agar transaksi tagihan berulang (*Recurring Transactions*) tereksekusi otomatis secara terjadwal:

- **Endpoint URL**: `POST https://<domain-anda>/api/cron/recurring`
- **Header Otorisasi**: `Authorization: Bearer <CRON_SECRET>`

### Opsi 1: Menggunakan Vercel Cron (Otomatis)
File `vercel.json` pada repositori telah dikonfigurasi:
```json
{
  "crons": [
    {
      "path": "/api/cron/recurring",
      "schedule": "1 17 * * *"
    }
  ]
}
```
*(17:01 UTC = 00:01 WIB setiap hari)*.

### Opsi 2: Menggunakan Layanan Gratis [cron-job.org](https://cron-job.org)
1. Buat akun gratis di **[https://cron-job.org](https://cron-job.org)**.
2. Klik **Create Cronjob**:
   - **Title**: `My Finance Recurring Worker`.
   - **URL**: `https://<domain-anda>/api/cron/recurring`.
   - **Schedule**: Every day at 00:01.
   - **Request Method**: `POST`.
   - **Headers**: Tambahkan Header Key: `Authorization`, Value: `Bearer my_finance_secure_cron_token_2026`.
3. Klik **Save**.

---

## 🧪 BAGIAN 5: Verifikasi Alur Pengguna (End-to-End Testing Checklist)

Lakukan pengujian berikut untuk memverifikasi fungsionalitas aplikasi:

- [ ] **1. Autentikasi**: Buka `/login` $\rightarrow$ Login via Google OAuth $\rightarrow$ Berhasil redirect.
- [ ] **2. Onboarding**: Masuk ke `/onboarding` $\rightarrow$ Masukkan nama keluarga & buat dompet utama $\rightarrow$ Masuk ke `/dashboard`.
- [ ] **3. Pencatatan Transaksi**: Klik tombol *Tambah Transaksi* $\rightarrow$ Catat Pengeluaran `Rp 50.000` $\rightarrow$ Saldo dompet berkurang secara otomatis.
- [ ] **4. Scan Struk AI**: Klik tombol *Scan Struk AI* $\rightarrow$ Unggah foto struk belanja $\rightarrow$ Gemini mengekstrak toko, tanggal, item produk, dan total nominal $\rightarrow$ Klik *Simpan Transaksi Ini*.
- [ ] **5. Anggaran Bulanan**: Buka `/budgeting` $\rightarrow$ Atur limit kategori Makanan `Rp 500.000` $\rightarrow$ Indikator persentase & bar progress muncul rapi.
- [ ] **6. Target Tabungan**: Buka `/goals` $\rightarrow$ Buat target *Dana Liburan* `Rp 5.000.000` $\rightarrow$ Tambah setoran `Rp 500.000` dari rekening utama $\rightarrow$ Saldo dompet terpotong dan progress target bertambah.
- [ ] **7. Hutang & Piutang**: Buka `/debts` $\rightarrow$ Catat piutang teman `Rp 200.000` $\rightarrow$ Net Worth bertambah otomatis $\rightarrow$ Catat pembayaran cicilan.
- [ ] **8. AI Financial Advisor**: Buka `/advisor` $\rightarrow$ Skor kesehatan finansial (0-100), badge status, dan 3 rekomendasi taktis muncul lengkap.
- [ ] **9. Gamifikasi & Aktivitas**: Buka `/gamification` $\rightarrow$ Lencana *Langkah Pertama* terbuka (+50 XP) $\rightarrow$ Buka `/activity` $\rightarrow$ Seluruh mutasi tercatat di audit trail feed.
- [ ] **10. Ekspor Data**: Buka `/settings` $\rightarrow$ Unduh Laporan CSV $\rightarrow$ Buka di Microsoft Excel / Google Sheets $\rightarrow$ Karakter Rupiah rapi (UTF-8 BOM).

---

## 🛡️ BAGIAN 6: Pemantauan (Monitoring) & Maintenance Produksi

### 1. Monitoring Uptime 24/7 Gratis
Gunakan layanan pemantau gratis seperti **[UptimeRobot](https://uptimerobot.com/)** atau **[BetterStack](https://betterstack.com/)**:
- **Monitor Type**: `HTTP(s)`
- **URL**: `https://<domain-anda>/api/health`
- **Monitoring Interval**: 5 minutes
- **Expected Response**: Status Code `200 OK` dan JSON `{"status": "healthy"}`.

### 2. Backup Database PostgreSQL
- Supabase Free Tier secara otomatis melakukan backup harian.
- Anda juga dapat mengunduh backup mandiri kapan saja melalui menu **Settings** $\rightarrow$ **Database** $\rightarrow$ **Backups** pada Supabase Dashboard, atau menggunakan fitur **JSON Data Takeout** di halaman `/settings` aplikasi.

---

## 📞 BAGIAN 7: Troubleshooting & Solusi Error Umum

### 1. Error: `new row violates row-level security policy for table ...`
- **Penyebab**: Pengguna belum terdaftar sebagai anggota aktif dalam ruang kerja keluarga (`family_members`).
- **Solusi**: Pastikan alur onboarding diakses melalui `/onboarding` atau buat ruang kerja keluarga baru.

### 2. Error: `Cannot find module ...` saat pertama kali clone
- **Solusi**: Jalankan instalasi dependensi bersih:
  ```powershell
  npm clean-install
  ```

### 3. Ekspor CSV simbol atau nominal berantakan di Excel
- **Solusi**: Generator CSV telah dilengkapi kode `\uFEFF` (UTF-8 BOM). Jika membuka via Excel lama, pilih menu *Data* $\rightarrow$ *From Text/CSV* $\rightarrow$ *Encoding: UTF-8*.

### 4. Respon AI Gemini lambat atau fallback aktif
- **Penyebab**: Kuota rate-limit Google AI Studio (15 RPM) tercapai atau koneksi internet terputus.
- **Solusi**: Sistem secara otomatis mengaktifkan *Heuristic Fallback Engine* lokal sehingga pengguna tetap dapat melanjutkan transaksi tanpa error.

---

**Selamat! Sistem My Finance Anda kini telah siap digunakan secara penuh dan aman di lingkungan lokal maupun produksi!** 🚀🎉
