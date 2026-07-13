'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // If path starts with /admin, hide footer completely
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Left Column: Brand & Logo */}
          <div className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-lg max-w-fit"
            >
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-955 group-hover:scale-105 transition-transform duration-300 font-black text-xs select-none">
                N
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Nexora
              </span>
            </Link>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-xs">
              Discover the latest smartphones from top brands with premium shopping experience.
            </p>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/mobiles" 
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded"
                >
                  Mobiles
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column: Store Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-wider uppercase">
              Store Information
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail className="size-4 shrink-0 text-zinc-400" />
                <a 
                  href="mailto:support@nexora.com" 
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded"
                >
                  support@nexora.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Phone className="size-4 shrink-0 text-zinc-400" />
                <a 
                  href="tel:+919032535343" 
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded"
                >
                  +91 9032535343
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="size-4 shrink-0 mt-0.5 text-zinc-400" />
                <span>Bhanugudi Center, Kakinada, Andhra Pradesh - 533003</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Divider & Copyright */}
        <div className="mt-12 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-550 text-center md:text-left">
            &copy; {currentYear} Nexora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
