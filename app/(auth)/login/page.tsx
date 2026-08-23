import { Metadata } from "next";
import { GoogleLoginButton } from "@/features/auth/components/google-login-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ShieldCheck, Users, Sparkles, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Masuk ke Akun Anda",
  description: "Masuk ke My Finance menggunakan akun Google untuk mengakses ruang kerja finansial keluarga.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const params = await searchParams;
  const returnUrl = params.returnUrl || "/dashboard";

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#0B0F17] transition-colors duration-300 relative overflow-hidden">
      {/* Background glowing gradient accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            My<span className="text-emerald-500">Finance</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md">
          <Card className="rounded-3xl border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none p-2 sm:p-4">
            <CardContent className="pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center text-center">
              {/* Icon badge */}
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <Users className="h-7 w-7" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
                Selamat Datang! 👋
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                Kelola keuangan keluarga, anggaran, dan target impian bersama secara transparan.
              </p>

              {/* Google Login Button */}
              <div className="w-full mb-6">
                <GoogleLoginButton redirectTo={returnUrl} />
              </div>

              {/* Value Highlights */}
              <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-3 text-left">
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Keamanan tingkat enterprise dengan PostgreSQL RLS</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Didukung AI Vision OCR untuk scan struk otomatis</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>Pelaporan visual & analisis cash flow keluarga</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
            Dengan masuk, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi My Finance.
          </p>
        </div>
      </main>

      {/* Bottom info */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-600 z-10">
        &copy; {new Date().getFullYear()} My Finance. Modern Family Financial Hub.
      </footer>
    </div>
  );
}
