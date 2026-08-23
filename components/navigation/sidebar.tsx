"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  PieChart,
  Target,
  Repeat,
  CreditCard,
  BarChart3,
  Users,
  Tags,
  LogOut,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/advisor", label: "AI Advisor", icon: Sparkles },
  { href: "/transactions", label: "Transaksi", icon: ArrowRightLeft },
  { href: "/wallets", label: "Dompet & Rekening", icon: Wallet },
  { href: "/budgeting", label: "Anggaran", icon: PieChart },
  { href: "/goals", label: "Target Tabungan", icon: Target },
  { href: "/recurring", label: "Tagihan Berulang", icon: Repeat },
  { href: "/debts", label: "Hutang & Piutang", icon: CreditCard },
  { href: "/analytics", label: "Laporan & Grafik", icon: BarChart3 },
  { href: "/categories", label: "Kategori", icon: Tags },
  { href: "/family", label: "Keluarga", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen sticky top-0 bg-white dark:bg-[#131B2E] border-r border-slate-200/80 dark:border-slate-800/80 p-4 shrink-0 transition-colors">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-3 py-2">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20">
              MF
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              My Finance
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}
