'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Login page gets a clean canvas without chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-50/30 dark:bg-zinc-950/20">
      
      {/* Sidebar navigation component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content page area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Main Top Header bar */}
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Dynamic page context */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

    </div>
  );
}
