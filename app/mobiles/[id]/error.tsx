'use client';

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MobileDetailsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Mobile Details Error Segment:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh] select-none">
      
      {/* Premium Error Card */}
      <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-900/30 rounded-3xl max-w-xl mx-auto shadow-sm">
        <div className="size-16 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30">
          <AlertTriangle className="size-8 stroke-[1.8]" />
        </div>
        
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Something went wrong.
        </h3>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
          We encountered an issue loading the device details. Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={() => reset()}
            className="flex-1 justify-center bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2"
          >
            <RotateCcw className="size-3.5" />
            <span>Retry</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex-1 justify-center border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300"
          >
            <Link href="/mobiles" className="flex items-center gap-1.5 justify-center">
              <ChevronLeft className="size-4" />
              <span>Back to Mobiles</span>
            </Link>
          </Button>
        </div>
      </div>

    </div>
  );
}
