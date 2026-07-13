'use client';

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Sparkles, AlertTriangle, RotateCcw } from "lucide-react";
import SearchBar from "@/components/mobiles/search-bar";
import FilterPanel, { FilterState } from "@/components/mobiles/filter-panel";
import SortDropdown, { SortOption } from "@/components/mobiles/sort-dropdown";
import MobileGrid from "@/components/mobiles/mobile-grid";
import MobileSkeleton from "@/components/mobiles/mobile-skeleton";
import EmptyState from "@/components/mobiles/empty-state";
import { useMobiles } from "@/hooks/useMobiles";
import { Button } from "@/components/ui/button";

function MobilesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL Search Parameters
  const search = searchParams.get("search") || "";
  const brand = searchParams.get("brand") || "";
  const ram = searchParams.get("ram") || "";
  const storage = searchParams.get("storage") || "";
  const stock = searchParams.get("stock") || "";
  const sort = searchParams.get("sort") || "default";

  // Search input local state for real-time typing
  const [searchQuery, setSearchQuery] = useState(search);

  // Sync local searchQuery with URL when it updates (e.g., browser back/forward or reset)
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  // URL State Synchronizer
  const updateSearchParam = useCallback(
    (newParams: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "") {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const queryString = current.toString();
      const query = queryString ? `?${queryString}` : "";
      router.push(`${pathname}${query}`);
    },
    [searchParams, router, pathname]
  );

  // Search Debouncer: updates URL 300ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== search) {
        updateSearchParam({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, search, updateSearchParam]);

  // Fetch live mobiles from Supabase hook
  const { mobiles, isLoading, isError, refetch } = useMobiles({
    search,
    brand,
    ram,
    storage,
    stock,
    sort,
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    updateSearchParam({ [key]: value });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    // Clear all params by navigating back to base pathname
    router.push(pathname);
  };

  const activeFilters: FilterState = {
    brand,
    ram,
    storage,
    stock,
  };

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/40 pb-20">
      {/* Page Header / Hero Section */}
      <section className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900/80 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-4 uppercase tracking-wider select-none">
            <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
            <span>📱 Premium Collection</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
            Explore Smartphones
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
            Find the perfect smartphone by searching, filtering and comparing devices.
          </p>
        </div>
      </section>

      {/* Search & Controls Section */}
      <section className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.008)] mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <SortDropdown value={sort as SortOption} onChange={(val) => updateSearchParam({ sort: val })} />
        </div>

        {/* Main Body Grid & Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar & Drawer Filters Panel */}
          <div className="w-full lg:w-72 shrink-0">
            <FilterPanel
              filters={activeFilters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Grid Content / Loading / Empty / Error State */}
          <div className="flex-1">
            {isLoading ? (
              <MobileSkeleton />
            ) : isError ? (
              /* Premium Error State Card */
              <div className="flex flex-col items-center justify-center text-center p-12 md:p-20 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-900/30 rounded-3xl max-w-xl mx-auto shadow-sm my-8 select-none">
                <div className="size-16 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30">
                  <AlertTriangle className="size-8 stroke-[1.8]" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  Something went wrong.
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
                  We encountered an error while connecting to Supabase database. Please try again.
                </p>
                <Button
                  onClick={() => refetch()}
                  className="bg-rose-600 text-white hover:bg-rose-500 rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Retry</span>
                </Button>
              </div>
            ) : mobiles.length > 0 ? (
              <MobileGrid mobiles={mobiles} />
            ) : (
              <EmptyState onReset={handleClearFilters} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// Loading Fallback during searchParams resolving in Next.js Server Side Rendering
function MobilesLoadingState() {
  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/40 pb-20 animate-pulse">
      <section className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900/80 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center text-center">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4" />
          <div className="h-10 w-64 bg-zinc-250 dark:bg-zinc-800 rounded mb-4" />
          <div className="h-4 w-96 bg-zinc-150 dark:bg-zinc-900 rounded" />
        </div>
      </section>
      <section className="container mx-auto px-4 md:px-8 py-8">
        <div className="h-20 w-full bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 h-[500px] bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl" />
          <div className="flex-1">
            <MobileSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}

export default function MobilesPage() {
  return (
    <Suspense fallback={<MobilesLoadingState />}>
      <MobilesContent />
    </Suspense>
  );
}
