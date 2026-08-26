"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAVIGATION_GROUPS } from "./nav-config";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { createClient } from "@/lib/supabase/client";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen sticky top-0 bg-white/80 dark:bg-[#0D111A]/80 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/[0.08] p-4 shrink-0 transition-colors z-40">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-white/[0.06] pb-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              MF
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-slate-900 dark:text-white block leading-tight font-display">
                My Finance
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold tracking-wider block uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Prestige OS
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Semantic Grouped Navigation */}
        <nav className="space-y-4 max-h-[calc(100vh-170px)] overflow-y-auto pr-1">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.id} className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 pb-0.5 font-display">
                {t(group.titleKey)}
              </h4>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 group relative ${
                        isActive
                          ? "bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-500 shadow-glow" />
                      )}
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          }`}
                        />
                        <span>{t(item.key)}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase tracking-wider shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06]">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
  );
}
