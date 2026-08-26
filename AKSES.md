# 📖 PANDUAN LENGKAP AKSES & OPERASIONAL SISTEM — MY FINANCE

> **Buku panduan operasional master** untuk konfigurasi, instalasi, pengembangan lokal, deployment, dan maintenance aplikasi **My Finance** dari awal hingga siap produksi secara mandiri.

---

## 📑 DAFTAR ISI

1. [Ringkasan Tech Stack & Biaya](#-ringkasan-tech-stack--biaya-100-free--open-source)
2. [Bagian 1: Persiapan Akun & Cloud Services](#️-bagian-1-persiapan-akun--cloud-services)
3. [Bagian 2: Menjalankan di Lokal (Development)](#️-bagian-2-menjalankan-di-lingkungan-lokal-development)
4. [Bagian 3: Deployment ke Produksi](#-bagian-3-panduan-deployment-ke-produksi)
5. [Bagian 4: Manajemen Database Supabase](#-bagian-4-manajemen-database-supabase)
6. [Bagian 5: Konfigurasi Cron Job Otomatis](#️-bagian-5-konfigurasi-otomasi-cron-job)
7. [Bagian 6: Verifikasi End-to-End Testing](#-bagian-6-verifikasi-alur-pengguna-end-to-end)
8. [Bagian 7: Monitoring & Maintenance Produksi](#️-bagian-7-monitoring--maintenance-produksi)
9. [Bagian 8: Troubleshooting & Solusi Error](#-bagian-8-troubleshooting--solusi-error-umum)

> 📋 **Panduan deployment detail lengkap**: Lihat [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 💎 Ringkasan Tech Stack & Biaya (100% Free & Open Source)

| Komponen | Teknologi | Provider | Biaya |
|:---|:---|:---|:---|
| **Web Frontend & API** | Next.js 15, React 19, TypeScript, Tailwind CSS | Vercel | **Rp 0/bulan** |
| **Database** | PostgreSQL + RLS + Triggers | Supabase Free | **Rp 0/bulan** |
| **Autentikasi** | Supabase Auth (Google OAuth) | Supabase Free | **Rp 0/bulan** |
| **Storage** | Supabase Storage (Foto Struk) | Supabase Free (1 GB) | **Rp 0/bulan** |
| **AI Engine** | Google Gemini 1.5 Flash (OCR + Advisor) | Google AI Studio | **Rp 0/bulan** |
| **Otomasi Testing** | Vitest Unit Tests + GitHub Actions | GitHub | **Rp 0/bulan** |
| **Cron Job** | Vercel Cron / cron-job.org | Vercel / cron-job.org | **Rp 0/bulan** |

**Total Biaya Operasional: Rp 0 / Bulan** (cocok untuk keluarga)

---

## ☁️ BAGIAN 1: Persiapan Akun & Cloud Services

Lakukan langkah ini satu kali sebelum pertama kali menjalankan atau mendeploy aplikasi.

---

### Langkah 1.1: Buat Akun & Proyek Supabase

1. Kunjungi **[https://supabase.com](https://supabase.com)** → Klik **Sign Up** (bisa via GitHub)
2. Klik **New Project**
3. Isi detail:
   - **Name**: `my_finance`
   - **Database Password**: buat password kuat → **simpan di tempat aman!**
   - **Region**: `Southeast Asia (Singapore)` → latensi terbaik Indonesia
   - **Plan**: Free
4. Klik **Create new project** → tunggu ~2 menit
5. Buka **Settings → API** dan catat:

```
Project URL  → NEXT_PUBLIC_SUPABASE_URL
anon/public  → NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role → SUPABASE_SERVICE_ROLE_KEY  ⚠️ RAHASIA!
```

---

### Langkah 1.2: Eksekusi Skema Database SQL

1. Buka menu **SQL Editor** di Supabase Dashboard
2. Klik **+ New Query**
3. Jalankan file berikut satu per satu:

**Query 1 — Schema Database:**
```
File: supabase/migrations/00001_initial_schema.sql
→ Paste ke SQL Editor → Klik Run
→ Hasil: 13 tabel relasional + triggers saldo otomatis
```

**Query 2 — Row Level Security:**
```
File: supabase/migrations/00002_rls_policies.sql
→ Paste ke SQL Editor → Klik Run
→ Hasil: RLS aktif di semua 13 tabel
```

**Query 3 (Opsional) — Data Kategori Awal:**
```
File: supabase/seed.sql
→ Paste ke SQL Editor → Klik Run
→ Hasil: Kategori transaksi default terisi
```

**Verifikasi berhasil:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
-- Harus muncul 13+ tabel
```

---

### Langkah 1.3: Konfigurasi Storage Bucket

1. Menu **Storage** → **New Bucket**
2. Nama: `receipts` | **Public**: ✅ | File size limit: `5MB`
3. Allowed types: `image/jpeg, image/png, image/webp`
4. Klik **Save**
5. Tab **Policies** → tambahkan policy:
   - `Allow authenticated uploads` (INSERT untuk role `authenticated`)
   - `Allow public reads` (SELECT untuk role `public`)

---

### Langkah 1.4: Setup Google OAuth Login

**Di Google Cloud Console:**

1. Buka [console.cloud.google.com](https://console.cloud.google.com/)
2. Buat project baru: `My Finance App`
3. **APIs & Services → OAuth consent screen**:
   - User Type: **External** → Buat
   - App name: `My Finance` → Simpan
4. **Credentials → + CREATE CREDENTIALS → OAuth client ID**:
   - Application type: `Web application`
   - **Authorized redirect URIs**:
     ```
     https://[project-ref].supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback  (untuk dev)
     ```
   - Salin **Client ID** & **Client Secret**

**Di Supabase Dashboard:**

5. **Authentication → Providers → Google**
6. Enable ✅ → Masukkan Client ID & Secret → Save
7. **Authentication → URL Configuration**:
   ```
   Site URL: http://localhost:3000   (dev) atau https://domain-produksi.com (prod)
   Redirect URLs:
     http://localhost:3000/**
     http://localhost:3000/auth/callback
     https://domain-produksi.com/**
     https://domain-produksi.com/auth/callback
     https://*.vercel.app/**
   ```

---

### Langkah 1.5: Dapatkan API Key Google Gemini (Gratis)

1. Buka [aistudio.google.com](https://aistudio.google.com/)
2. **Get API Key → Create API key in new project**
3. Salin key yang dimulai dengan `AIzaSy...`

> **Kuota Free**: 15 Requests/Menit (RPM) & 1.500 Requests/Hari (RPD)
>
> Jika key tidak ada → aplikasi otomatis pakai **Heuristic Fallback Engine** lokal

---

## 🛠️ BAGIAN 2: Menjalankan di Lingkungan Lokal (Development)

---

### Langkah 2.1: Prasyarat Software

Pastikan terinstal di komputer:

| Software | Versi | Download |
|---|---|---|
| **Node.js** | v20.x atau v22.x | [nodejs.org](https://nodejs.org/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **VS Code / Antigravity IDE** | Latest | — |

---

### Langkah 2.2: Clone & Install

```powershell
# Masuk ke direktori yang diinginkan
cd "D:\Projects"

# Clone repository
git clone https://github.com/adjiehf231/my_finance.git
cd my_finance

# Install seluruh dependensi
npm install
```

---

### Langkah 2.3: Konfigurasi File `.env.local`

Buat file `.env.local` di folder root (sejajar `package.json`):

```env
# ==========================================
# SUPABASE — Database, Auth, Storage
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==========================================
# GOOGLE GEMINI AI — OCR Struk & Advisor
# ==========================================
GEMINI_API_KEY=AIzaSyYourKeyHere

# ==========================================
# SECURITY — Cron Job Token
# ==========================================
CRON_SECRET=my_finance_cron_token_2026

# ==========================================
# APP CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="My Finance"
NEXT_PUBLIC_STORAGE_BUCKET_RECEIPTS=receipts
```

> ⚠️ `.env.local` sudah di `.gitignore` — jangan pernah di-commit ke Git!

---

### Langkah 2.4: Menjalankan Web App

```powershell
npm run dev
```

Output normal:
```
▲ Next.js 15.1.7
  - Local: http://localhost:3000
✓ Ready in 2.4s
```

Akses di browser:
- Login: [http://localhost:3000/login](http://localhost:3000/login)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

### Langkah 2.5: Quality Assurance & Testing

```powershell
# 1. TypeScript type check (harus 0 error)
npx tsc --noEmit

# 2. Jalankan seluruh unit tests (harus 100% passed)
npm test

# 3. Test build produksi lokal
npm run build
npm run start   # cek di localhost:3000
```

---

## 🚀 BAGIAN 3: Panduan Deployment ke Produksi

> 📋 **Panduan lengkap step-by-step ada di**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

### OPSI A: Vercel (Rekomendasi — Paling Mudah)

```powershell
# Step 1: Push kode terbaru ke GitHub
git add .
git commit -m "feat: ready for production"
git push origin main
```

1. Buka [vercel.com](https://vercel.com) → Login GitHub
2. **Add New → Project** → Import repo `my_finance`
3. **Environment Variables** — tambahkan semua variable dari Bagian 2.3 (ganti URL ke domain prod)
4. Klik **Deploy** → selesai ~2-3 menit
5. Update Supabase **Site URL** ke domain Vercel yang diberikan
6. Update Google OAuth **Authorized Redirect URIs** dengan domain Vercel

**Variable tambahan untuk production:**
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

---

### OPSI B: VPS / Docker

Lihat detail di [docs/DEPLOYMENT.md#12-deploy-ke-vpsdocker-alternatif](docs/DEPLOYMENT.md)

**Ringkasan cepat:**
```bash
# Di VPS Ubuntu 22.04
git clone https://github.com/adjiehf231/my_finance.git
cd my_finance
cp .env.example .env  # Isi semua variable
docker compose up -d --build

# Nginx + SSL
sudo apt install nginx certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 🗄️ BAGIAN 4: Manajemen Database Supabase

Semua query berikut dijalankan via **Supabase Dashboard → SQL Editor**.

---

### 4.1 Lihat Semua Data Family

```sql
-- Semua keluarga dan statistiknya
SELECT
  f.id,
  f.name AS nama_keluarga,
  f.created_at,
  COUNT(DISTINCT fm.user_id) AS jumlah_anggota,
  COUNT(DISTINCT t.id) AS total_transaksi,
  COUNT(DISTINCT w.id) AS jumlah_dompet
FROM families f
LEFT JOIN family_members fm ON fm.family_id = f.id
LEFT JOIN transactions t ON t.family_id = f.id
LEFT JOIN wallets w ON w.family_id = f.id
GROUP BY f.id, f.name, f.created_at
ORDER BY f.created_at DESC;
```

---

### 4.2 Hapus Data Satu Keluarga

```sql
-- Ganti dengan family_id yang ingin dihapus
-- CASCADE otomatis hapus semua data terkait
DELETE FROM families
WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

---

### 4.3 Reset Semua Data (Truncate — Struktur Tetap)

> ⚠️ **PERMANEN!** Backup dulu sebelum melakukan ini.

```sql
-- Urutan WAJIB diikuti (child tables dulu karena foreign key)
TRUNCATE TABLE
  activity_logs,
  receipt_scans,
  recurring_bills,
  budget_categories,
  budgets,
  goals,
  debts,
  transactions,
  wallets,
  family_members,
  families
RESTART IDENTITY CASCADE;
```

---

### 4.4 Reset Total — Hapus Semua Tabel

> ⚠️ **Sangat berbahaya!** Semua data dan struktur hilang. Hanya untuk fresh start.

```sql
-- Step 1: Drop semua tabel
DROP TABLE IF EXISTS
  activity_logs, receipt_scans, recurring_bills,
  budget_categories, budgets, goals, debts,
  transactions, wallets, family_members, families,
  user_profiles, categories
CASCADE;

-- Step 2: Jalankan ulang migrasi
-- supabase/migrations/00001_initial_schema.sql
-- supabase/migrations/00002_rls_policies.sql
-- (Opsional) supabase/seed.sql
```

---

### 4.5 Cek Status RLS di Semua Tabel

```sql
-- Verifikasi RLS aktif di semua tabel penting
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- Semua tabel harus menampilkan rls_enabled = true
```

---

### 4.6 Backup Data via Aplikasi

User dapat backup data mandiri melalui:
- `/settings` → **Ekspor Laporan CSV** → data transaksi untuk Excel
- `/settings` → **JSON Data Takeout** → backup lengkap semua data keluarga

---

## ⏰ BAGIAN 5: Konfigurasi Otomasi Cron Job

Agar tagihan berulang (*recurring bills*) tereksekusi otomatis setiap malam.

---

### Opsi 1: Vercel Cron (Auto — Sudah Dikonfigurasi)

File `vercel.json` sudah berisi:
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

`17:01 UTC` = `00:01 WIB` — otomatis berjalan setiap tengah malam WIB.

Monitor di: Vercel Dashboard → **Project → Cron Jobs** → lihat history eksekusi.

---

### Opsi 2: cron-job.org (Gratis, untuk non-Vercel Pro)

1. Daftar di [cron-job.org](https://cron-job.org)
2. **Create Cronjob**:
   - **URL**: `https://domain-anda/api/cron/recurring`
   - **Schedule**: `01 00 * * *`
   - **Method**: `POST`
   - **Header**: `Authorization: Bearer [CRON_SECRET]`
3. Klik **Save**

---

### Test Manual Cron

```powershell
# Windows PowerShell
Invoke-RestMethod -Uri "https://domain-anda/api/cron/recurring" `
  -Method POST `
  -Headers @{ "Authorization" = "Bearer $CRON_SECRET" }

# Expected response:
# { "success": true, "processed": 3 }
```

---

## 🧪 BAGIAN 6: Verifikasi Alur Pengguna (End-to-End)

Checklist pengujian setelah deploy atau setelah perubahan besar:

| # | Fitur | Langkah | Expected |
|---|---|---|---|
| 1 | **Auth** | Buka `/login` → Login Google | Redirect ke `/dashboard` |
| 2 | **Onboarding** | Buka `/onboarding` → Isi nama & dompet | Masuk `/dashboard` |
| 3 | **Transaksi** | Klik *Catat Transaksi* → catat Rp 50.000 | Saldo dompet berkurang |
| 4 | **Scan Struk AI** | Klik *Scan Struk AI* → upload foto | Gemini ekstrak data otomatis |
| 5 | **Anggaran** | Buka `/budgeting` → atur limit Makanan | Progress bar muncul |
| 6 | **Goals** | Buka `/goals` → buat target & setoran | Progress bertambah |
| 7 | **Hutang** | Buka `/debts` → catat piutang | Net Worth bertambah |
| 8 | **AI Advisor** | Buka `/advisor` | Skor 0-100 + 3 rekomendasi |
| 9 | **Analytics** | Buka `/analytics` | Chart cashflow + donut |
| 10 | **Ekspor** | Buka `/settings` → Unduh CSV | File ter-download |
| 11 | **Bahasa** | Toggle EN ↔ ID | Semua teks berganti |
| 12 | **Dark Mode** | Toggle tema | Tampilan berganti |

---

## 🛡️ BAGIAN 7: Monitoring & Maintenance Produksi

---

### 7.1 Health Check API

```bash
# Endpoint monitoring yang tersedia
GET /api/health
# Response: { "status": "healthy", "timestamp": "...", "version": "1.0.0" }
```

---

### 7.2 Monitoring Uptime 24/7 (Gratis)

Setup di [UptimeRobot](https://uptimerobot.com/):

| Setting | Value |
|---|---|
| Monitor Type | `HTTP(s)` |
| URL | `https://domain-anda/api/health` |
| Interval | `5 menit` |
| Alert | Email / Telegram |

---

### 7.3 Supabase Database Stats

Pantau di **Supabase Dashboard → Project Settings → Database**:
- **Database size**: Free tier max 500 MB
- **Active connections**: Free tier max 60
- **API requests**: lihat di **Reports → API**

---

### 7.4 Maintenance Rutin (Bulanan)

```sql
-- Bersihkan log aktivitas lama (> 90 hari)
DELETE FROM activity_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- Vacuum & analyze untuk performa
VACUUM ANALYZE;

-- Cek ukuran tabel
SELECT
  relname AS tabel,
  pg_size_pretty(pg_total_relation_size(relid)) AS ukuran
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

---

## 📞 BAGIAN 8: Troubleshooting & Solusi Error Umum

---

### Error 1: `new row violates row-level security policy for table`

**Penyebab**: User belum terdaftar sebagai `family_member`.

**Solusi**:
```sql
-- Cek apakah user ada
SELECT * FROM family_members WHERE user_id = 'UUID-USER';
-- Jika tidak ada → ulangi onboarding via /onboarding
```

---

### Error 2: `Cannot find module` saat install

**Solusi**:
```powershell
# Hapus node_modules dan install ulang bersih
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

### Error 3: `redirect_uri_mismatch` saat Google Login

**Penyebab**: Redirect URI belum didaftarkan di Google Cloud Console.

**Solusi**: Google Cloud → OAuth Client → tambahkan URI:
```
https://[project-ref].supabase.co/auth/v1/callback
```

---

### Error 4: Ekspor CSV berantakan di Excel

**Solusi**: Buka Excel → **Data → From Text/CSV → Encoding: UTF-8** (file sudah include BOM `\uFEFF`).

---

### Error 5: AI Gemini lambat / error

**Penyebab**: Rate limit 15 RPM tercapai atau API key tidak valid.

**Solusi**: Sistem otomatis switch ke *Heuristic Fallback Engine* — tidak ada tindakan diperlukan. Cek key di Supabase env jika error terus-menerus.

---

### Error 6: Build Vercel gagal

```powershell
# Jalankan build lokal dulu untuk debug
npm run build
# Perbaiki semua error → push ulang
```

---

### Error 7: Halaman lambat / TTFB tinggi

**Diagnosis**:
1. Vercel Dashboard → **Analytics → Core Web Vitals**
2. Supabase → **Database → Slow Query Logs**

**Solusi umum**:
```sql
-- Tambahkan index yang mungkin hilang
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  idx_transactions_family_date
  ON transactions(family_id, date DESC);
```

---

> 🚀 **Selamat! Aplikasi My Finance Anda siap digunakan di production!**
>
> 📋 Untuk panduan deployment lebih detail: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
>
> 🔄 **Versi Dokumen**: Sprint 20 — August 2026
