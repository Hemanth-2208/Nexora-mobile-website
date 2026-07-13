'use client';

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { Review } from "@/types/database";
import { isValidImageUrl } from "@/lib/utils";

interface RecentReviewsProps {
  reviews: Review[];
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.002)] h-full">
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase tracking-wider">
          Latest Reviews
        </h3>
        <Link
          href="/admin/reviews"
          className="text-[9px] font-bold text-blue-650 dark:text-blue-400 hover:underline uppercase tracking-widest flex items-center gap-1 select-none"
        >
          <span>All Reviews</span>
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-zinc-450 dark:text-zinc-500 font-medium">
            No customer reviews listed yet.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
          {reviews.map((item) => {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
            }).format(new Date(item.created_at));

            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.customer_name
            )}&background=random&color=fff&size=60`;

            return (
              <div key={item.id} className="flex gap-3.5 pb-4 border-b border-zinc-50 dark:border-zinc-800/50 last:pb-0 last:border-none">
                {/* Avatar */}
                <div className="relative size-8 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800 shrink-0">
                  {avatarUrl && isValidImageUrl(avatarUrl) ? (
                    <Image
                      src={avatarUrl}
                      alt={item.customer_name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 font-bold text-[10px] uppercase">
                      {item.customer_name.substring(0, 2)}
                    </div>
                  )}
                </div>

                {/* Info & Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50 truncate leading-none">
                      {item.customer_name}
                    </span>
                    <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-650 shrink-0 select-none">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-0.5 text-amber-400 mb-1 select-none">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`size-3 ${
                          idx < item.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text Preview */}
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    &ldquo;{item.review}&rdquo;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
