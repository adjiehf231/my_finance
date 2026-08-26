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
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen sticky top-0 bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800/80 p-4 shrink-0 transition-colors z-40">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              MF
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                My Finance
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide block uppercase">
                Family Workspace
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
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 pb-0.5">
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
                      className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            isActive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-400"
                          }`}
                        />
                        <span>{t(item.key)}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-gradient-to-r from-emerald-500 to-indigo-500 text-white uppercase tracking-wider">
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
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
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
