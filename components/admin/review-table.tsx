'use client';

import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { Review } from "@/types/database";
import ReviewRow from "./review-row";
import { Button } from "@/components/ui/button";

interface ReviewTableProps {
  reviews: Review[];
  onDeleteClick: (review: Review) => void;
}

export default function ReviewTable({ reviews, onDeleteClick }: ReviewTableProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* 1. Mobile & Tablet stacked cards display (hidden on desktop) */}
      <div className="md:hidden flex flex-col gap-4">
        {reviews.map((review) => {
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(new Date(review.created_at));

          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            review.customer_name
          )}&background=random&color=fff&size=80`;

          return (
            <div
              key={review.id}
              className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl shadow-sm flex flex-col gap-3.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800 shrink-0">
                    <Image
                      src={avatarUrl}
                      alt={review.customer_name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-50 leading-tight mb-1">
                      {review.customer_name}
                    </h4>
                    <div className="flex items-center gap-0.5 text-amber-400 select-none">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`size-3 ${
                            idx < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trash Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClick(review)}
                  className="size-7 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                  aria-label={`Delete review from ${review.customer_name}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* Review Text */}
              <p className="text-[11px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans mt-1">
                &ldquo;{review.review}&rdquo;
              </p>

              {/* Added date */}
              <div className="text-[9px] font-medium text-zinc-450 dark:text-zinc-500 pt-2 border-t border-zinc-50 dark:border-zinc-800/80">
                Added: {formattedDate}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop data table view (hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto w-full bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.003)]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Avatar</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Rating</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Review</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Created Date</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {reviews.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
