export interface CategoryItem {
  id: string;
  family_id: string | null;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export const DEFAULT_CATEGORIES_DATA = [
  // Expense (10 kategori)
  { name: "Makanan & Minuman", type: "expense" as const, icon: "utensils", color: "#EF4444" },
  { name: "Transportasi", type: "expense" as const, icon: "car", color: "#F97316" },
  { name: "Kebutuhan Rumah Tangga", type: "expense" as const, icon: "home", color: "#F59E0B" },
  { name: "Listrik, Air & Internet", type: "expense" as const, icon: "zap", color: "#EAB308" },
  { name: "Pendidikan Anak", type: "expense" as const, icon: "graduation-cap", color: "#3B82F6" },
  { name: "Kesehatan & Obat", type: "expense" as const, icon: "heart-pulse", color: "#EC4899" },
  { name: "Hiburan & Liburan", type: "expense" as const, icon: "film", color: "#8B5CF6" },
  { name: "Belanja & Pakaian", type: "expense" as const, icon: "shopping-bag", color: "#06B6D4" },
  { name: "Sosial & Sedekah", type: "expense" as const, icon: "hand-heart", color: "#10B981" },
  { name: "Lain-lain", type: "expense" as const, icon: "more-horizontal", color: "#6B7280" },
  // Income (7 kategori)
  { name: "Gaji Pokok", type: "income" as const, icon: "briefcase", color: "#10B981" },
  { name: "Bonus & THR", type: "income" as const, icon: "gift", color: "#059669" },
  { name: "Hasil Usaha / Bisnis", type: "income" as const, icon: "store", color: "#047857" },
  { name: "Investasi & Dividen", type: "income" as const, icon: "trending-up", color: "#0D9488" },
  { name: "Freelance & Side Hustle", type: "income" as const, icon: "laptop", color: "#0284C7" },
  { name: "Hadiah & Hibah", type: "income" as const, icon: "sparkles", color: "#6366F1" },
  { name: "Pemasukan Lainnya", type: "income" as const, icon: "plus-circle", color: "#64748B" },
];
