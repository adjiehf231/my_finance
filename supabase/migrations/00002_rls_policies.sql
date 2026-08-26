-- ============================================================================
-- MY FINANCE: 00002_rls_policies.sql
-- PostgreSQL 15+ Row Level Security (RLS) Policies
-- ============================================================================

-- 1. Helper Security Functions (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_auth_user_family_ids()
RETURNS SETOF UUID AS $$
BEGIN
    RETURN QUERY
    SELECT family_id 
    FROM public.family_members 
    WHERE user_id = auth.uid() AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_auth_user_role(target_family_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    user_role VARCHAR;
BEGIN
    SELECT role INTO user_role
    FROM public.family_members
    WHERE family_id = target_family_id 
      AND user_id = auth.uid() 
      AND is_active = true
    LIMIT 1;

    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. USERS TABLE RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view profiles of family members in shared workspace" ON public.users;
CREATE POLICY "Users can view profiles of family members in shared workspace"
ON public.users FOR SELECT
USING (
    id IN (
        SELECT fm.user_id 
        FROM public.family_members fm 
        WHERE fm.family_id IN (SELECT public.get_auth_user_family_ids())
    )
);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- 3. FAMILIES TABLE RLS
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view families they belong to" ON public.families;
CREATE POLICY "Users can view families they belong to"
ON public.families FOR SELECT
USING (
    id IN (SELECT public.get_auth_user_family_ids())
    OR created_by = auth.uid()
);

DROP POLICY IF EXISTS "Any authenticated user can create a family" ON public.families;
CREATE POLICY "Any authenticated user can create a family"
ON public.families FOR INSERT
WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
);

DROP POLICY IF EXISTS "Owners and Admins can update family details" ON public.families;
CREATE POLICY "Owners and Admins can update family details"
ON public.families FOR UPDATE
USING (
    public.get_auth_user_role(id) IN ('owner', 'admin')
    OR created_by = auth.uid()
);

DROP POLICY IF EXISTS "Only Owners can delete a family workspace" ON public.families;
CREATE POLICY "Only Owners can delete a family workspace"
ON public.families FOR DELETE
USING (
    public.get_auth_user_role(id) = 'owner'
    OR created_by = auth.uid()
);

-- 4. FAMILY_MEMBERS TABLE RLS
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view members of their families" ON public.family_members;
CREATE POLICY "Users can view members of their families"
ON public.family_members FOR SELECT
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    OR EXISTS (SELECT 1 FROM public.families f WHERE f.id = family_id AND f.created_by = auth.uid())
);

DROP POLICY IF EXISTS "Owners/Admins can add members or User joins with invite code" ON public.family_members;
CREATE POLICY "Owners/Admins can add members or User joins with invite code"
ON public.family_members FOR INSERT
WITH CHECK (
    user_id = auth.uid() 
    OR public.get_auth_user_role(family_id) IN ('owner', 'admin')
    OR EXISTS (SELECT 1 FROM public.families f WHERE f.id = family_id AND f.created_by = auth.uid())
);

DROP POLICY IF EXISTS "Owners and Admins can update member roles" ON public.family_members;
CREATE POLICY "Owners and Admins can update member roles"
ON public.family_members FOR UPDATE
USING (public.get_auth_user_role(family_id) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Owners/Admins can remove members or Member can leave" ON public.family_members;
CREATE POLICY "Owners/Admins can remove members or Member can leave"
ON public.family_members FOR DELETE
USING (
    user_id = auth.uid() 
    OR public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

-- 5. WALLETS TABLE RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Family members can view family wallets" ON public.wallets;
CREATE POLICY "Family members can view family wallets"
ON public.wallets FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

DROP POLICY IF EXISTS "Owners and Admins can create wallets" ON public.wallets;
CREATE POLICY "Owners and Admins can create wallets"
ON public.wallets FOR INSERT
WITH CHECK (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Owners and Admins can update wallets" ON public.wallets;
CREATE POLICY "Owners and Admins can update wallets"
ON public.wallets FOR UPDATE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Only Owners can delete/archive wallets" ON public.wallets;
CREATE POLICY "Only Owners can delete/archive wallets"
ON public.wallets FOR DELETE
USING (public.get_auth_user_role(family_id) = 'owner');

-- 6. CATEGORIES TABLE RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view default categories and their family categories" ON public.categories;
CREATE POLICY "Users can view default categories and their family categories"
ON public.categories FOR SELECT
USING (
    family_id IS NULL 
    OR family_id IN (SELECT public.get_auth_user_family_ids())
);

DROP POLICY IF EXISTS "Owners and Admins can create family categories" ON public.categories;
CREATE POLICY "Owners and Admins can create family categories"
ON public.categories FOR INSERT
WITH CHECK (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Owners and Admins can update family categories" ON public.categories;
CREATE POLICY "Owners and Admins can update family categories"
ON public.categories FOR UPDATE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

-- 7. TRANSACTIONS TABLE RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Family members can view all family transactions" ON public.transactions;
CREATE POLICY "Family members can view all family transactions"
ON public.transactions FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

DROP POLICY IF EXISTS "Family members can insert transactions" ON public.transactions;
CREATE POLICY "Family members can insert transactions"
ON public.transactions FOR INSERT
WITH CHECK (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND user_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can update own transactions or Admin/Owner can update any" ON public.transactions;
CREATE POLICY "Users can update own transactions or Admin/Owner can update any"
ON public.transactions FOR UPDATE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND (
        user_id = auth.uid() 
        OR public.get_auth_user_role(family_id) IN ('owner', 'admin')
    )
);

DROP POLICY IF EXISTS "Users can delete own transactions or Admin/Owner can delete any" ON public.transactions;
CREATE POLICY "Users can delete own transactions or Admin/Owner can delete any"
ON public.transactions FOR DELETE
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND (
        user_id = auth.uid() 
        OR public.get_auth_user_role(family_id) IN ('owner', 'admin')
    )
);

-- 8. BUDGETS TABLE RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Family members can view family budgets" ON public.budgets;
CREATE POLICY "Family members can view family budgets"
ON public.budgets FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

DROP POLICY IF EXISTS "Owners and Admins can manage budgets" ON public.budgets;
CREATE POLICY "Owners and Admins can manage budgets"
ON public.budgets FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

-- 9. FINANCIAL_GOALS & GOAL_CONTRIBUTIONS TABLE RLS
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Family members can view goals" ON public.financial_goals;
CREATE POLICY "Family members can view goals"
ON public.financial_goals FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

DROP POLICY IF EXISTS "Owners and Admins can manage goals" ON public.financial_goals;
CREATE POLICY "Owners and Admins can manage goals"
ON public.financial_goals FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Family members can view and insert goal contributions" ON public.goal_contributions;
CREATE POLICY "Family members can view and insert goal contributions"
ON public.goal_contributions FOR ALL
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

-- 10. RECURRING_TRANSACTIONS & DEBTS TABLE RLS
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Family members can view recurring transactions" ON public.recurring_transactions;
CREATE POLICY "Family members can view recurring transactions"
ON public.recurring_transactions FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

DROP POLICY IF EXISTS "Owners and Admins can manage recurring transactions" ON public.recurring_transactions;
CREATE POLICY "Owners and Admins can manage recurring transactions"
ON public.recurring_transactions FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Family members can view debts" ON public.debts;
CREATE POLICY "Family members can view debts"
ON public.debts FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

DROP POLICY IF EXISTS "Owners and Admins can manage debts" ON public.debts;
CREATE POLICY "Owners and Admins can manage debts"
ON public.debts FOR ALL
USING (
    family_id IN (SELECT public.get_auth_user_family_ids())
    AND public.get_auth_user_role(family_id) IN ('owner', 'admin')
);

-- 11. ACTIVITY_LOGS & NOTIFICATIONS TABLE RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Family members can view activity logs" ON public.activity_logs;
CREATE POLICY "Family members can view activity logs"
ON public.activity_logs FOR SELECT
USING (family_id IN (SELECT public.get_auth_user_family_ids()));

DROP POLICY IF EXISTS "System and members can insert logs" ON public.activity_logs;
CREATE POLICY "System and members can insert logs"
ON public.activity_logs FOR INSERT
WITH CHECK (
    family_id IN (SELECT public.get_auth_user_family_ids())
    OR EXISTS (SELECT 1 FROM public.families f WHERE f.id = family_id AND f.created_by = auth.uid())
);

DROP POLICY IF EXISTS "Users can view and manage their own notifications" ON public.notifications;
CREATE POLICY "Users can view and manage their own notifications"
ON public.notifications FOR ALL
USING (
    user_id = auth.uid() 
    AND family_id IN (SELECT public.get_auth_user_family_ids())
);
