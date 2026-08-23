# 🔌 API & Server Actions Specification
## My Finance — Fullstack Contract & Interfaces

---

## 1. Overview & Architectural Pattern

Aplikasi **My Finance** menggunakan pola hybrid modern di Next.js 16:

1. **Next.js Server Actions (Primary)**: Digunakan untuk mutasi data form, pemrosesan bisnis, dan validasi server-side langsung dengan Zod.
2. **Next.js Route Handlers (`/app/api/...`)**: Digunakan untuk streaming ekspor file (PDF, Excel, CSV), Webhooks, dan integrasi eksternal.
3. **Supabase PostgREST Client (Protected by RLS)**: Query data relasional terenkripsi langsung dari Server Components dengan performa tinggi.

---

## 2. Standard Response & Error Format

Seluruh Server Actions dan API Handlers mengembalikan struktur respons terstandarisasi:

```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

### Kode Error Standar:
- `UNAUTHORIZED` (401) : Sesi login tidak valid atau kadaluarsa.
- `FORBIDDEN` (403) : Pengguna tidak memiliki izin peran (*Role-Based Access Control*).
- `VALIDATION_ERROR` (422) : Input formulir gagal divalidasi skema Zod.
- `NOT_FOUND` (404) : Data keluarga, dompet, atau transaksi tidak ditemukan.
- `CONFLICT` (409) : Duplikasi entitas unik (misal: budget untuk kategori & bulan yang sama).
- `INTERNAL_SERVER_ERROR` (500) : Kesalahan sistem tak terduga.

---

## 3. Server Actions & Service Endpoints

---

### 3.1 Family Workspace Actions

#### `createFamily(data: CreateFamilyInput)`
Membuat workspace keluarga baru dan menetapkan pembuat sebagai `owner`.

```typescript
// Input Schema (Zod)
export const CreateFamilySchema = z.object({
  name: z.string().min(3, "Nama keluarga minimal 3 karakter").max(50),
  currency: z.string().length(3).default("IDR"),
});
```

- **Output Success**:
```json
{
  "success": true,
  "data": {
    "familyId": "c8f5f2a1-0000-4000-8000-000000000001",
    "name": "Keluarga Adjie",
    "inviteCode": "FAM-ADJIE-8921",
    "role": "owner"
  }
}
```

#### `joinFamilyByCode(data: { inviteCode: string })`
Bergabung ke keluarga yang sudah ada menggunakan kode undangan.

---

### 3.2 Wallets Actions

#### `getWallets()`
Mengambil seluruh rekening/dompet aktif milik keluarga yang terautentikasi.

- **Output**:
```json
{
  "success": true,
  "data": [
    {
      "id": "w1-uuid",
      "name": "BCA Utama",
      "type": "bank",
      "initialBalance": 5000000,
      "currentBalance": 12500000,
      "currency": "IDR",
      "color": "#00529B",
      "icon": "building-2",
      "isActive": true
    },
    {
      "id": "w2-uuid",
      "name": "GoPay Keluarga",
      "type": "ewallet",
      "initialBalance": 200000,
      "currentBalance": 850000,
      "currency": "IDR",
      "color": "#00AED6",
      "icon": "smartphone",
      "isActive": true
    }
  ]
}
```

#### `createWallet(data: CreateWalletInput)`
```typescript
export const CreateWalletSchema = z.object({
  name: z.string().min(2).max(40),
  type: z.enum(["cash", "bank", "ewallet", "credit_card", "investment", "other"]),
  initialBalance: z.number().min(0, "Saldo awal tidak boleh negatif"),
  color: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).default("#10B981"),
  icon: z.string().default("wallet")
});
```

---

### 3.3 Transactions Actions

#### `getTransactions(filters: TransactionFilterInput)`
Mengambil daftar transaksi dengan filter multi-parameter dan pagination.

```typescript
export const TransactionFilterSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.enum(["income", "expense", "transfer"]).optional(),
  categoryId: z.string().uuid().optional(),
  walletId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  search: z.string().optional(),
});
```

#### `createTransaction(data: CreateTransactionInput)`
Mencatat transaksi baru (Income, Expense, atau Transfer).

```typescript
export const CreateTransactionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("income"),
    walletId: z.string().uuid("Dompet tujuan wajib dipilih"),
    categoryId: z.string().uuid("Kategori wajib dipilih"),
    amount: z.number().positive("Nominal harus lebih dari 0"),
    transactionDate: z.string(), // YYYY-MM-DD
    description: z.string().max(255).optional(),
    attachmentUrl: z.string().url().optional()
  }),
  z.object({
    type: z.literal("expense"),
    walletId: z.string().uuid("Dompet sumber wajib dipilih"),
    categoryId: z.string().uuid("Kategori wajib dipilih"),
    amount: z.number().positive("Nominal harus lebih dari 0"),
    transactionDate: z.string(),
    description: z.string().max(255).optional(),
    attachmentUrl: z.string().url().optional()
  }),
  z.object({
    type: z.literal("transfer"),
    fromWalletId: z.string().uuid("Dompet asal wajib dipilih"),
    toWalletId: z.string().uuid("Dompet tujuan wajib dipilih"),
    amount: z.number().positive("Nominal transfer harus lebih dari 0"),
    transactionDate: z.string(),
    description: z.string().max(255).optional()
  }).refine((data) => data.fromWalletId !== data.toWalletId, {
    message: "Dompet asal dan tujuan tidak boleh sama",
    path: ["toWalletId"]
  })
]);
```

---

### 3.4 Budgeting Actions

#### `setCategoryBudget(data: SetBudgetInput)`
Menetapkan batas pengeluaran untuk kategori tertentu pada bulan tertentu.

```typescript
export const SetBudgetSchema = z.object({
  categoryId: z.string().uuid(),
  periodMonth: z.string().regex(/^\d{4}-\d{2}-01$/, "Format harus YYYY-MM-01"),
  amountLimit: z.number().positive("Batas anggaran harus lebih dari 0"),
  notifyThreshold: z.number().min(50).max(100).default(80)
});
```

#### `getBudgetOverview(periodMonth: string)`
Mengembalikan daftar anggaran dengan kalkulasi realisasi dan persentase otomatis.

- **Output**:
```json
{
  "success": true,
  "data": {
    "totalBudget": 8000000,
    "totalSpent": 5250000,
    "remainingBudget": 2750000,
    "overallPercentage": 65.62,
    "items": [
      {
        "budgetId": "b1-uuid",
        "category": { "id": "c1", "name": "Kebutuhan Dapur", "icon": "shopping-cart" },
        "limit": 3000000,
        "spent": 2100000,
        "remaining": 900000,
        "percentage": 70.0,
        "status": "warning"
      }
    ]
  }
}
```

---

### 3.5 Financial Goals Actions

#### `createFinancialGoal(data: CreateGoalInput)`
```typescript
export const CreateGoalSchema = z.object({
  name: z.string().min(3).max(60),
  targetAmount: z.number().positive(),
  targetDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  icon: z.string().default("target"),
  color: z.string().default("#3B82F6"),
  description: z.string().optional()
});
```

#### `addGoalContribution(data: AddContributionInput)`
Menyisihkan saldo dari wallet menuju tabungan target finansial.

```typescript
export const AddContributionSchema = z.object({
  goalId: z.string().uuid(),
  walletId: z.string().uuid("Dompet sumber dana wajib dipilih"),
  amount: z.number().positive("Nominal alokasi harus lebih dari 0"),
  notes: z.string().optional()
});
```

---

### 3.6 Dashboard & Analytics Actions

#### `getDashboardSummary()`
Mengambil seluruh metrik ringkasan untuk kartu dashboard.

- **Output**:
```json
{
  "success": true,
  "data": {
    "totalBalance": 45800000,
    "currentMonthIncome": 18500000,
    "currentMonthExpense": 9200000,
    "netCashFlow": 9300000,
    "savingsRate": 50.27,
    "financialHealthScore": 84,
    "totalAssets": 58000000,
    "totalLiabilities": 12200000,
    "netWorth": 45800000
  }
}
```

---

## 4. Route Handlers & File Exports (`/app/api/...`)

### 4.1 `/api/export/pdf` (GET)
- **Query Params**: `month=2026-08`
- **Headers**: `Accept: application/pdf`
- **Output**: Stream dokumen PDF berformat laporan keuangan formal keluarga.

### 4.2 `/api/export/excel` (GET)
- **Query Params**: `startDate=2026-01-01&endDate=2026-08-31`
- **Headers**: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Output**: File workbook `.xlsx` berisi sheet Transaksi, Ringkasan Kategori, dan Saldo Rekening.

### 4.3 `/api/upload/receipt` (POST)
- **Body**: `multipart/form-data` (file binary, max 5MB, format JPG/PNG/WEBP/PDF).
- **Proses**: Verifikasi MIME type, upload ke Supabase Storage bucket `receipts/{family_id}/{uuid}.ext`, mengembalikan public/signed URL.

---

## 5. AI Service Endpoints (`/app/api/ai/...`)

### 5.1 `/api/ai/scan-receipt` (POST)
Mengekstrak data transaksi (merchant, nominal, tanggal, kategori) dari foto nota menggunakan Vision AI.

- **Request**: `multipart/form-data` (file gambar struk)
- **Response**:
```json
{
  "success": true,
  "data": {
    "merchantName": "Super Indo Hypermart",
    "transactionDate": "2026-08-23",
    "totalAmount": 287500,
    "suggestedCategoryId": "c1-uuid",
    "suggestedCategoryName": "Kebutuhan Dapur",
    "confidenceScore": 0.96,
    "paymentMethodDetected": "qris_ewallet"
  }
}
```

### 5.2 `/api/ai/parse-transaction` (POST)
Mengubah teks singkat atau transkripsi suara menjadi payload JSON transaksi siap simpan.

- **Request Body**:
```json
{
  "text": "Beli token listrik 200 ribu bayar pakai BCA"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "type": "expense",
    "amount": 200000,
    "categoryName": "Listrik & Utilitas",
    "walletName": "BCA Utama",
    "description": "Beli token listrik",
    "transactionDate": "2026-08-23"
  }
}
```

### 5.3 `/api/ai/advisor-chat` (POST)
Chatbot asisten keuangan keluarga berbasis streaming (Server-Sent Events) dengan context grounding data keluarga.

- **Request Body**:
```json
{
  "messages": [
    { "role": "user", "content": "Kenapa pengeluaran minggu ini meningkat tajam?" }
  ]
}
```
- **Headers**: `Content-Type: text/event-stream`
- **Output**: Streaming potongan teks respons analisis dari model LLM.
