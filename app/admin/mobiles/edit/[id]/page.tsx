'use client';

import { useState, useEffect, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, RotateCcw, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Mobile } from "@/types/database";
import EditMobileForm from "@/components/admin/edit-mobile-form";
import { Button } from "@/components/ui/button";

export default function EditMobilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [mobile, setMobile] = useState<Mobile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMobileDetails = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setIsError(false);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("mobiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Supabase single-fetch error:", error);
        setErrorMsg(error.message + " (Code: " + error.code + ")");
        setIsError(true);
        return;
      }

      if (!data) {
        // Trigger Nearest Next.js Not Found Boundary
        notFound();
        return;
      }

      setMobile(data as Mobile);
    } catch (err) {
      // Check if it was a notFound trigger
      if (err instanceof Error && err.message === "NEXT_NOT_FOUND") {
        throw err; // bubble up to trigger next.js 404
      }
      console.error("Unexpected single-fetch error:", err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected connection error occurred.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMobileDetails();
  }, [fetchMobileDetails]);

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      
      {/* 1. Header & navigation */}
      <section className="flex flex-col gap-2 pb-4 border-b border-zinc-150 dark:border-zinc-850 select-none">
        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="xs"
            className="p-1 -ml-1 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 rounded-lg shrink-0 cursor-pointer"
          >
            <Link href="/admin/mobiles" className="flex items-center gap-1 text-xs font-bold">
              <ChevronLeft className="size-4" />
              <span>Back to Mobiles</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">
            Edit Mobile Product
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Modify product configuration details, update prices, or reorder Cloudinary media assets.
          </p>
        </div>
      </section>

      {/* 2. Form panel rendering states */}
      <section className="mt-2 flex-1 min-h-[50vh] flex flex-col">
        {isLoading ? (
          /* Table loading skeleton display */
          <div className="w-full flex flex-col gap-6 animate-pulse max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="h-56 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl" />
                <div className="h-72 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl" />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <div className="h-48 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl" />
                <div className="h-32 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl" />
              </div>
            </div>
          </div>
        ) : isError ? (
          /* Error State Card view */
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-900/30 rounded-3xl max-w-xl mx-auto shadow-sm">
              <div className="size-14 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30">
                <AlertTriangle className="size-7 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Failed to load mobile details
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
                {errorMsg || "An unexpected error occurred while fetching details from the database catalog."}
              </p>
              <Button
                onClick={fetchMobileDetails}
                className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          </div>
        ) : mobile ? (
          /* Form component rendering */
          <EditMobileForm mobile={mobile} />
        ) : null}
      </section>

    </div>
  );
}
