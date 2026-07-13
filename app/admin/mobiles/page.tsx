'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, RotateCcw, AlertTriangle, ChevronRight, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Mobile } from "@/types/database";
import MobileTable from "@/components/admin/mobile-table";
import { Button } from "@/components/ui/button";

export default function AdminMobilesPage() {
  const [mobiles, setMobiles] = useState<Mobile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMobiles = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      // Fetch all smartphones including hidden ones, ordered by created_at DESC
      const { data, error } = await supabase
        .from("mobiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Database fetch error:", error);
        setErrorMsg(error.message + " (Code: " + error.code + ")");
        setIsError(true);
        return;
      }

      setMobiles((data as Mobile[]) || []);
    } catch (err) {
      console.error("Unexpected error fetching mobiles inventory:", err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected connection error occurred.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMobiles();
  }, [fetchMobiles]);

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-6 select-none">
      
      {/* 1. Page Header & Actions */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-150 dark:border-zinc-850">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
            <Link href="/admin" className="hover:text-zinc-650 dark:hover:text-zinc-300">
              Admin Portal
            </Link>
            <ChevronRight className="size-3 text-zinc-300" />
            <span className="text-zinc-600 dark:text-zinc-400">Mobiles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">
            Manage Mobiles
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Manage all smartphones available in the store.
          </p>
        </div>

        {/* Add Product Button */}
        <Button
          asChild
          className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2 self-start sm:self-center"
        >
          <Link href="/admin/mobiles/add" className="flex items-center gap-2">
            <Plus className="size-4 shrink-0" />
            <span>Add Mobile</span>
          </Link>
        </Button>
      </section>

      {/* 2. Page Content rendering states */}
      <section className="flex-1 min-h-[50vh] flex flex-col">
        {isLoading ? (
          /* Table loading skeleton display */
          <div className="w-full flex flex-col gap-4">
            {/* Desktop skeleton headers */}
            <div className="hidden md:block w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl animate-pulse mb-2" />
            {/* Rows/Cards skeletons */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-16 bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          /* Error State Card view */
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-900/30 rounded-3xl max-w-xl mx-auto shadow-sm">
              <div className="size-14 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30">
                <AlertTriangle className="size-7 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Failed to load products
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
                {errorMsg || "An unexpected error occurred while fetching the smartphones database catalog."}
              </p>
              <Button
                onClick={fetchMobiles}
                className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          </div>
        ) : mobiles.length === 0 ? (
          /* Premium Empty State card view */
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-white dark:bg-zinc-900/40 border border-zinc-150/80 dark:border-zinc-800/80 rounded-3xl max-w-md mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.005)]">
              <div className="size-14 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-500 border border-zinc-200/50 dark:border-zinc-800/50">
                <Inbox className="size-7 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1.5">
                No mobiles found
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-455 max-w-xs mb-8 leading-relaxed">
                There are no smartphones listed in the database directory yet. Start adding devices to publicize catalogs.
              </p>
              <Button
                asChild
                className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
              >
                <Link href="/admin/mobiles/add" className="flex items-center gap-2">
                  <Plus className="size-4 shrink-0" />
                  <span>Add Mobile</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Product listings table wrapper rendering */
          <MobileTable mobiles={mobiles} onRefresh={fetchMobiles} />
        )}
      </section>

    </div>
  );
}
