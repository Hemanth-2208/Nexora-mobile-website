'use client';

import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-3 text-center select-none">
        <Loader2 className="size-8 animate-spin text-zinc-650 dark:text-zinc-350 stroke-[1.8]" />
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-wide uppercase">
          Loading Page...
        </span>
      </div>
    </div>
  );
}
