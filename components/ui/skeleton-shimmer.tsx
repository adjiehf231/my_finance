import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-200/70 dark:bg-slate-800/60",
        shimmer && "shimmer-mask",
        className
      )}
      {...props}
    />
  );
}
