import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | My Finance",
    default: "My Finance — Modern Family Financial Management",
  },
  description:
    "Platform manajemen keuangan keluarga modern. Catat, pantau, anggarkan, dan wujudkan impian finansial bersama dalam satu ruang kerja keluarga.",
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
    { media: "(prefers-color-scheme: light)", color: "#10B981" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F17" },
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
    <html lang="id" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "font-sans rounded-2xl shadow-lg border",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
