import { z } from "zod";

export const createCategorySchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid").nullable().optional(),
  name: z
    .string()
    .min(2, "Nama kategori minimal 2 karakter")
    .max(50, "Nama kategori maksimal 50 karakter"),
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Tipe harus 'income' atau 'expense'" }),
  }),
  icon: z.string().default("tag"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Warna hex tidak valid")
    .default("#10B981"),
});

export const updateCategorySchema = z.object({
  categoryId: z.string().uuid("Category ID tidak valid"),
  name: z.string().min(2, "Nama kategori minimal 2 karakter").max(50).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
