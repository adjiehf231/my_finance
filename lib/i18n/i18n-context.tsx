"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { idDictionary, type TranslationDictionary } from "./dictionaries/id";
import { enDictionary } from "./dictionaries/en";

export type Locale = "id" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: TranslationDictionary;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const dictionaries: Record<Locale, TranslationDictionary> = {
  id: idDictionary,
  en: enDictionary,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("my_finance_locale") as Locale | null;
      if (savedLocale === "id" || savedLocale === "en") {
        setLocaleState(savedLocale);
      }
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("my_finance_locale", newLocale);
      document.cookie = `my_finance_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
  };

  const dict = dictionaries[locale] || idDictionary;

  /**
   * Helper translation function supporting nested dot-notation paths
   * e.g., t("common.save") or t("nav.dashboard")
   */
  const t = (path: string, params?: Record<string, string | number>): string => {
    const keys = path.split(".");
    let current: any = dict;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to Indonesian if key not found
        let fallbackCurrent: any = idDictionary;
        for (const fbKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === "object" && fbKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbKey];
          } else {
            return path;
          }
        }
        current = fallbackCurrent;
        break;
      }
    }

    if (typeof current !== "string") {
      return path;
    }

    let result = current;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue));
      });
    }

    return result;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, dict, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Return safe default when outside provider (e.g. testing)
    return {
      locale: "id" as Locale,
      setLocale: () => {},
      dict: idDictionary,
      t: (path: string) => {
        const keys = path.split(".");
        let current: any = idDictionary;
        for (const k of keys) {
          if (current && typeof current === "object" && k in current) {
            current = current[k];
          } else {
            return path;
          }
        }
        return typeof current === "string" ? current : path;
      },
    };
  }
  return context;
}
