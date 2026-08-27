-- ============================================================================
-- Migration: Add custom_permissions JSONB to families table
-- ============================================================================

ALTER TABLE public.families
ADD COLUMN IF NOT EXISTS custom_permissions JSONB DEFAULT NULL;

-- Comment for schema documentation
COMMENT ON COLUMN public.families.custom_permissions IS 'Custom CRUD & feature permissions for Admin, Member, Viewer roles configured by Owner.';
