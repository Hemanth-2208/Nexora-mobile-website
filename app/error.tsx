'use client';

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global boundary caught runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-900/30 rounded-3xl max-w-xl mx-auto shadow-sm">
        <div className="size-14 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30">
          <AlertTriangle className="size-7 stroke-[1.8]" />
        </div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          An unexpected error occurred
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
          {error.message || "Something went wrong. Please check your internet connection or reload the page."}
        </p>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-xl px-5 py-5 text-xs font-semibold cursor-pointer"
          >
            Reload Page
          </Button>
          <Button
            onClick={reset}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-5 px-5 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
