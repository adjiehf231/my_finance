import React from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground transition-colors duration-300">
      {/* Desktop Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto space-y-8 overflow-y-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
