import React from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileHeader } from "@/components/navigation/mobile-header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-foreground transition-colors duration-300">
      {/* Mobile Sticky Hamburger Header */}
      <MobileHeader />

      {/* Desktop Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
