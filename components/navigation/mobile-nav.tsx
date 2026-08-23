"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Target,
  Wallet,
} from "lucide-react";

const BOTTOM_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ArrowRightLeft },
  { href: "/wallets", label: "Dompet", icon: Wallet },
  { href: "/budgeting", label: "Anggaran", icon: PieChart },
  { href: "/goals", label: "Goals", icon: Target },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
      {BOTTOM_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive
                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
