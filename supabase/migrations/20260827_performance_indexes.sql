-- ============================================================================
-- Migration: Performance Composite Indexes for Scaling
-- ============================================================================

-- 1. Transactions: Accelerate ledger loading and date-range queries per family
CREATE INDEX IF NOT EXISTS idx_transactions_family_date 
ON public.transactions(family_id, date DESC);

-- 2. Transactions: Filter by type (income/expense/transfer) per family
CREATE INDEX IF NOT EXISTS idx_transactions_family_type 
ON public.transactions(family_id, type);

-- 3. Wallets: Accelerate active wallets balance lookups per family
CREATE INDEX IF NOT EXISTS idx_wallets_family_active 
ON public.wallets(family_id, is_active);

-- 4. Activity Logs: Accelerate audit logs stream by timestamp
CREATE INDEX IF NOT EXISTS idx_activity_logs_family_created 
ON public.activity_logs(family_id, created_at DESC);

-- 5. Family Members: Accelerate user membership & role lookups
CREATE INDEX IF NOT EXISTS idx_family_members_user_family 
ON public.family_members(user_id, family_id);

-- 6. Budgets: Accelerate month/year budget lookups per family
CREATE INDEX IF NOT EXISTS idx_budgets_family_period 
ON public.budgets(family_id, month, year);

-- 7. Savings Goals: Accelerate active goals per family
CREATE INDEX IF NOT EXISTS idx_goals_family_status 
ON public.goals(family_id, status);

-- 8. Debts: Accelerate unpaid debts per family
CREATE INDEX IF NOT EXISTS idx_debts_family_status 
ON public.debts(family_id, status);
