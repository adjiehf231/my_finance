import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | My Finance",
    default: "My Finance — Next-Gen Family Financial Operating System",
  },
  description:
    "Platform manajemen keuangan keluarga cerdas, modern, dan real-time. Catat pengeluaran, pantau anggaran, kelola multi-rekening, dan raih target finansial bersama.",
  keywords: [
    "keuangan keluarga",
    "family finance",
    "budgeting",
    "catat pengeluaran",
    "financial goals",
    "ai finance",
  ],
  authors: [{ name: "My Finance Team" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00F5A0" },
    { media: "(prefers-color-scheme: dark)", color: "#06080D" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground selection:bg-emerald-500/30 selection:text-emerald-400">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                className: "font-sans rounded-3xl shadow-2xl border backdrop-blur-xl",
              }}
            />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
