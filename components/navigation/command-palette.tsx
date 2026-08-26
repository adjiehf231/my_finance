"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Wallet,
  PieChart,
  Target,
  CreditCard,
  Repeat,
  BarChart3,
  Sparkles,
  Settings,
  Tags,
  Users,
  Activity,
  Trophy,
  Search,
  Command,
  Plus,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface CommandItem {
  id: string;
  titleKey: string;
  href: string;
  icon: React.ElementType;
  category: "navigation" | "action";
  badge?: string;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: "dashboard", titleKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard, category: "navigation" },
  { id: "transactions", titleKey: "nav.transactions", href: "/transactions", icon: ArrowRightLeft, category: "navigation" },
  { id: "wallets", titleKey: "nav.wallets", href: "/wallets", icon: Wallet, category: "navigation" },
  { id: "budgeting", titleKey: "nav.budgeting", href: "/budgeting", icon: PieChart, category: "navigation" },
  { id: "goals", titleKey: "nav.goals", href: "/goals", icon: Target, category: "navigation" },
  { id: "debts", titleKey: "nav.debts", href: "/debts", icon: CreditCard, category: "navigation" },
  { id: "recurring", titleKey: "nav.recurring", href: "/recurring", icon: Repeat, category: "navigation" },
  { id: "analytics", titleKey: "nav.analytics", href: "/analytics", icon: BarChart3, category: "navigation" },
  { id: "advisor", titleKey: "nav.advisor", href: "/advisor", icon: Sparkles, category: "navigation", badge: "AI Copilot" },
  { id: "categories", titleKey: "nav.categories", href: "/categories", icon: Tags, category: "navigation" },
  { id: "family", titleKey: "nav.family", href: "/family", icon: Users, category: "navigation" },
  { id: "activity", titleKey: "nav.activity", href: "/activity", icon: Activity, category: "navigation" },
  { id: "gamification", titleKey: "nav.gamification", href: "/gamification", icon: Trophy, category: "navigation" },
  { id: "settings", titleKey: "nav.settings", href: "/settings", icon: Settings, category: "navigation" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (!isInput && e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // 'N' opens command palette to quickly navigate or search
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = COMMAND_ITEMS.filter((item) => {
    const title = t(item.titleKey).toLowerCase();
    const query = search.toLowerCase().trim();
    return title.includes(query) || item.id.includes(query);
  });

  const handleSelect = (href: string) => {
    setOpen(false);
    setSearch("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-lg overflow-hidden rounded-3xl bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
        <DialogTitle className="sr-only">Navigasi Cepat & Command Palette</DialogTitle>
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#07090E]/50">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Cari menu, fitur, atau halaman... (Ctrl + K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none focus-visible:ring-0 shadow-none bg-transparent h-13 text-sm font-semibold text-slate-900 dark:text-white"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 dark:bg-white/[0.08] px-2 py-0.5 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">
              Tidak ada hasil yang cocok dengan &quot;{search}&quot;
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{t(item.titleKey)}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-50/80 dark:bg-[#07090E]/80 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Command className="h-3 w-3 text-blue-500" />
            <span>Tekan <kbd className="font-mono font-bold text-slate-600 dark:text-slate-300">Ctrl+K</kbd> kapan saja untuk mencari</span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px]">v1.0.0</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
