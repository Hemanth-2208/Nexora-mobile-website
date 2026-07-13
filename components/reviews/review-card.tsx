'use client';

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Review } from "@/types/database";
import { cn, isValidImageUrl } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Generate random avatar using UI Avatars with customer name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    review.customer_name
  )}&background=random&size=128`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col w-[320px] sm:w-[350px] shrink-0 p-6 rounded-3xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-white/20 dark:border-zinc-800/30 shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 select-none"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative size-11 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-800">
            {avatarUrl && isValidImageUrl(avatarUrl) ? (
              <Image
                src={avatarUrl}
                alt={`${review.customer_name}'s avatar`}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-150 dark:bg-zinc-900 text-zinc-400 font-bold text-xs uppercase">
                {review.customer_name.substring(0, 2)}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
              {review.customer_name}
            </h4>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              Verified Buyer
            </span>
          </div>
        </div>
        <Quote className="size-6 text-zinc-300/60 dark:text-zinc-700/50 stroke-[1.5]" />
      </div>

      {/* 5-Star Rating Component */}
      <div className="flex gap-0.5 mb-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
              delay: i * 0.05,
            }}
          >
            <Star
              className={cn(
                "size-4",
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-zinc-200 dark:text-zinc-850"
              )}
            />
          </motion.span>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-sm text-zinc-600 dark:text-zinc-450 leading-relaxed font-medium line-clamp-4">
        &ldquo;{review.review}&rdquo;
      </p>
    </motion.div>
  );
}
