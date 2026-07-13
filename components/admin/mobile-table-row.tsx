'use client';

import Image from "next/image";
import { Smartphone } from "lucide-react";
import { Mobile } from "@/types/database";
import MobileStatusBadge from "./mobile-status-badge";
import MobileActions from "./mobile-actions";

import { isValidImageUrl } from "@/lib/utils";

interface MobileTableRowProps {
  mobile: Mobile;
  onRefresh: () => void;
}

export default function MobileTableRow({ mobile, onRefresh }: MobileTableRowProps) {
  const imageSrc = mobile.images && mobile.images.length > 0 ? mobile.images[0] : null;

  // Format creation date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(mobile.created_at));

  return (
    <tr className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors border-b border-zinc-100 dark:border-zinc-800/80">
      
      {/* 1. Image */}
      <td className="px-5 py-4 shrink-0">
        <div className="relative size-12 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800">
          {imageSrc && isValidImageUrl(imageSrc) ? (
            <Image
              src={imageSrc}
              alt={mobile.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
              <Smartphone className="size-6 stroke-[1.5]" />
            </div>
          )}
        </div>
      </td>

      {/* 2. Brand */}
      <td className="px-5 py-4 text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
        {mobile.brand}
      </td>

      {/* 3. Model */}
      <td className="px-5 py-4 text-xs font-bold text-zinc-950 dark:text-zinc-50">
        {mobile.name}
      </td>

      {/* 4. RAM */}
      <td className="px-5 py-4 text-xs font-semibold text-zinc-650 dark:text-zinc-350">
        {mobile.ram}
      </td>

      {/* 5. Storage */}
      <td className="px-5 py-4 text-xs font-semibold text-zinc-650 dark:text-zinc-350">
        {mobile.storage}
      </td>

      {/* 6. Price */}
      <td className="px-5 py-4 text-xs font-extrabold text-zinc-950 dark:text-zinc-50">
        ₹{mobile.price.toLocaleString("en-IN")}
      </td>

      {/* 7. Discount Price */}
      <td className="px-5 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {mobile.discount_price !== null ? (
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">
            ₹{mobile.discount_price.toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-zinc-450 italic">—</span>
        )}
      </td>

      {/* 8. Stock Status */}
      <td className="px-5 py-4">
        <MobileStatusBadge type="stock" value={mobile.stock_status} />
      </td>

      {/* 9. Hidden Status */}
      <td className="px-5 py-4">
        <MobileStatusBadge type="visibility" value={mobile.hidden} />
      </td>

      {/* 10. Created Date */}
      <td className="px-5 py-4 text-xs font-medium text-zinc-450 dark:text-zinc-500 whitespace-nowrap">
        {formattedDate}
      </td>

      {/* 11. Actions */}
      <td className="px-5 py-4 text-right">
        <MobileActions mobile={mobile} onRefresh={onRefresh} />
      </td>

    </tr>
  );
}
