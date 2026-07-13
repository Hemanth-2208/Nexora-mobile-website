'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Mobile } from "@/types/database";
import MobileCard from "@/components/mobile/mobile-card";
import { Button } from "@/components/ui/button";

function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.012)] animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-800/50" />
      {/* Content Skeleton */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-7 w-1/2 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg mt-1" />
        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-3">
          <div className="h-3.5 w-1/3 bg-zinc-155 dark:bg-zinc-800/60 rounded" />
          <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl mt-1" />
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
    },
  },
} as const;


export default function FeaturedMobiles() {
  const [mobiles, setMobiles] = useState<Mobile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedMobiles() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("mobiles")
          .select("*")
          .eq("hidden", false)
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) {
          console.error("Error fetching mobiles details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            error: error
          });
          setMobiles([]);
        } else if (data) {
          setMobiles(data as Mobile[]);
        }
      } catch (err) {
        console.error("Unexpected error fetching mobiles:", err);
        setMobiles([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedMobiles();
  }, []);

  return (
    <section className="bg-zinc-50/50 dark:bg-zinc-950/40 py-16 lg:py-24 border-t border-zinc-100 dark:border-zinc-900/80">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider">
              <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
              <span>Latest Collection</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-3">
              Featured Smartphones
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              Explore the newest smartphones from the world&apos;s leading brands.
            </p>
          </div>

          {/* View All Button */}
          <Button
            asChild
            variant="outline"
            className="group/btn self-start md:self-end border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold px-5 py-5 rounded-xl text-xs flex items-center gap-2 transition-all duration-300 shadow-sm"
          >
            <Link href="/mobiles">
              <span>View All</span>
              <ArrowRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform duration-300 text-zinc-500 group-hover/btn:text-zinc-900 dark:group-hover/btn:text-zinc-100" />
            </Link>
          </Button>
        </div>

        {/* Content Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
          </div>
        ) : mobiles.length > 0 ? (
          /* Mobiles Grid with Framer Motion Stagger Animation */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {mobiles.map((mobile) => (
              <motion.div key={mobile.id} variants={itemVariants}>
                <MobileCard mobile={mobile} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Beautiful Empty State */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-12 md:p-20 bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl max-w-2xl mx-auto shadow-sm"
          >
            <span className="text-5xl md:text-6xl mb-6 select-none animate-bounce duration-[2500ms]">
              📱
            </span>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              No Mobiles Available
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
              We are currently updating our collection with the latest devices. Check back shortly to find the perfect companion.
            </p>
            <Button
              asChild
              className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300"
            >
              <Link href="/mobiles">
                Browse All Collections
              </Link>
            </Button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
