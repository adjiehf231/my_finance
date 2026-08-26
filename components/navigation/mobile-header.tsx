"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { NAVIGATION_GROUPS } from "./nav-config";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { createClient } from "@/lib/supabase/client";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Top Mobile Sticky Header Bar */}
      <header className="lg:hidden sticky top-0 left-0 right-0 z-40 bg-white/85 dark:bg-[#0B0F17]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between transition-colors">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-500/20">
            MF
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            My Finance
          </span>
        </Link>

        {/* Right Controls: Quick Switcher + Hamburger Button */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Slide-over Drawer Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        >
          {/* Drawer Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 right-0 w-[82%] max-w-sm bg-white dark:bg-[#131B2E] border-l border-slate-200/80 dark:border-slate-800/80 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-300"
          >
            {/* Drawer Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    MF
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      Menu Navigasi
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      Family Workspace
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Grouped Navigation */}
              <div className="space-y-5">
                {NAVIGATION_GROUPS.map((group) => (
                  <div key={group.id} className="space-y-1.5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3">
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
                            className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
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
              </div>
            </div>

            {/* Drawer Footer Controls */}
            <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-2xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("nav.logout")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
