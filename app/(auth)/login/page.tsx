import { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wallet } from "lucide-react";
import { LoginClientContent } from "@/features/auth/components/login-client-content";

export const metadata: Metadata = {
  title: "Sign In | My Finance",
  description: "Sign in to My Finance using your Google account to access your family financial workspace.",
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
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            My<span className="text-blue-500">Finance</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Content (Client Component for i18n) */}
      <LoginClientContent returnUrl={returnUrl} />

      {/* Bottom info */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-600 z-10">
        &copy; {new Date().getFullYear()} My Finance. Modern Family Financial Hub.
      </footer>
    </div>
  );
}
