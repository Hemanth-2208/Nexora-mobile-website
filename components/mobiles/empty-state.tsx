'use client';

import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 md:p-20 bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl max-w-xl mx-auto shadow-sm my-8">
      {/* Icon Wrapper */}
      <div className="size-16 md:size-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800">
        <Search className="size-8 stroke-[1.5]" />
      </div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        No Mobiles Found
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
        Try changing your search or filters. We couldn&apos;t find any smartphones matching your criteria.
      </p>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2"
      >
        <RotateCcw className="size-3.5" />
        <span>Reset Filters</span>
      </Button>
    </div>
  );
}
