'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string>("admin@nexora.com");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Format Date client-side to prevent hydration mismatch
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date());
    setCurrentDate(formattedDate);

    // Fetch authenticated user details client-side
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setEmail(user.email === "admin@mobilestore.com" ? "admin@nexora.com" : user.email);
      }
    }
    fetchUser();
  }, []);

  const getPageTitle = (path: string) => {
    if (path === "/admin" || path === "/admin/") return "Overview";
    if (path.startsWith("/admin/mobiles")) return "Mobiles Management";
    if (path.startsWith("/admin/reviews")) return "Reviews Moderation";
    if (path.startsWith("/admin/settings")) return "System Settings";
    return "Admin Suite";
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random&size=96`;

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-zinc-150 dark:border-zinc-850 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 md:px-8">
      
      {/* Left section: Title & Menu Trigger */}
      <div className="flex items-center gap-4">
        {/* Toggle Menu Button for Mobile & Tablet */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 transition-all cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Header Titles */}
        <div className="flex flex-col">
          <h1 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-1">
            {getPageTitle(pathname)}
          </h1>
          {currentDate && (
            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
              {currentDate}
            </span>
          )}
        </div>
      </div>

      {/* Right section: Avatar, Info, Notifications */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notification Bell (Placeholder) */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 transition-all cursor-pointer select-none"
          aria-label="Notifications"
        >
          <Bell className="size-4.5" />
          <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-blue-600" />
        </button>

        {/* Admin profile detail chip */}
        <div className="flex items-center gap-3.5 pl-4 md:pl-6 border-l border-zinc-150 dark:border-zinc-850">
          <div className="hidden md:flex flex-col text-right select-none">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none mb-1">
              Administrator
            </span>
            <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 max-w-[150px] truncate leading-none">
              {email}
            </span>
          </div>

          {/* Avatar Image */}
          <div className="relative size-8 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-250/30">
            <Image
              src={avatarUrl}
              alt="Admin profile avatar image"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        </div>
      </div>

    </header>
  );
}
