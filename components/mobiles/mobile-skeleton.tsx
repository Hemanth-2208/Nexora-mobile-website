'use client';

export default function MobileSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className="flex flex-col h-full bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.012)] animate-pulse"
        >
          {/* Image skeleton */}
          <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-800/50" />
          {/* Content skeleton */}
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
      ))}
    </div>
  );
}
