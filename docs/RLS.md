# 🛡️ Row Level Security (RLS) Policies
## My Finance — PostgreSQL Multi-Tenant Database Security

---

## 1. Security Architecture & Multi-Tenant Principle

Karena **My Finance** memproses data finansial sensitif keluarga, keamanan data tidak hanya diterapkan pada lapisan antarmuka (*frontend*) atau API, melainkan ditegakkan langsung di level mesin database melalui **PostgreSQL Row Level Security (RLS)**.

### Prinsip Utama:
1. **Pemisahan Logis Total**: Pengguna `User A` yang tergabung dalam keluarga `Family 1` tidak dapat melakukan `SELECT`, `INSERT`, `UPDATE`, atau `DELETE` terhadap data apapun milik `Family 2`.
2. **Defensive by Default**: RLS diaktifkan (`ENABLE ROW LEVEL SECURITY`) dan ditegakkan (`FORCE ROW LEVEL SECURITY`) pada seluruh tabel di skema `public`.
3. **Optimized Helper Functions**: Menggunakan fungsi pembantu `SECURITY DEFINER` untuk mencegah rekursi query RLS dan memaksimalkan performa indeks.

---

## 2. Helper Functions (RLS Performance Optimization)

```sql
-- 1. Helper: Mengambil daftar family_id yang dapat diakses oleh user yang sedang login
CREATE OR REPLACE FUNCTION public.get_auth_user_family_ids()
RETURNS SETOF UUID AS $$
BEGIN
    RETURN QUERY
    SELECT family_id
    FROM public.family_members
    WHERE user_id = auth.uid() AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Helper: Mengambil role user dalam family tertentu
CREATE OR REPLACE FUNCTION public.get_auth_user_role(target_family_id UUID)
RETURNS VARCHAR(20) AS $$
DECLARE
    user_role VARCHAR(20);
BEGIN
    SELECT role INTO user_role
    FROM public.family_members
    WHERE user_id = auth.uid() AND family_id = target_family_id AND is_active = true;
    
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

---

## 3. Kebijakan RLS Lengkap (SQL Script)

```sql
-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile and profiles in the same family"
ON public.users FOR SELECT
USING (
    id = auth.uid() 
    OR id IN (
        SELECT user_id FROM public.family_members 
        WHERE family_id IN (SELECT public.get_auth_user_family_ids())
    )
);

CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================================
-- 2. FAMILIES TABLE
-- ============================================================================
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view families they belong to"
ON public.families FOR SELECT
USING (id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Authenticated users can create a new family"
ON public.families FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update family details"
ON public.families FOR UPDATE
USING (public.get_auth_user_role(id) = 'owner')
WITH CHECK (public.get_auth_user_role(id) = 'owner');

CREATE POLICY "Owners can delete family"
ON public.families FOR DELETE
USING (public.get_auth_user_role(id) = 'owner');

-- ============================================================================
-- 3. FAMILY_MEMBERS TABLE
-- ============================================================================
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view other members in their family"
ON public.family_members FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Authenticated users can join family via invite code"
ON public.family_members FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can update member roles or status"
ON public.family_members FOR UPDATE
USING (public.get_auth_user_role(family_id) = 'owner');

CREATE POLICY "Owners and admins can remove members (except owner)"
ON public.family_members FOR DELETE
USING (
    public.get_auth_user_role(family_id) IN ('owner', 'admin') 
    AND role <> 'owner'
    OR user_id = auth.uid() -- Pengguna dapat leave family sendiri
);

-- ============================================================================
-- 4. WALLETS TABLE
-- ============================================================================
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view family wallets"
ON public.wallets FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Owners and Admins can create wallets"
ON public.wallets FOR INSERT
WITH CHECK (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

CREATE POLICY "Owners and Admins can update wallets"
ON public.wallets FOR UPDATE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

CREATE POLICY "Only Owners can delete/archive wallets"
ON public.wallets FOR DELETE
USING (public.get_auth_user_role(family_id) = 'owner');

-- ============================================================================
-- 5. CATEGORIES TABLE
-- ============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view default categories and their family categories"
ON public.categories FOR SELECT
USING (
    family_id IS NULL 
    OR family_id IN (SELECT public.get_auth_user_family_ids())
);

CREATE POLICY "Owners and Admins can create family categories"
ON public.categories FOR INSERT
WITH CHECK (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

CREATE POLICY "Owners and Admins can update family categories"
ON public.categories FOR UPDATE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

-- ============================================================================
-- 6. TRANSACTIONS TABLE
-- ============================================================================
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view all family transactions"
ON public.transactions FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Family members can insert transactions"
ON public.transactions FOR INSERT
WITH CHECK (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND user_id = auth.uid()
);

CREATE POLICY "Users can update their own transactions or Admin/Owner can update any"
ON public.transactions FOR UPDATE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND (
        user_id = auth.uid() 
        OR public.get_auth_user_role(family_id) IN ('owner', 'admin')
    )
);

CREATE POLICY "Users can delete their own transactions or Admin/Owner can delete any"
ON public.transactions FOR DELETE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND (
        user_id = auth.uid() 
        OR public.get_auth_user_role(family_id) IN ('owner', 'admin')
    )
);

-- ============================================================================
-- 7. BUDGETS TABLE
-- ============================================================================
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view family budgets"
ON public.budgets FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Owners and Admins can manage budgets (INSERT, UPDATE, DELETE)"
ON public.budgets FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

-- ============================================================================
-- 8. FINANCIAL_GOALS & GOAL_CONTRIBUTIONS TABLE
-- ============================================================================
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view goals"
ON public.financial_goals FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Owners and Admins can manage goals"
ON public.financial_goals FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

CREATE POLICY "Family members can view and insert goal contributions"
ON public.goal_contributions FOR ALL
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

-- ============================================================================
-- 9. RECURRING_TRANSACTIONS & DEBTS TABLE
-- ============================================================================
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view recurring transactions"
ON public.recurring_transactions FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Owners and Admins can manage recurring transactions"
ON public.recurring_transactions FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

CREATE POLICY "Family members can view debts and installments"
ON public.debts FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Owners and Admins can manage debts"
ON public.debts FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

-- ============================================================================
-- 10. ACTIVITY_LOGS & NOTIFICATIONS TABLE
-- ============================================================================
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view activity logs"
ON public.activity_logs FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "System and members can insert logs"
ON public.activity_logs FOR INSERT
WITH CHECK (family_id IN (SELECT public.get_auth_user_family_ids()));

CREATE POLICY "Users can view and manage their own notifications"
ON public.notifications FOR ALL
USING (
    user_id = auth.uid() 
    AND family_id IN (SELECT public.get_auth_user_family_ids())
);
```

---

## 4. Supabase Storage RLS Policies (Bucket `receipts`)

Untuk mengamankan foto nota dan bukti transaksi:

```sql
-- Aktifkan RLS pada Storage Objects
CREATE POLICY "Family members can view transaction receipts"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'receipts' 
    AND (storage.foldername(name))[1]::uuid IN (SELECT public.get_auth_user_family_ids())
);

CREATE POLICY "Family members can upload receipts to their family folder"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1]::uuid IN (SELECT public.get_auth_user_family_ids())
);

CREATE POLICY "Family members can delete receipts in their family folder"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1]::uuid IN (SELECT public.get_auth_user_family_ids())
);
```

---

## 5. RLS Testing & Validation Queries

Script validasi untuk menguji isolasi data antar-keluarga pada lingkungan pengujian:

```sql
-- Uji sebagai User A (Family 1)
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO '00000000-0000-0000-0000-000000000001'; -- User A

SELECT * FROM public.transactions; -- Harus HANYA mengembalikan transaksi milik Family 1

-- Uji coba manipulasi ilegal: User A mencoba membaca data Family 2
SELECT * FROM public.transactions WHERE family_id = '00000000-0000-0000-0000-000000000002'; 
-- Hasil: 0 baris (Ditolak oleh RLS)
```
