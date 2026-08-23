# 📖 PANDUAN AKSES & OPERASIONAL SISTEM (MY FINANCE)

Dokumen ini berisi panduan lengkap untuk melakukan konfigurasi, menjalankan (*running*), menguji (*testing*), dan mendeploy aplikasi **My Finance** baik pada lingkungan **Lokal (Development)** maupun **Produksi (Production)**.

---

## 💎 Ringkasan Tech Stack (100% Free & Open Source)

Aplikasi dibangun dengan arsitektur modern berstandar enterprise tanpa dependensi berbayar:

| Lapisan / Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend Web** | Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui, Recharts | Server-Side Rendering (SSR) & Server Actions |
| **Backend & Database** | Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth & Storage | Database relational dengan trigger otomatis |
| **Mobile Client** | React Native Expo SDK 52, Expo Router, SQLite (expo-sqlite) | Offline-First, Biometrik & Last-Write-Wins Sync |
| **Kecerdasan Buatan (AI)**| Google Gemini 1.5 Flash (Google AI Studio Free Tier) | OCR Multimodal Struk & AI Financial Advisor |
| **Push Notification** | Expo Push Notification Gateway (`https://exp.host`) | 100% Gratis tanpa biaya server push |
| **Testing Framework** | Vitest, React Testing Library | 58 Unit Tests Terverifikasi |

---

## 🛠️ 1. Menjalankan Sistem di Lingkungan Lokal (Development)

### A. Prasyarat Sistem
Pastikan perangkat Anda telah terinstall:
- **Node.js**: Versi `v20.x` atau `v22.x` (LTS direkomendasikan)
- **NPM**: Versi `10.x+`
- **Git**: Versi `2.x+`

---

### B. Konfigurasi Environment Variables (`.env.local`)
Buat atau periksa file `.env.local` di root direktori project:

```env
# ==========================================
# 1. SUPABASE (Database, Auth, Storage)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ==========================================
# 2. GOOGLE GEMINI AI (Free Tier)
# ==========================================
# Dapatkan gratis di https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# ==========================================
# 3. CRON JOB SECURITY KEY
# ==========================================
CRON_SECRET=my_finance_secure_cron_token_2026

# ==========================================
# 4. APP URL CONFIGURATION
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!NOTE]
> Jika `GEMINI_API_KEY` dikosongkan saat development lokal, sistem akan **secara otomatis mengaktifkan Heuristic Fallback Engine** sehingga seluruh fitur (OCR & AI Advisor) tetap dapat diuji tanpa error.

---

### C. Inisialisasi Database Supabase
Jika menghubungkan ke instance Supabase baru:
1. Buka **SQL Editor** pada Supabase Dashboard Anda.
2. Jalankan migration file [supabase/migrations/00001_initial_schema.sql](file:///d:/TMT/Prorgram/MY%20FINANCE/supabase/migrations/00001_initial_schema.sql) (13 tabel + Triggers otomatis mutasi saldo).
3. Jalankan migration file [supabase/migrations/00002_rls_policies.sql](file:///d:/TMT/Prorgram/MY%20FINANCE/supabase/migrations/00002_rls_policies.sql) (Row Level Security untuk seluruh 13 tabel).
4. Buat Storage Bucket bernama `receipts` dengan akses Public read dan Authenticated upload.

---

### D. Menjalankan Web Application (Next.js Dev Server)
Jalankan perintah berikut di root folder project:

```powershell
# 1. Install dependensi (jika baru cloning)
npm install

# 2. Jalankan Development Server
npm run dev
```

Buka browser Anda di **[http://localhost:3000](http://localhost:3000)**:
- Halaman Login: `http://localhost:3000/login`
- Onboarding Wizard: `http://localhost:3000/onboarding`
- Dashboard Finansial: `http://localhost:3000/dashboard`

---

### E. Menjalankan Unit Test & Verifikasi Kode
Untuk memastikan kualitas kode tanpa bug sebelum commit:

```powershell
# 1. Type Check (TypeScript strict verification)
npm run type-check

# 2. Menjalankan Seluruh 58 Unit Test Suite (Vitest)
npm test

# 3. Menjalankan Test Coverage Report
npm run test:coverage
```

---

### F. Menjalankan Aplikasi Mobile (React Native Expo)
Untuk menjalankan versi mobile di emulator atau perangkat fisik (Android / iOS):

```powershell
# Masuk ke direktori mobile
cd mobile

# Install dependensi mobile
npm install

# Jalankan Expo bundler
npx expo start
```
- Tekan `a` untuk membuka di **Android Emulator / Device**.
- Tekan `i` untuk membuka di **iOS Simulator**.
- Pindai QR code menggunakan aplikasi **Expo Go** pada smartphone fisik Anda.

---

## 🚀 2. Panduan Deployment Produksi (Production Deployment)

### Opsi 1: Vercel (Rekomendasi Terbaik & Gratis)
1. Push repository Anda ke GitHub / GitLab:
   ```powershell
   git push origin main
   ```
2. Buka **[https://vercel.com](https://vercel.com)** $\rightarrow$ **Add New Project** $\rightarrow$ Pilih repositori `my_finance`.
3. Masukkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `CRON_SECRET`
   - `NEXT_PUBLIC_APP_URL` (Domain Vercel Anda, misal: `https://myfinance.vercel.app`)
4. Klik **Deploy**. Vercel akan otomatis melakukan `npm run build` dan mempublikasikan aplikasi ke CDN global.

---

### Opsi 2: Docker / VPS Self-Hosted (Coolify / Docker Compose)
Gunakan konfigurasi Docker multi-stage build yang efisien:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

---

## ⏰ 3. Konfigurasi Otomasi Cron Job (Tagihan Berulang)

Untuk mengeksekusi tagihan berulang secara otomatis setiap hari pada pukul 00:01 WIB:
- **Endpoint**: `POST https://your-domain.com/api/cron/recurring`
- **Header Otorisasi**: `Authorization: Bearer <CRON_SECRET>`

### Menggunakan Cron-Job.org / Vercel Cron (Gratis)
Tambahkan konfigurasi `vercel.json`:
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
*(17:01 UTC = 00:01 WIB)*

---

## 🗺️ 4. Peta Rute Navigasi Web & API Endpoints

### Rute Halaman Web (Web App Routes)
| URL Path | Deskripsi Halaman |
| :--- | :--- |
| `/` | Landing Redirect & Sesi Checker |
| `/login` | Autentikasi Google OAuth & Passwordless Supabase |
| `/onboarding` | 7-Step Onboarding Wizard Ruang Kerja Keluarga |
| `/dashboard` | **Dashboard Finansial Utama** (Saldo, Cashflow Area Chart, Donut Breakdown, Quick Add, Transaksi Terkini) |
| `/transactions` | Buku Kas Mutasi Keuangan & Filter Ledger |
| `/wallets` | Manajemen Multi-Dompet (Bank, Tunai, E-Wallet) |
| `/budgeting` | Manajemen Batas Anggaran Bulanan & Indikator Overbudget |
| `/goals` | Manajemen Target Tabungan & Buku Catatan Setoran |
| `/recurring` | Otomasi Tagihan Berulang (Harian, Mingguan, Bulanan, Tahunan) |
| `/debts` | Pelacak Hutang Piutang & Pencatatan Cicilan Pelunasan |
| `/analytics` | Laporan Visualisasi Grafik & Analisis Trend Arus Kas |
| `/advisor` | **AI Financial Health Advisor** (Skor 0-100 & Smart OCR Scanner Struk) |
| `/gamification`| **Pusat Level Finansial Keluarga & 8 Lencana Pencapaian** |
| `/activity` | **Audit Trail & Feed Riwayat Aktivitas Keluarga** |
| `/settings` | Pengaturan Keamanan, Privasi UU PDP & Ekspor CSV/JSON |
| `/categories` | Manajemen Kategori Pemasukan & Pengeluaran |
| `/family` | Manajemen Anggota Keluarga & RBAC (Owner/Admin/Member) |

---

### Rute REST API
| Endpoint | Method | Deskripsi |
| :--- | :--- | :--- |
| `/api/sync` | `POST` | Endpoint sinkronisasi batch mobile (*Sync Up & Down LWW*) |
| `/api/cron/recurring` | `POST` | Background worker automasi tagihan berulang |
| `/auth/callback` | `GET` | Callback pertukaran token OAuth Supabase |

---

## 🛡️ 5. Kepatuhan Keamanan & Privasi Data

- **Row Level Security (RLS)**: Seluruh data tabel dilindungi RLS sehingga pengguna hanya dapat mengakses data keluarga di mana mereka terdaftar secara aktif.
- **Enterprise Security Headers**: Mencegah serangan Clickjacking (`X-Frame-Options: DENY`), MIME Sniffing (`nosniff`), dan mewajibkan HTTPS (`HSTS max-age=63072000`).
- **Data Portability & Erasure (UU PDP No. 27/2022)**: Tersedia fitur unduh data utuh keluarga (JSON) dan opsi permohonan penghapusan data permanen (*Right to be Forgotten*) pada halaman `/settings`.

---

## 📞 6. Bantuan & Troubleshooting

1. **Error: Database RLS Violation / Permission Denied**
   - *Penyebab*: Pengguna belum menyelesaikan wizard onboarding atau belum terdaftar pada tabel `family_members`.
   - *Solusi*: Arahkan ke `/onboarding` untuk membuat atau bergabung ke ruang kerja keluarga.
2. **Error: Gemini API Rate Limit (429 Too Many Requests)**
   - *Solusi*: Sistem secara otomatis beralih ke *Heuristic Fallback Engine* tanpa memutus alur pengguna.
3. **Ekspor CSV karakter berantakan di Excel**
   - *Solusi*: File generator telah dilengkapi **UTF-8 BOM (`\uFEFF`)** sehingga Microsoft Excel langsung mengenali format Rupiah dan teks beraksen secara rapi.
