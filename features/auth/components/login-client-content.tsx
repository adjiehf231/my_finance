"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { GoogleLoginButton } from "@/features/auth/components/google-login-button";
import { ShieldCheck, Sparkles, TrendingUp, Mail, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LoginClientContent({ returnUrl }: { returnUrl: string }) {
  const { t, locale } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error(locale === "en" ? "Please enter a valid email address" : "Masukkan alamat email yang valid");
      return;
    }

    try {
      setIsSendingEmail(true);
      const supabase = createClient();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const callbackUrl = `${appUrl}/auth/callback?next=${encodeURIComponent(returnUrl)}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: callbackUrl,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsEmailSent(true);
        toast.success(t("loginPage.magicLinkSent"));
      }
    } catch {
      toast.error(locale === "en" ? "Failed to send magic link" : "Gagal mengirim tautan masuk");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
      <div className="w-full max-w-md">
        <Card className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl shadow-xl shadow-blue-500/5 p-2 sm:p-4">
          <CardContent className="pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center text-center">
            {/* Logo badge with TrendingUp finance icon */}
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-5">
              <TrendingUp className="h-7 w-7" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display mb-1.5">
              {t("loginPage.welcome")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs font-medium leading-relaxed">
              {t("loginPage.subtitle")}
            </p>

            {/* Option 1: Google Login Button */}
            <div className="w-full mb-4">
              <GoogleLoginButton redirectTo={returnUrl} />
            </div>

            {/* Divider */}
            <div className="w-full flex items-center gap-3 my-2">
              <div className="h-px bg-slate-200 dark:bg-white/[0.08] flex-1" />
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-display">
                {t("loginPage.orContinueWith")}
              </span>
              <div className="h-px bg-slate-200 dark:bg-white/[0.08] flex-1" />
            </div>

            {/* Option 2: Email Magic Link Form */}
            {isEmailSent ? (
              <div className="w-full p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-500/20 text-left my-2 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <Mail className="h-4 w-4" />
                  <span>{locale === "en" ? "Magic Link Sent!" : "Tautan Masuk Terkirim!"}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {t("loginPage.magicLinkSent")}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEmailSent(false)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline p-0 h-auto"
                >
                  {locale === "en" ? "Use different email" : "Gunakan email lain"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="w-full space-y-3 my-2 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("loginPage.emailLabel")}
                  </Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={t("loginPage.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSendingEmail || !email.trim()}
                  className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("loginPage.sendingMagicLink")}
                    </>
                  ) : (
                    <>
                      <span>{t("loginPage.sendMagicLink")}</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Value Highlights */}
            <div className="w-full pt-5 mt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-col gap-2.5 text-left">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="font-medium">{t("loginPage.feature1")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="font-medium">{t("loginPage.feature2")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <TrendingUp className="h-4 w-4 text-cyan-500 shrink-0" />
                <span className="font-medium">{t("loginPage.feature3")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5 leading-relaxed font-medium">
          {t("loginPage.terms")}
        </p>
      </div>
    </main>
  );
}
