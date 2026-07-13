'use client';

import Image from "next/image";
import Link from "next/link";
import { Smartphone, Edit3, ArrowRight } from "lucide-react";
import { Mobile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { cn, isValidImageUrl } from "@/lib/utils";

interface StockOverviewProps {
  lowStockMobiles: Mobile[];
}

export default function StockOverview({ lowStockMobiles }: StockOverviewProps) {
  
  const getBadgeStyles = (status: string) => {
    if (status === "Out of Stock") {
      return "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-455 dark:border-rose-900/30";
    }
    return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-455 dark:border-amber-900/30";
  };

  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.002)] h-full">
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase tracking-wider">
            Stock Warnings
          </h3>
          {lowStockMobiles.length > 0 && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white select-none animate-pulse">
              {lowStockMobiles.length} Alert{lowStockMobiles.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Link
          href="/admin/mobiles"
          className="text-[9px] font-bold text-blue-650 dark:text-blue-400 hover:underline uppercase tracking-widest flex items-center gap-1 select-none"
        >
          <span>Inventory</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {lowStockMobiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-emerald-600 dark:text-emerald-500 font-bold mb-1">
            All systems nominal
          </p>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium max-w-[200px]">
            No devices are currently running low or out of stock.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
          {lowStockMobiles.map((item) => {
            const imageSrc = item.images && item.images.length > 0 ? item.images[0] : null;

            return (
              <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-50 dark:border-zinc-800/50 last:pb-0 last:border-none">
                
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Thumbnail Image */}
                  <div className="relative size-10 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800 shrink-0">
                    {imageSrc && isValidImageUrl(imageSrc) ? (
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                        <Smartphone className="size-5 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  {/* Brand & Name */}
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block mb-0.5 leading-none">
                      {item.brand}
                    </span>
                    <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50 truncate block leading-tight mb-1 max-w-[140px]">
                      {item.name}
                    </span>
                    <span className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border leading-none",
                      getBadgeStyles(item.stock_status)
                    )}>
                      {item.stock_status}
                    </span>
                  </div>
                </div>

                {/* Edit Action Button */}
                <Button
                  asChild
                  size="xs"
                  variant="outline"
                  className="border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 text-xs font-semibold px-2.5 py-1.5 shadow-sm rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Link href={`/admin/mobiles/edit/${item.id}`}>
                    <Edit3 className="size-3" />
                    <span>Edit</span>
                  </Link>
                </Button>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
