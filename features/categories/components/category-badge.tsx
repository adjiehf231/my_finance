import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface CategoryBadgeProps {
  category?: {
    id?: string;
    name?: string;
    color?: string;
    icon?: string;
  } | null;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category || !category.name) {
    return (
      <Badge variant="secondary" className="font-normal text-xs text-slate-500">
        Tanpa Kategori
      </Badge>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: `${category.color || "#6B7280"}18`,
        color: category.color || "#6B7280",
        border: `1px solid ${category.color || "#6B7280"}30`,
      }}
    >
      <Tag className="h-3 w-3" />
      <span>{category.name}</span>
    </div>
  );
}
