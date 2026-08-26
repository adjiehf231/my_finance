"use client";

import React from "react";
import { useTranslation, type Locale } from "@/lib/i18n/i18n-context";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  const toggleLanguage = () => {
    const nextLocale: Locale = locale === "id" ? "en" : "id";
    setLocale(nextLocale);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={locale === "id" ? "Beralih ke English" : "Switch to Bahasa Indonesia"}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl text-xs font-bold border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#131B2E]/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm transition-all duration-200 ${className}`}
    >
      <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span className="text-slate-700 dark:text-slate-200 uppercase tracking-wider">
        {locale === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
      </span>
    </button>
  );
}
