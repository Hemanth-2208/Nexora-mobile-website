'use client';

import { ChevronLeft } from "lucide-react";


export default function MobileDetailsLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 dark:text-zinc-700 uppercase mb-8">
        <ChevronLeft className="size-4" />
        <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-20">
        
        {/* Left Side: Image Gallery Skeleton (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-3xl border border-zinc-200/10" />
          <div className="flex gap-3 overflow-x-auto py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="size-20 sm:size-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-250/10 shrink-0" />
            ))}
          </div>
        </div>

        {/* Right Side: Product Information Skeleton (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-5 w-full">
          <div>
            <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded mb-2.5" />
            <div className="h-8 w-3/4 bg-zinc-250 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-8 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>

          <div className="h-20 w-full bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200/10 rounded-2xl" />

          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 bg-zinc-100 dark:bg-zinc-800/30 rounded-xl" />
            <div className="h-14 bg-zinc-100 dark:bg-zinc-800/30 rounded-xl" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded mb-1" />
            <div className="h-3 w-full bg-zinc-150 dark:bg-zinc-900 rounded" />
            <div className="h-3 w-5/6 bg-zinc-150 dark:bg-zinc-900 rounded" />
            <div className="h-3 w-2/3 bg-zinc-150 dark:bg-zinc-900 rounded" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex-1 h-12 bg-zinc-200 dark:bg-zinc-850 rounded-xl" />
            <div className="flex-1 h-12 bg-zinc-150 dark:bg-zinc-900 rounded-xl" />
          </div>
        </div>

      </div>

      {/* Specifications Table Section Skeleton */}
      <section className="mb-20">
        <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 bg-white dark:bg-zinc-900/20 border border-zinc-150/40 dark:border-zinc-850/50 rounded-3xl p-6 md:p-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
              <div className="h-3.5 w-24 bg-zinc-150 dark:bg-zinc-800/50 rounded" />
              <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Related Mobiles Section Skeleton */}
      <section className="border-t border-zinc-100 dark:border-zinc-900/80 pt-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-6 w-48 bg-zinc-250 dark:bg-zinc-800 rounded" />
          </div>
          <div className="h-4 w-16 bg-zinc-150 dark:bg-zinc-800 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex flex-col h-full bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-800/50" />
              <div className="flex flex-col flex-1 p-5 gap-3">
                <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-5 w-3/4 bg-zinc-250 dark:bg-zinc-800 rounded" />
                <div className="h-10 w-full bg-zinc-150 dark:bg-zinc-800 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
