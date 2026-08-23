# 🚢 Production Deployment & DevOps Runbook
## My Finance — Vercel & Supabase Infrastructure

---

## 1. Production Architecture Overview

Aplikasi **My Finance** dirancang dengan arsitektur *serverless cloud-native* berefisiensi tinggi dan biaya optimal:

```
                  ┌─────────────────────────────────────────┐
                  │              Cloudflare DNS             │
                  │        (SSL / HTTPS / DDoS Shield)      │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │                 Vercel                  │
                  │   - Next.js 16 Edge / Serverless SSR    │
                  │   - Static Asset CDN & Image Optimizer  │
                  │   - CI/CD Automated Preview & Prod      │
                  └────────────────────┬────────────────────┘
                                       │
                         HTTPS Encrypted TLS 1.3
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │             Supabase Cloud              │
                  │  ┌─────────────────┐ ┌───────────────┐  │
                  │  │ PostgreSQL 15+  │ │ Supabase Auth │  │
                  │  │ (RLS + Triggers)│ │ (Google OAuth)│  │
                  │  ├─────────────────┤ ├───────────────┤  │
                  │  │ Storage Buckets │ │ Edge Functions│  │
                  │  │ (Receipts)      │ │ (Cron/Jobs)   │  │
                  │  └─────────────────┘ └───────────────┘  │
                  └─────────────────────────────────────────┘
```

---

## 2. Environment Strategy & Separation

| Environment | Frontend URL | Supabase Database | Branch Git |
|---|---|---|---|
| **Local Development** | `http://localhost:3000` | Supabase Local Docker Container | `feature/*` / `fix/*` |
| **Staging / Preview** | `https://preview-*.vercel.app` | Supabase Staging Project | `develop` / Pull Requests |
| **Production** | `https://myfinance.yourdomain.com` | Supabase Production Project | `main` |

---

## 3. Step-by-Step Production Setup

---

### Step 1: Konfigurasi Supabase Production
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Catat `Project URL`, `anon public key`, dan `service_role secret key`.
3. Buka **SQL Editor** dan eksekusi skrip DDL, Triggers, dan RLS dari [docs/DATABASE.md](docs/DATABASE.md) dan [docs/RLS.md](docs/RLS.md).
4. Buka menu **Storage** -> Buat bucket baru dengan nama `receipts` (Set *Private* dengan batas upload 5MB).
5. Buka menu **Authentication** -> **URL Configuration**:
   - Site URL: `https://myfinance.yourdomain.com`
   - Redirect URLs: `https://myfinance.yourdomain.com/auth/callback`

---

### Step 2: Konfigurasi Google Cloud Console (OAuth 2.0)
1. Akses [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
2. Buat **OAuth 2.0 Client ID** tipe *Web application*.
3. Masukkan **Authorized JavaScript origins**:
   - `https://your-project-ref.supabase.co`
   - `https://myfinance.yourdomain.com`
4. Masukkan **Authorized redirect URIs**:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
5. Salin `Client ID` dan `Client Secret` ke Supabase Dashboard (**Authentication** -> **Providers** -> **Google** -> *Enable*).

---

### Step 3: Deployment ke Vercel
1. Hubungkan repositori GitHub `https://github.com/adjiehf231/my_finance` ke akun Vercel.
2. Konfigurasi **Build Settings**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Tambahkan seluruh **Environment Variables** (lihat bagian 4).
4. Klik **Deploy**.

---

| Variable Name | Lingkungan | Deskripsi |
|---|:---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | URL REST endpoint Supabase Project Anda |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public Anon API Key Supabase (aman untuk browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Secret Service Role Key (akses root server-side) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Server Only | API Key Google Gemini 1.5 Flash (Vision OCR & Digest) |
| `OPENAI_API_KEY` | Server Only | (Opsional) API Key OpenAI GPT-4o-mini untuk fallback AI |
| `NEXT_PUBLIC_APP_URL` | Client & Server | Domain produksi aplikasi (misal: `https://myfinance.app`) |
| `NEXT_PUBLIC_APP_NAME` | Client | Nama aplikasi: `"My Finance"` |
| `NEXT_PUBLIC_STORAGE_BUCKET_RECEIPTS` | Client & Server | Nama bucket storage: `"receipts"` |

> 🤖 **Detail pengujian otomatis dan pipeline CI/CD lengkap dapat dipelajari di [docs/QA_AUTOMATION.md](QA_AUTOMATION.md)**.

---

## 5. CI/CD Pipeline (GitHub Actions)

File: `.github/workflows/production-deploy.yml`

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  test_and_audit:
    name: Lint, Test & Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Type Check TypeScript
        run: npx tsc --noEmit

      - name: Execute Unit & Integration Tests
        run: npm run test:coverage
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

  deploy_production:
    name: Deploy to Vercel Production
    needs: test_and_audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 6. Backup, Disaster Recovery & Rollback Strategy

### 6.1 Database Backup
- **Supabase Automated Daily Backups**: Snapshot database otomatis disimpan setiap 24 jam dengan retensi 7 hingga 30 hari.
- **Point-in-Time Recovery (PITR)**: Memungkinkan pemulihan database ke detik tertentu jika terjadi kesalahan manusia (*human error*) atau korupsi data massal.

### 6.2 Zero-Downtime Migrations
- Setiap perubahan skema SQL wajib bersifat *backward-compatible* (menambahkan kolom baru dengan nilai default, bukan langsung menghapus atau mengubah tipe kolom aktif).
- Jalankan migrasi database via Supabase CLI sebelum mempromosikan versi frontend baru.

### 6.3 Emergency Instant Rollback Runbook
Jika ditemukan bug kritis pada rilis produksi:
1. **Frontend Rollback**: Buka **Vercel Dashboard** -> **Deployments** -> Pilih deployment stabil sebelumnya -> Klik **Instant Rollback / Promote to Production** (waktu pemulihan < 10 detik).
2. **Database Rollback**: Jika migrasi SQL bermasalah, jalankan file migrasi down (*rollback script*) via Supabase SQL Editor.
