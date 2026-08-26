-- ==============================================================================
-- Migration: Composite Performance Indexes for High-Velocity Financial Queries
-- Phase 8 Sprint 15: Index Optimization for Ledger, Budgets & Recurring Streams
-- ==============================================================================

-- 1. Transactions Multi-Criteria & Date Ordering Index
CREATE INDEX IF NOT EXISTS idx_transactions_family_date
ON public.transactions (family_id, transaction_date DESC, created_at DESC)
WHERE is_deleted = false;

-- 2. Transactions Type Filter Index (Income / Expense / Transfer)
CREATE INDEX IF NOT EXISTS idx_transactions_family_type_date
ON public.transactions (family_id, type, transaction_date DESC)
WHERE is_deleted = false;

-- 3. Transactions Category Filter Index
CREATE INDEX IF NOT EXISTS idx_transactions_family_category_date
ON public.transactions (family_id, category_id, transaction_date DESC)
WHERE is_deleted = false AND category_id IS NOT NULL;

-- 4. Transactions Wallet Liquidity & Transfer Reconciliation Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_date
ON public.transactions (wallet_id, transaction_date DESC)
WHERE is_deleted = false AND wallet_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_from_wallet_date
ON public.transactions (from_wallet_id, transaction_date DESC)
WHERE is_deleted = false AND from_wallet_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_transactions_to_wallet_date
ON public.transactions (to_wallet_id, transaction_date DESC)
WHERE is_deleted = false AND to_wallet_id IS NOT NULL;

-- 5. Monthly Budget Lookup Composite Index
CREATE INDEX IF NOT EXISTS idx_budgets_family_period_month
ON public.budgets (family_id, period_month);

-- 6. Recurring Transactions Next Due Date Queue Index
CREATE INDEX IF NOT EXISTS idx_recurring_family_active_due
ON public.recurring_transactions (family_id, is_active, next_due_date)
WHERE is_active = true;
