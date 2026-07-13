'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Smartphone, Star, Settings, LogOut, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Mobiles", href: "/admin/mobiles", icon: Smartphone },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Settings", href: "/admin/settings", icon: Settings, isPlaceholder: true },
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/admin/login");
    } catch (err) {
      console.error("Sign out error in sidebar:", err);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 px-4 py-6 border-r border-zinc-150 dark:border-zinc-850">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="size-9 rounded-xl bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 flex items-center justify-center shadow-sm shrink-0 font-extrabold text-sm select-none">
          N
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-550 tracking-tight leading-none mb-1">
            Nexora
          </span>
          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
            Admin Suite
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Active state logic
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => onClose()}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-200 border border-transparent",
                isActive
                  ? "bg-blue-50 text-blue-600 border-blue-100/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30"
                  : "text-zinc-500 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon className={cn(
                "size-4 shrink-0 transition-colors",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 group-hover:text-zinc-650 dark:group-hover:text-zinc-300"
              )} />
              <span>{item.label}</span>
              {item.isPlaceholder && (
                <span className="text-[8px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-450 px-1.5 py-0.5 rounded ml-auto">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <button
          onClick={handleSignOut}
          className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-200 text-zinc-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
        >
          <LogOut className="size-4 shrink-0 text-zinc-400 group-hover:text-rose-600 dark:group-hover:text-rose-455 transition-colors" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed top-0 bottom-0 left-0 w-64 z-30">
        <SidebarContent />
      </div>

      {/* 2. Mobile/Tablet Slide-over Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-sm"
          />

          {/* Drawer Slide-in Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative flex flex-col w-64 max-w-xs h-full z-10 shadow-2xl"
          >
            {/* Close Button Inside Drawer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/50 transition-colors z-20 cursor-pointer"
              aria-label="Close sidebar drawer"
            >
              <X className="size-4" />
            </button>
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
}
