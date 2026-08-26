# 🚢 DEPLOYMENT GUIDE — MY FINANCE
## Production Deployment Runbook: Vercel + Supabase + Custom Domain

> Dokumen ini adalah **runbook lengkap production deployment** untuk aplikasi **My Finance** versi terbaru.
> Ikuti langkah-langkah secara berurutan untuk hasil yang benar.

---

## 📑 DAFTAR ISI

1. [Arsitektur Produksi](#1-arsitektur-produksi)
2. [Strategi Environment](#2-strategi-environment)
3. [Pre-Deployment Checklist](#3-pre-deployment-checklist)
4. [Supabase Production Setup](#4-supabase-production-setup)
5. [Google Cloud OAuth Production](#5-google-cloud-oauth-production)
6. [Deploy ke Vercel (Recommended)](#6-deploy-ke-vercel-recommended)
7. [Environment Variables Lengkap](#7-environment-variables-lengkap)
8. [Custom Domain & SSL](#8-custom-domain--ssl)
9. [Post-Deployment Verification](#9-post-deployment-verification)
10. [CI/CD Pipeline (GitHub Actions)](#10-cicd-pipeline-github-actions)
11. [Cron Job Production Setup](#11-cron-job-production-setup)
12. [Deploy ke VPS/Docker (Alternatif)](#12-deploy-ke-vpsdocker-alternatif)
13. [Database Reset & Clean](#13-database-reset--clean)
14. [Monitoring & Alerting](#14-monitoring--alerting)
15. [Backup & Disaster Recovery](#15-backup--disaster-recovery)
16. [Rollback Strategy](#16-rollback-strategy)
17. [Troubleshooting Production](#17-troubleshooting-production)
18. [Security Hardening Checklist](#18-security-hardening-checklist)

---

## 1. Arsitektur Produksi

```
        User Browser / Mobile App
                    │
                    ▼
    ┌───────────────────────────────────┐
    │         Cloudflare (DNS + CDN)    │
    │   - SSL/TLS Termination           │
    │   - DDoS Protection               │
    │   - WAF (Web App Firewall)        │
    └─────────────────┬─────────────────┘
                      │
                      ▼
    ┌───────────────────────────────────┐
    │              VERCEL               │
    │   - Next.js 15 App Router SSR     │
    │   - Serverless API Routes         │
    │   - Edge Middleware (Auth Guard)  │
    │   - Global CDN (Static Assets)    │
    │   - Automatic HTTPS               │
    │   - Vercel Cron (Recurring Jobs)  │
    └─────────────────┬─────────────────┘
                      │ HTTPS TLS 1.3
              ┌───────┴───────┐
              ▼               ▼
    ┌──────────────┐  ┌────────────────────┐
    │  Supabase    │  │   Google AI Studio │
    │  Cloud DB    │  │   Gemini 1.5 Flash │
    │  - PostgreSQL│  │   - OCR Struk      │
    │  - Auth/OAuth│  │   - AI Advisor     │
    │  - Storage   │  └────────────────────┘
    │  - RLS Guard │
    └──────────────┘
```

---

## 2. Strategi Environment

| Environment | URL | Database Supabase | Git Branch |
|---|---|---|---|
| **Local Dev** | `http://localhost:3000` | Project Supabase Dev | `feature/*` / `fix/*` |
| **Preview/Staging** | `https://preview-*.vercel.app` | Project Supabase Staging (opsional) | `develop` / PR |
| **Production** | `https://myfinance.yourdomain.com` | Project Supabase Production | `main` |

> ⚠️ **WAJIB**: Gunakan project Supabase yang **berbeda** untuk production dan development. Jangan pernah pakai database development untuk production.

---

## 3. Pre-Deployment Checklist

Lakukan validasi ini sebelum push ke production:

```powershell
# Di folder project lokal (Windows PowerShell)

# ✅ 1. TypeScript — harus 0 error
npx tsc --noEmit

# ✅ 2. Unit Tests — harus 100% passed
npm test

# ✅ 3. Build produksi lokal — harus berhasil tanpa error
npm run build

# ✅ 4. Pastikan tidak ada secret/key hardcoded di kode
git grep "AIzaSy" -- "*.ts" "*.tsx"
git grep "eyJhbGciOiJ" -- "*.ts" "*.tsx"
# Jika tidak ada output (kosong) = AMAN! (Semua secret tersimpan di .env)
# Jika ada output baris kode = BAHAYA! Jangan push!
```

---

## 4. Supabase Production Setup

### 4.1 Buat Project Supabase Production (Baru)

1. Login ke [supabase.com](https://supabase.com) → **New Project**
2. Isi detail project:
   - **Organization**: pilih org Anda
   - **Name**: `my_finance_prod`
   - **Database Password**: generate password kuat (simpan di password manager!)
   - **Region**: `Southeast Asia (Singapore)` → latensi terbaik Indonesia
   - **Plan**: Free (atau Pro jika butuh PITR backup)
3. Tunggu ~2 menit hingga project siap
4. Catat semua credential dari **Settings → API**:

```
Project URL    : https://xxxxxxxxxxxxxx.supabase.co
Anon Key       : eyJhbGci...   (NEXT_PUBLIC_SUPABASE_ANON_KEY)
Service Role   : eyJhbGci...   (SUPABASE_SERVICE_ROLE_KEY) ← RAHASIA!
```

### 4.2 Eksekusi Schema Database

Buka **SQL Editor** di Supabase Dashboard, jalankan berurutan:

**Query 1 — Schema & Tables:**
```sql
-- Salin isi file: supabase/migrations/00001_initial_schema.sql
-- Klik Run (Ctrl+Enter)
```

**Query 2 — Row Level Security:**
```sql
-- Salin isi file: supabase/migrations/00002_rls_policies.sql
-- Klik Run
```

**Query 3 (Opsional) — Seed Data Kategori:**
```sql
-- Salin isi file: supabase/seed.sql
-- Klik Run
```

Verifikasi semua tabel terbuat:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```
Harusnya muncul 13+ tabel.

### 4.3 Setup Storage Bucket

1. Menu **Storage** → **New Bucket**
2. Nama: `receipts`
3. **Public**: ✅ Aktifkan (untuk preview foto struk)
4. **File size limit**: 5 MB
5. **Allowed MIME types**: `image/jpeg, image/png, image/webp`
6. Klik **Save**

Tambahkan Storage Policy di tab **Policies**:

```sql
-- Policy: Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'receipts');

-- Policy: Allow public to read
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'receipts');

-- Policy: Allow owner to delete
CREATE POLICY "Allow owner delete"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 4.4 Konfigurasi Auth URL

Masuk ke **Authentication → URL Configuration**:

```
Site URL    : https://myfinance.yourdomain.com
Redirect URLs (tambahkan semua):
  - https://myfinance.yourdomain.com/**
  - https://myfinance.yourdomain.com/auth/callback
  - https://*.vercel.app/**
  - https://*.vercel.app/auth/callback
```

> ⚠️ Jangan hapus redirect URL lama sebelum domain baru sudah live!

---

## 5. Google Cloud OAuth Production

### 5.1 Update OAuth Client

Masuk ke [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**

Edit **OAuth 2.0 Client ID** yang sudah ada (atau buat baru):

**Authorized JavaScript Origins** — tambahkan:
```
https://myfinance.yourdomain.com
https://xxxxxxxxxxxxxx.supabase.co
```

**Authorized Redirect URIs** — tambahkan:
```
https://xxxxxxxxxxxxxx.supabase.co/auth/v1/callback
https://myfinance.yourdomain.com/auth/callback
```

### 5.2 Pasang ke Supabase

**Authentication → Providers → Google:**
- Enable: ✅
- Client ID: `[dari Google Cloud]`
- Client Secret: `[dari Google Cloud]`
- Klik **Save**

### 5.3 OAuth Consent Screen Production

Jika ingin semua user bisa login (bukan hanya test users):
1. **OAuth consent screen** → Status: **In production**
2. Klik **Publish App** → Konfirmasi

---

## 6. Deploy ke Vercel (Recommended)

### 6.1 Hubungkan GitHub Repository

1. Buka [vercel.com](https://vercel.com) → Login dengan GitHub
2. **Add New → Project**
3. Cari repo `my_finance` → **Import**
4. Konfigurasi:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Node.js Version**: `20.x`

### 6.2 Set Environment Variables

Di halaman setup Vercel, klik **Environment Variables** dan tambahkan **satu per satu**:

| Key | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | **Production Only** ⚠️ |
| `GEMINI_API_KEY` | `AIzaSy...` | Production Only |
| `CRON_SECRET` | `[random-strong-token]` | Production Only |
| `NEXT_PUBLIC_APP_URL` | `https://myfinance.yourdomain.com` | Production Only |
| `NEXT_PUBLIC_APP_NAME` | `My Finance` | Production, Preview |
| `NEXT_PUBLIC_STORAGE_BUCKET_RECEIPTS` | `receipts` | Production, Preview, Development |

> 💡 Generate CRON_SECRET yang kuat:
> ```powershell
> # PowerShell
> [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
> ```

### 6.3 Deploy

Klik **Deploy** → Tunggu ~2-3 menit → Vercel memberikan URL:
```
https://my-finance-xxxx.vercel.app
```

### 6.4 Verifikasi Build Berhasil

Cek output build di Vercel Dashboard → **Deployments** → klik deployment terbaru → **Build Logs**.

Harus tidak ada error. Warning terkait `dynamic` rendering untuk Server Actions adalah normal.

---

## 7. Environment Variables Lengkap

Berikut semua variable yang digunakan aplikasi:

```env
# =============================================
# SUPABASE — Database, Auth, Storage
# =============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =============================================
# GOOGLE GEMINI AI — OCR & AI Advisor
# =============================================
GEMINI_API_KEY=AIzaSy...

# =============================================
# SECURITY — Cron Job Auth Token
# =============================================
# Generate dengan: openssl rand -base64 32
CRON_SECRET=your-very-long-random-secret-token-here

# =============================================
# APP CONFIGURATION
# =============================================
NEXT_PUBLIC_APP_URL=https://myfinance.yourdomain.com
NEXT_PUBLIC_APP_NAME="My Finance"
NEXT_PUBLIC_STORAGE_BUCKET_RECEIPTS=receipts
NODE_ENV=production
```

> ⛔ **JANGAN PERNAH**: commit file `.env.local` atau `.env` ke Git repository!
> File ini sudah ada di `.gitignore` — pastikan tidak ter-push.

---

## 8. Custom Domain & SSL

### 8.1 Di Vercel

1. **Project Settings → Domains → Add**
2. Masukkan domain: `myfinance.yourdomain.com`
3. Vercel akan tampilkan DNS record yang perlu ditambahkan

### 8.2 Di DNS Provider (Cloudflare / Namecheap / GoDaddy)

Tambahkan record berikut sesuai panduan Vercel:

```
Type: CNAME
Name: myfinance (atau @)
Value: cname.vercel-dns.com
TTL:  Auto / 3600
```

Atau jika pakai A record:
```
Type: A
Name: myfinance
Value: 76.76.21.21
TTL:  Auto
```

### 8.3 SSL Certificate

Vercel otomatis menerbitkan SSL dari Let's Encrypt. Proses ~5-10 menit setelah DNS propagasi.

Aktifkan HTTPS Force Redirect di Vercel: **Settings → Domains → HTTPS → Force HTTPS** ✅

---

## 9. Post-Deployment Verification

Lakukan pengujian ini setelah deploy berhasil:

### 9.1 Health Check API

```bash
curl https://myfinance.yourdomain.com/api/health
# Expected: {"status":"healthy","timestamp":"...","version":"1.0.0"}
```

### 9.2 End-to-End Flow Checklist

- [ ] `GET /login` — halaman login muncul, Google OAuth button aktif
- [ ] Login via Google → redirect ke `/dashboard` berhasil
- [ ] `/dashboard` — semua metric card (balance, income, expense) tampil
- [ ] **Tambah Transaksi** → catat Rp 50.000 pengeluaran → saldo berkurang
- [ ] **Scan Struk AI** → upload foto → Gemini mengekstrak data
- [ ] `/wallets` — daftar rekening tampil, "Total Family Cash Liquidity" muncul
- [ ] `/budgeting` — progress bar anggaran tampil dengan persentase
- [ ] `/goals` — target tabungan + progress tampil
- [ ] `/debts` — daftar hutang/piutang tampil
- [ ] `/advisor` — AI Advisor score (0-100) + rekomendasi muncul
- [ ] `/analytics` — chart cashflow + donut chart tampil
- [ ] `/settings` → Ekspor CSV → download berhasil
- [ ] Toggle Bahasa ID ↔ EN → semua teks berganti bahasa
- [ ] Toggle Dark/Light Mode → tampilan berganti

### 9.3 Verifikasi Security

```bash
# Cek response headers security
curl -I https://myfinance.yourdomain.com

# Harus ada:
# Strict-Transport-Security: max-age=...
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

---

## 10. CI/CD Pipeline (GitHub Actions)

File sudah ada di `.github/workflows/ci.yml`. Pipeline berjalan otomatis setiap `git push` ke `main`:

```yaml
name: CI/CD — My Finance Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality_gate:
    name: "Quality Gate: TypeScript + Tests"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Type Check
        run: npx tsc --noEmit
      - name: Run Unit Tests
        run: npm test
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy:
    name: "Deploy to Vercel Production"
    needs: quality_gate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via Vercel CLI
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Setup GitHub Secrets untuk CI/CD

Di GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Keterangan |
|---|---|
| `VERCEL_TOKEN` | Dari Vercel Dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Dari Vercel project settings |
| `VERCEL_PROJECT_ID` | Dari Vercel project settings |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key Supabase production |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (untuk tests) |

---

## 11. Cron Job Production Setup

### 11.1 Vercel Cron (Auto — Sudah Dikonfigurasi)

File `vercel.json` sudah berisi konfigurasi cron:

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

`17:01 UTC = 00:01 WIB` → tagihan berulang diproses setiap tengah malam WIB.

Verifikasi cron berjalan: Vercel Dashboard → **Project → Cron Jobs** → lihat history eksekusi.

### 11.2 Alternatif: cron-job.org (Gratis)

Jika tidak pakai Vercel Pro:
1. Daftar di [cron-job.org](https://cron-job.org)
2. **Create Cronjob**:
   - **URL**: `https://myfinance.yourdomain.com/api/cron/recurring`
   - **Schedule**: `01 00 * * *` (setiap jam 00:01)
   - **Request Method**: `POST`
   - **Headers**:
     ```
     Authorization: Bearer [nilai CRON_SECRET Anda]
     Content-Type: application/json
     ```

Test manual cron:
```bash
curl -X POST https://myfinance.yourdomain.com/api/cron/recurring \
  -H "Authorization: Bearer [CRON_SECRET]" \
  -H "Content-Type: application/json"
# Expected: {"success": true, "processed": N}
```

---

## 12. Deploy ke VPS/Docker (Alternatif)

Jika ingin hosting mandiri di VPS (DigitalOcean, Hetzner, Contabo, dll.):

### 12.1 Setup Server

```bash
# Ubuntu 22.04 LTS
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verifikasi
docker --version
docker compose version
```

### 12.2 Clone & Configure

```bash
git clone https://github.com/adjiehf231/my_finance.git
cd my_finance

# Buat file environment production
cp .env.example .env
nano .env
# Isi semua variable sesuai Bagian 7
```

### 12.3 Build & Run

```bash
# Build image dan jalankan
docker compose up -d --build

# Cek status
docker compose ps
docker compose logs -f app

# Verifikasi berjalan
curl http://localhost:3000/api/health
```

### 12.4 Nginx Reverse Proxy + SSL

```bash
sudo apt install nginx certbot python3-certbot-nginx -y

# Buat config Nginx
sudo nano /etc/nginx/sites-available/myfinance
```

Isi:
```nginx
server {
    server_name myfinance.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy ke Next.js
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
        proxy_read_timeout 90s;
    }
}
```

```bash
# Aktifkan site
sudo ln -s /etc/nginx/sites-available/myfinance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Pasang SSL Let's Encrypt gratis
sudo certbot --nginx -d myfinance.yourdomain.com --non-interactive --agree-tos -m your@email.com

# Auto-renew SSL (sudah otomatis via systemd timer)
sudo systemctl status certbot.timer
```

---

## 13. Database Reset & Clean

> ⚠️ **HATI-HATI**: Operasi ini **PERMANEN** dan tidak bisa di-undo tanpa backup!

### 13.1 Hapus Semua Data (Truncate — Struktur Tetap)

```sql
-- Jalankan di Supabase SQL Editor
-- Urutan penting: child tables dulu karena foreign key!
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

### 13.2 Hapus Data Satu Family/User

```sql
-- Ganti dengan family_id yang ingin dihapus
-- CASCADE akan hapus semua data terkait otomatis
DELETE FROM families
WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

### 13.3 Lihat Semua Family yang Ada

```sql
SELECT f.id, f.name, f.created_at,
       COUNT(DISTINCT fm.user_id) as total_members,
       COUNT(DISTINCT t.id) as total_transactions
FROM families f
LEFT JOIN family_members fm ON fm.family_id = f.id
LEFT JOIN transactions t ON t.family_id = f.id
GROUP BY f.id, f.name, f.created_at
ORDER BY f.created_at DESC;
```

### 13.4 Reset Total (Drop + Recreate)

```sql
-- Langkah 1: Drop semua tabel
DROP TABLE IF EXISTS
  activity_logs, receipt_scans, recurring_bills,
  budget_categories, budgets, goals, debts,
  transactions, wallets, family_members, families,
  user_profiles, categories
CASCADE;

-- Langkah 2: Jalankan ulang migrasi dari file:
-- supabase/migrations/00001_initial_schema.sql
-- supabase/migrations/00002_rls_policies.sql
```

---

## 14. Monitoring & Alerting

### 14.1 Uptime Monitoring (Gratis)

Setup di [UptimeRobot](https://uptimerobot.com/) atau [BetterStack](https://betterstack.com/):

| Setting | Value |
|---|---|
| **Monitor Type** | HTTP(s) |
| **URL** | `https://myfinance.yourdomain.com/api/health` |
| **Interval** | 5 menit |
| **Alert Email** | email Anda |
| **Expected Status** | `200 OK` |

### 14.2 Supabase Monitoring

Di Supabase Dashboard → **Project Settings → Database**:
- **Database Size**: pantau penggunaan (Free = 500MB)
- **Active Connections**: Free tier max 60 connections
- **API Requests**: pantau di **Reports → API**

### 14.3 Vercel Analytics

Aktifkan di Vercel Dashboard → **Analytics** → **Enable**:
- Real User Monitoring (Core Web Vitals)
- Page views dan performance metrics

---

## 15. Backup & Disaster Recovery

### 15.1 Backup Database Otomatis

**Supabase Free Tier**: Backup harian otomatis, retensi 7 hari.
**Supabase Pro Tier**: PITR (Point-in-Time Recovery) hingga 30 hari.

Cara restore backup di Supabase:
1. **Settings → Database → Backups**
2. Pilih tanggal backup
3. Klik **Restore**

### 15.2 Backup Manual via Aplikasi

User dapat export semua data via `/settings`:
- **CSV**: Laporan transaksi lengkap
- **JSON Takeout**: Semua data keluarga (sesuai UU PDP No. 27/2022)

### 15.3 Backup via pg_dump (Server-level)

```bash
# Dari VPS atau lokal menggunakan connection string Supabase
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --no-acl --no-owner \
  -f backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  < backup_YYYYMMDD_HHMMSS.sql
```

---

## 16. Rollback Strategy

### 16.1 Frontend Rollback (< 30 detik)

1. Vercel Dashboard → **Deployments**
2. Temukan deployment yang stabil (sebelum bug)
3. Klik **⋯ (three dots) → Promote to Production**
4. Konfirmasi → Live dalam ~10 detik

### 16.2 Database Rollback

Jika migrasi SQL bermasalah:

```sql
-- Jalankan rollback script yang sesuai
-- File: supabase/migrations/00001_rollback.sql (jika ada)

-- Atau restore dari backup Supabase:
-- Settings → Database → Backups → pilih tanggal → Restore
```

### 16.3 Git Revert

```bash
# Lihat history commit
git log --oneline -10

# Revert commit tertentu tanpa menghapus history
git revert [commit-hash]
git push origin main
# → Vercel otomatis re-deploy
```

---

## 17. Troubleshooting Production

### ❌ Error: `NEXT_REDIRECT` atau redirect loop

**Penyebab**: `NEXT_PUBLIC_APP_URL` tidak sesuai dengan domain aktual.

**Solusi**:
```
Vercel Dashboard → Environment Variables
→ NEXT_PUBLIC_APP_URL = https://domain-aktual-anda.com
→ Redeploy
```

### ❌ Error: `new row violates row-level security policy`

**Penyebab**: User belum terdaftar sebagai `family_member`.

**Solusi**: Debug di SQL Editor:
```sql
-- Cek apakah user ada di family_members
SELECT * FROM family_members
WHERE user_id = 'UUID-USER-DARI-AUTH';
```

### ❌ Google Login: `redirect_uri_mismatch`

**Penyebab**: Redirect URI belum ditambahkan di Google Cloud Console.

**Solusi**: Google Cloud → OAuth Client → tambahkan:
```
https://[project-ref].supabase.co/auth/v1/callback
```

### ❌ Storage upload gagal: `403 Forbidden`

**Penyebab**: Storage policy tidak benar.

**Solusi**: Supabase → Storage → `receipts` → Policies → tambahkan policy INSERT untuk authenticated users.

### ❌ Build Vercel gagal: `Type error`

**Penyebab**: TypeScript error di kode.

**Solusi**:
```powershell
npx tsc --noEmit
# Perbaiki semua error yang muncul
npm run build
git push
```

### ❌ Cron Job tidak berjalan

**Verifikasi**:
1. Vercel Dashboard → **Cron Jobs** → cek history
2. Test manual: `curl -X POST [URL]/api/cron/recurring -H "Authorization: Bearer [SECRET]"`
3. Pastikan `CRON_SECRET` di Vercel env sama dengan yang ada di request header

---

## 18. Security Hardening Checklist

Pastikan semua item ini terpenuhi sebelum go-live:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` — **hanya di server env**, tidak di `NEXT_PUBLIC_*`
- [ ] RLS diaktifkan di semua 13 tabel (verify via Supabase → Table Editor)
- [ ] `CRON_SECRET` — string random panjang, bukan default value
- [ ] Domain production sudah pakai HTTPS (SSL aktif)
- [ ] Security headers di Nginx/Vercel sudah aktif
- [ ] Google OAuth Consent Screen sudah "In Production" (bukan Testing)
- [ ] Tidak ada API key / secret yang ter-commit ke Git
- [ ] `.env.local` ada di `.gitignore` ✅
- [ ] Storage bucket policy: upload hanya untuk authenticated user
- [ ] Rate limiting API Gemini dikonfigurasi (15 RPM — sudah ada fallback)
- [ ] Supabase email confirmation: matikan jika tidak perlu (Settings → Auth → Email Confirmations)

---

> 📞 **Masalah?** Cek log di Vercel Dashboard → **Functions** → pilih function yang error → lihat **Runtime Logs**.
>
> 🔄 **Last Updated**: Sprint 20 — August 2026
>
> ✅ **Status**: Production Ready
