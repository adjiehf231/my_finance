"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Target,
  Wallet,
  Settings,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const bottomItems = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/transactions", label: t("nav.transactions"), icon: ArrowRightLeft },
    { href: "/wallets", label: t("nav.wallets"), icon: Wallet },
    { href: "/budgeting", label: t("nav.budgeting"), icon: PieChart },
    { href: "/goals", label: t("nav.goals"), icon: Target },
    { href: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-lg">
      {bottomItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all duration-200 ${
              isActive
                ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] tracking-tight truncate max-w-[54px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
