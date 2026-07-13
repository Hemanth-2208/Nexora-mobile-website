'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Mobiles", href: "/mobiles" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If path starts with /admin, hide navbar completely
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  if (isAdmin) return null;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm border-b border-zinc-100 dark:border-zinc-900 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-lg px-2 py-1"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-955 group-hover:scale-105 transition-transform duration-300 font-black text-sm select-none">
            N
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
            Nexora
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-md px-3 py-1.5",
                      isActive
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                  >
                    {link.name}
                    {/* Active Link Highlight Underline */}
                    {isActive && (
                      <motion.span
                        layoutId="activeUnderline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-zinc-900 dark:bg-zinc-50 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Button asChild size="lg" className="px-5 font-medium rounded-full cursor-pointer hover:scale-102 transition-transform">
            <Link href="/mobiles">
              Browse Mobiles
            </Link>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <Button asChild size="sm" className="px-4 font-medium rounded-full cursor-pointer">
            <Link href="/mobiles">
              Browse
            </Link>
          </Button>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex items-center justify-center p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
            aria-expanded={isMobileOpen}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 top-[60px] z-40 w-full bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 md:hidden flex flex-col px-6 py-8 gap-8 shadow-xl overflow-y-auto"
          >
            <ul className="flex flex-col gap-6">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.href}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "block text-lg font-medium transition-colors py-2 outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-md px-3",
                        isActive
                          ? "text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-900 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
