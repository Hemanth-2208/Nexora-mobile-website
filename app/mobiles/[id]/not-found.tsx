'use client';

import Link from "next/link";
import { Smartphone, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileDetailsNotFound() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh] select-none">
      
      {/* 404 Visual State Card */}
      <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl max-w-xl mx-auto shadow-sm">
        <div className="size-16 md:size-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-zinc-800">
          <div className="relative">
            <Smartphone className="size-8 stroke-[1.5]" />
            <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold">
              ?
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Mobile Not Found
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
          The requested smartphone could not be found or has been hidden by the administrator.
        </p>

        <Button
          asChild
          className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-1.5"
        >
          <Link href="/mobiles">
            <ChevronLeft className="size-4" />
            <span>Back to Mobiles</span>
          </Link>
        </Button>
      </div>

    </div>
  );
}
