'use client';

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Review } from "@/types/database";
import ReviewCard from "@/components/reviews/review-card";

function SkeletonReviewCard() {
  return (
    <div className="flex flex-col w-[320px] sm:w-[350px] shrink-0 p-6 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/30 shadow-[0_8px_30px_rgba(0,0,0,0.015)] animate-pulse">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-col gap-1.5 w-24">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800/80 rounded" />
          </div>
        </div>
        <div className="size-6 bg-zinc-100 dark:bg-zinc-800/80 rounded-full" />
      </div>
      <div className="flex gap-1 mb-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="size-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-3 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reviews details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            error: error
          });
          setReviews([]);
        } else if (data) {
          setReviews(data as Review[]);
        }
      } catch (err) {
        console.error("Unexpected error fetching reviews:", err);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, []);

  // Helper to ensure list is long enough for smooth loop and then duplicate
  const getMarqueeItems = (items: Review[]) => {
    if (items.length === 0) return [];
    let baseItems = [...items];
    while (baseItems.length < 8) {
      baseItems = [...baseItems, ...items];
    }
    // Duplicate for seamless scroll
    return [...baseItems, ...baseItems];
  };

  const marqueeItems = getMarqueeItems(reviews);

  return (
    <section className="bg-white dark:bg-zinc-950 py-16 lg:py-24 border-t border-zinc-100 dark:border-zinc-900/80 relative overflow-hidden select-none">
      
      {/* Custom Styles for Marquee Speed and Pause on Hover */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes scrollRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: scrollLeft 35s linear infinite;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: scrollRight 35s linear infinite;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused !important;
        }
        @media (max-width: 1024px) {
          .animate-marquee-left {
            animation-duration: 50s;
          }
          .animate-marquee-right {
            animation-duration: 50s;
          }
        }
        @media (max-width: 640px) {
          .animate-marquee-left {
            animation-duration: 40s;
          }
        }
      `}} />

      <div className="container mx-auto px-4 md:px-8 mb-12 flex flex-col items-center text-center">
        {/* Small Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          <Star className="size-3 text-amber-500 fill-amber-500" />
          <span>★★★★★ Customer Reviews</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
          Loved by Thousands of Customers
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
          See what our customers are saying about their shopping experience.
        </p>
      </div>

      {/* Reviews Track Wrapper */}
      {isLoading ? (
        <div className="flex flex-col gap-6 py-4 overflow-hidden relative">
          <div className="flex gap-6 justify-center px-4 overflow-x-auto no-scrollbar">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonReviewCard key={`skeleton-${idx}`} />
            ))}
          </div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="flex flex-col gap-6 py-4 relative w-full overflow-hidden">
          {/* Soft edge fade masks */}
          <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-20 pointer-events-none" />

          {/* Row 1 (Scrolls Left, visible on all screens) */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-left gap-6 px-4">
              {marqueeItems.map((review, idx) => (
                <ReviewCard key={`row1-${review.id}-${idx}`} review={review} />
              ))}
            </div>
          </div>

          {/* Row 2 (Scrolls Right, hidden on mobile) */}
          <div className="w-full overflow-hidden hidden sm:block">
            <div className="animate-marquee-right gap-6 px-4">
              {marqueeItems.map((review, idx) => (
                <ReviewCard key={`row2-${review.id}-${idx}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-12 md:p-20 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl max-w-xl mx-auto shadow-sm">
          <span className="text-5xl md:text-6xl mb-6 select-none animate-bounce duration-[3000ms]">
            💬
          </span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            No Customer Reviews Yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
            Customer reviews will appear here after purchases.
          </p>
        </div>
      )}
    </section>
  );
}
