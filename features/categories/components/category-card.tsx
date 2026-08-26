"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag, ShieldCheck, MoreVertical, Edit3, Trash2 } from "lucide-react";
import { deleteCategoryAction, type CategoryItem } from "../actions/category-actions";
import { EditCategoryModal } from "./edit-category-modal";
import { toast } from "sonner";

interface CategoryCardProps {
  category: CategoryItem;
  onUpdate?: () => void;
}

export function CategoryCard({ category, onUpdate }: CategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus kategori "${category.name}"?`)) return;

    try {
      setIsDeleting(true);
      const res = await deleteCategoryAction(category.id);
      if (res.success) {
        toast.success(`Kategori "${category.name}" berhasil dinonaktifkan`);
        onUpdate?.();
      } else {
        toast.error(res.error || "Gagal menghapus kategori");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const isIncome = category.type === "income";

  return (
    <>
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-4 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: category.color || (isIncome ? "#10B981" : "#EF4444") }}
            >
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {category.name}
              </p>
              <p className="text-xs text-slate-400">
                {isIncome ? "Pemasukan" : "Pengeluaran"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {category.is_default ? (
              <Badge variant="secondary" className="text-[10px] flex items-center gap-1 font-normal">
                <ShieldCheck className="h-3 w-3 text-slate-400" /> Default
              </Badge>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-900"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem
                    onClick={() => setIsEditOpen(true)}
                    className="text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4 mr-2 text-emerald-600" />
                    Edit Kategori
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-rose-600 focus:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      <EditCategoryModal
        category={category}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}
