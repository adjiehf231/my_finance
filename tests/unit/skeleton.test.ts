import { describe, it, expect } from "vitest";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton-shimmer";
import {
  DashboardSkeleton,
  TransactionTableSkeleton,
  WalletListSkeleton,
  BudgetListSkeleton,
  AnalyticsSkeleton,
} from "@/components/ui/page-skeletons";

describe("Skeleton Shimmer Component Tests", () => {
  it("should define Skeleton base component function", () => {
    expect(typeof Skeleton).toBe("function");
  });

  it("should define all page skeleton organism components", () => {
    expect(typeof DashboardSkeleton).toBe("function");
    expect(typeof TransactionTableSkeleton).toBe("function");
    expect(typeof WalletListSkeleton).toBe("function");
    expect(typeof BudgetListSkeleton).toBe("function");
    expect(typeof AnalyticsSkeleton).toBe("function");
  });
});
