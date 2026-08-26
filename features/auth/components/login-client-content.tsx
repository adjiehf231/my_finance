"use client";

import { useTranslation } from "@/lib/i18n/i18n-context";
import { GoogleLoginButton } from "@/features/auth/components/google-login-button";
import { ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoginClientContent({ returnUrl }: { returnUrl: string }) {
  const { t } = useTranslation();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none p-2 sm:p-4">
          <CardContent className="pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center text-center">
            {/* Icon badge */}
            <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Users className="h-7 w-7" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
              {t("loginPage.welcome")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
              {t("loginPage.subtitle")}
            </p>

            {/* Google Login Button */}
            <div className="w-full mb-6">
              <GoogleLoginButton redirectTo={returnUrl} />
            </div>

            {/* Value Highlights */}
            <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                <span>{t("loginPage.feature1")}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{t("loginPage.feature2")}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
                <span>{t("loginPage.feature3")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          {t("loginPage.terms")}
        </p>
      </div>
    </main>
  );
}
