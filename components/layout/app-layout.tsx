import React from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileHeader } from "@/components/navigation/mobile-header";
import { CommandPalette } from "@/components/navigation/command-palette";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-[#07090E] bg-cyber-radial text-foreground transition-colors duration-300">
      {/* Mobile Sticky Hamburger Header */}
      <MobileHeader />

      {/* Desktop Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Global Command Palette & Keyboard Shortcuts */}
      <CommandPalette />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1400px] mx-auto space-y-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
