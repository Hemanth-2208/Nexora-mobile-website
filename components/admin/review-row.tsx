'use client';

import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { Review } from "@/types/database";
import { Button } from "@/components/ui/button";
import { isValidImageUrl } from "@/lib/utils";

interface ReviewRowProps {
  review: Review;
  onDeleteClick: (review: Review) => void;
}

export default function ReviewRow({ review, onDeleteClick }: ReviewRowProps) {
  // Format creation date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(review.created_at));

  // Dynamic premium avatar fallback
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    review.customer_name
  )}&background=random&color=fff&size=80`;

  return (
    <tr className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors border-b border-zinc-100 dark:border-zinc-800/80">
      
      {/* 1. Avatar */}
      <td className="px-5 py-4 shrink-0">
        <div className="relative size-9 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800">
          {avatarUrl && isValidImageUrl(avatarUrl) ? (
            <Image
              src={avatarUrl}
              alt={review.customer_name}
              fill
              className="object-cover"
              sizes="36px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 font-bold text-[10px] uppercase">
              {review.customer_name.substring(0, 2)}
            </div>
          )}
        </div>
      </td>

      {/* 2. Customer Name */}
      <td className="px-5 py-4 text-xs font-bold text-zinc-950 dark:text-zinc-50">
        {review.customer_name}
      </td>

      {/* 3. Rating Stars display */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-0.5 text-amber-400 select-none">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`size-3.5 ${
                idx < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"
              }`}
            />
          ))}
        </div>
      </td>

      {/* 4. Review text */}
      <td className="px-5 py-4 text-xs font-medium text-zinc-650 dark:text-zinc-350 max-w-[320px] leading-relaxed">
        <p className="line-clamp-2" title={review.review}>
          {review.review}
        </p>
      </td>

      {/* 5. Created Date */}
      <td className="px-5 py-4 text-xs font-medium text-zinc-450 dark:text-zinc-500 whitespace-nowrap">
        {formattedDate}
      </td>

      {/* 6. Actions (Delete Button) */}
      <td className="px-5 py-4 text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDeleteClick(review)}
          className="size-7 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          aria-label={`Delete review from ${review.customer_name}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </td>

    </tr>
  );
}
