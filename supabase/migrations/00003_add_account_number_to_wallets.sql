-- Migration: Add account_number to wallets table
-- Date: 2026-08-26

ALTER TABLE public.wallets 
ADD COLUMN IF NOT EXISTS account_number TEXT;

COMMENT ON COLUMN public.wallets.account_number IS 'Nomor rekening bank, nomor HP e-wallet, atau nomor akun kartu';
