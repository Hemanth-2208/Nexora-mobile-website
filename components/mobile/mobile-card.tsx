'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mobile } from "@/types/database";
import { cn, isValidImageUrl } from "@/lib/utils";

interface MobileCardProps {
  mobile: Mobile;
}

export default function MobileCard({ mobile }: MobileCardProps) {
  const [imgError, setImgError] = useState(false);
  const isOutOfStock = mobile.stock_status === "Out of Stock";

  const getStockBadgeStyles = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-50/90 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800/30";
      case "Limited Stock":
        return "bg-amber-50/90 text-amber-700 border-amber-200/50 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800/30";
      case "Out of Stock":
        return "bg-rose-50/90 text-rose-700 border-rose-200/50 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800/30";
      default:
        return "bg-zinc-50/90 text-zinc-700 border-zinc-200/50 dark:bg-zinc-900/80 dark:text-zinc-400 dark:border-zinc-800/30";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col h-full bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-shadow duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] w-full bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden border-b border-zinc-100 dark:border-zinc-800/50">
        {!imgError && mobile.images && mobile.images.length > 0 && isValidImageUrl(mobile.images[0]) ? (
          <Image
            src={mobile.images[0]}
            alt={mobile.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-106"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/50 dark:to-zinc-950/50 text-zinc-400 dark:text-zinc-600 p-6 select-none">
            <Smartphone className="size-14 stroke-[1] mb-3 text-zinc-300 dark:text-zinc-700 group-hover:scale-110 transition-transform duration-500" />
            <span className="text-[10px] font-bold tracking-widest uppercase mb-1 text-zinc-400 dark:text-zinc-500">{mobile.brand}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center line-clamp-1 px-4">{mobile.name}</span>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md shadow-sm transition-all duration-300",
            getStockBadgeStyles(mobile.stock_status)
          )}>
            <span className={cn(
              "size-1.5 rounded-full mr-1.5 animate-pulse",
              mobile.stock_status === "In Stock" && "bg-emerald-500",
              mobile.stock_status === "Limited Stock" && "bg-amber-500",
              mobile.stock_status === "Out of Stock" && "bg-rose-500"
            )} />
            {mobile.stock_status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Brand */}
        <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-1">
          {mobile.brand}
        </span>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {mobile.name}
        </h3>

        {/* Specs (RAM / Storage) */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-4 bg-zinc-50 dark:bg-zinc-900/80 px-2.5 py-1.5 rounded-lg w-fit">
          <Cpu className="size-3.5 text-zinc-400 dark:text-zinc-500" />
          <span>{mobile.ram} RAM</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>{mobile.storage} Storage</span>
        </div>

        {/* Price and Action Section */}
        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-0.5">
              Price
            </span>
            {mobile.discount_price !== null && mobile.discount_price !== undefined ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">
                  ₹{mobile.discount_price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                  ₹{mobile.price.toLocaleString("en-IN")}
                </span>
              </div>
            ) : (
              <span className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">
                ₹{mobile.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Button */}
          {isOutOfStock ? (
            <Button
              disabled
              className="w-full justify-center bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-600 border border-zinc-200/20 rounded-xl py-5 text-xs font-semibold cursor-not-allowed select-none"
            >
              Out of Stock
            </Button>
          ) : (
            <Button
              asChild
              className="w-full justify-center bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 text-xs font-semibold shadow-sm group-hover/button:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Link href="/mobiles">
                View Details
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
