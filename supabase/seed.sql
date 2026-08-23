-- ============================================================================
-- MY FINANCE: seed.sql
-- Default Categories Seed Data
-- ============================================================================

INSERT INTO public.categories (id, family_id, name, type, icon, color, is_default, is_active)
VALUES
    -- Default Expense Categories
    (gen_random_uuid(), NULL, 'Makanan & Minuman', 'expense', 'utensils', '#EF4444', true, true),
    (gen_random_uuid(), NULL, 'Transportasi', 'expense', 'car', '#F97316', true, true),
    (gen_random_uuid(), NULL, 'Kebutuhan Rumah Tangga', 'expense', 'home', '#F59E0B', true, true),
    (gen_random_uuid(), NULL, 'Listrik, Air & Internet', 'expense', 'zap', '#EAB308', true, true),
    (gen_random_uuid(), NULL, 'Pendidikan Anak', 'expense', 'graduation-cap', '#3B82F6', true, true),
    (gen_random_uuid(), NULL, 'Kesehatan & Obat', 'expense', 'heart-pulse', '#EC4899', true, true),
    (gen_random_uuid(), NULL, 'Hiburan & Liburan', 'expense', 'film', '#8B5CF6', true, true),
    (gen_random_uuid(), NULL, 'Belanja & Pakaian', 'expense', 'shopping-bag', '#06B6D4', true, true),
    (gen_random_uuid(), NULL, 'Sosial & Sedekah', 'expense', 'hand-heart', '#10B981', true, true),
    (gen_random_uuid(), NULL, 'Lain-lain', 'expense', 'more-horizontal', '#6B7280', true, true),

    -- Default Income Categories
    (gen_random_uuid(), NULL, 'Gaji Pokok', 'income', 'briefcase', '#10B981', true, true),
    (gen_random_uuid(), NULL, 'Bonus & THR', 'income', 'gift', '#059669', true, true),
    (gen_random_uuid(), NULL, 'Hasil Usaha / Bisnis', 'income', 'store', '#047857', true, true),
    (gen_random_uuid(), NULL, 'Investasi & Dividen', 'income', 'trending-up', '#0D9488', true, true),
    (gen_random_uuid(), NULL, 'Freelance & Side Hustle', 'income', 'laptop', '#0284C7', true, true),
    (gen_random_uuid(), NULL, 'Hadiah & Hibah', 'income', 'sparkles', '#6366F1', true, true),
    (gen_random_uuid(), NULL, 'Pemasukan Lainnya', 'income', 'plus-circle', '#64748B', true, true)
ON CONFLICT DO NOTHING;
