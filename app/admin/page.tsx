'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Smartphone, 
  Star, 
  Plus, 
  ShoppingBag, 
  RotateCcw, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Mobile, Review } from "@/types/database";
import AnalyticsCards from "@/components/admin/analytics-cards";
import Charts from "@/components/admin/charts";
import ActivityFeed, { ActivityItem } from "@/components/admin/activity-feed";
import RecentReviews from "@/components/admin/recent-reviews";
import StockOverview from "@/components/admin/stock-overview";
import QuickActionCard from "@/components/admin/quick-action-card";
import { Button } from "@/components/ui/button";

interface AnalyticsStats {
  totalMobiles: number;
  visibleMobiles: number;
  hiddenMobiles: number;
  totalReviews: number;
  avgRating: number;
  inStockCount: number;
  limitedStockCount: number;
  outOfStockCount: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalMobiles: 0,
    visibleMobiles: 0,
    hiddenMobiles: 0,
    totalReviews: 0,
    avgRating: 0,
    inStockCount: 0,
    limitedStockCount: 0,
    outOfStockCount: 0,
  });

  const [mobiles, setMobiles] = useState<Mobile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      const supabase = createClient();

      // Parallel fetching for high performance
      const [
        mobilesRes,
        reviewsRes,
        recentReviewsRes,
      ] = await Promise.all([
        supabase.from("mobiles").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("*"),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const queryError = mobilesRes.error || reviewsRes.error || recentReviewsRes.error;
      if (queryError) {
        console.error("Supabase dashboard fetch error:", queryError);
        setErrorMessage(queryError.message + " (Code: " + queryError.code + ")");
        setIsError(true);
        return;
      }

      const allMobiles = (mobilesRes.data as Mobile[]) || [];
      const allReviews = (reviewsRes.data as Review[]) || [];

      // Calculate statistics
      const totalMobiles = allMobiles.length;
      const visibleMobiles = allMobiles.filter(m => !m.hidden).length;
      const hiddenMobiles = allMobiles.filter(m => m.hidden).length;
      const totalReviews = allReviews.length;
      
      const sumRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

      const inStockCount = allMobiles.filter(m => m.stock_status === "In Stock").length;
      const limitedStockCount = allMobiles.filter(m => m.stock_status === "Limited Stock").length;
      const outOfStockCount = allMobiles.filter(m => m.stock_status === "Out of Stock").length;

      setStats({
        totalMobiles,
        visibleMobiles,
        hiddenMobiles,
        totalReviews,
        avgRating,
        inStockCount,
        limitedStockCount,
        outOfStockCount,
      });

      setMobiles(allMobiles);
      setReviews(allReviews);
      setRecentReviews((recentReviewsRes.data as Review[]) || []);

    } catch (err) {
      console.error("Unexpected error loading dashboard:", err);
      setErrorMessage(err instanceof Error ? err.message : "An unexpected database connection error occurred.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 1. Process Chart Data
  const stockChartData = useMemo(() => [
    { name: "In Stock", value: stats.inStockCount, color: "#10b981" },
    { name: "Limited Stock", value: stats.limitedStockCount, color: "#f59e0b" },
    { name: "Out of Stock", value: stats.outOfStockCount, color: "#f43f5e" }
  ], [stats]);

  const reviewChartData = useMemo(() => {
    const starCounts = { "5 Stars": 0, "4 Stars": 0, "3 Stars": 0, "2 Stars": 0, "1 Star": 0 };
    reviews.forEach(r => {
      if (r.rating === 5) starCounts["5 Stars"]++;
      else if (r.rating === 4) starCounts["4 Stars"]++;
      else if (r.rating === 3) starCounts["3 Stars"]++;
      else if (r.rating === 2) starCounts["2 Stars"]++;
      else if (r.rating === 1) starCounts["1 Star"]++;
    });
    
    return [
      { rating: "1 Star", count: starCounts["1 Star"] },
      { rating: "2 Stars", count: starCounts["2 Stars"] },
      { rating: "3 Stars", count: starCounts["3 Stars"] },
      { rating: "4 Stars", count: starCounts["4 Stars"] },
      { rating: "5 Stars", count: starCounts["5 Stars"] }
    ];
  }, [reviews]);

  const mobileTimelineData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - idx);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }).reverse();

    const counts = last7Days.reduce((acc, date) => {
      acc[date] = 0;
      return acc;
    }, {} as Record<string, number>);

    mobiles.forEach(m => {
      const dateStr = new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dateStr in counts) {
        counts[dateStr]++;
      }
    });

    return last7Days.map(date => ({
      date,
      count: counts[date]
    }));
  }, [mobiles]);

  // 2. Process Activity Feed
  const recentActivities = useMemo(() => {
    const list: ActivityItem[] = [];

    // Recently added mobiles
    mobiles.slice(0, 5).forEach(m => {
      list.push({
        id: `mob-add-${m.id}`,
        type: "mobile_add",
        title: "New mobile listed",
        detail: `${m.brand} ${m.name} was added to directory`,
        timestamp: m.created_at
      });
    });

    // Recently updated mobiles
    mobiles
      .filter(m => m.updated_at !== m.created_at)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .forEach(m => {
        list.push({
          id: `mob-upd-${m.id}`,
          type: "mobile_update",
          title: "Product details modified",
          detail: `${m.brand} ${m.name} specs or status saved`,
          timestamp: m.updated_at
        });
      });

    // Recently added reviews
    reviews.slice(0, 5).forEach(r => {
      list.push({
        id: `rev-add-${r.id}`,
        type: "review_add",
        title: "Showcase review added",
        detail: `Review by ${r.customer_name} (${r.rating} Stars)`,
        timestamp: r.created_at
      });
    });

    // Merge and sort
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
  }, [mobiles, reviews]);

  // 3. Process Low Stock Mobiles
  const lowStockMobiles = useMemo(() => {
    return mobiles.filter(m => m.stock_status === "Limited Stock" || m.stock_status === "Out of Stock").slice(0, 5);
  }, [mobiles]);

  if (isError) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[70vh] select-none">
        <div className="flex flex-col items-center justify-center text-center p-12 md:p-20 bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-900/30 rounded-3xl max-w-xl mx-auto shadow-sm">
          <div className="size-14 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30">
            <AlertTriangle className="size-7 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Something went wrong.
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-8">
            {errorMessage || "Failed to load dashboard database analytics counts. Please try again."}
          </p>
          <Button
            onClick={fetchDashboardData}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2"
          >
            <RotateCcw className="size-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-8">
      
      {/* 1. Header Banner */}
      <section className="flex flex-col gap-2 pb-4 border-b border-zinc-150 dark:border-zinc-850 select-none">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest mb-0.5">
          <span className="text-zinc-600 dark:text-zinc-400">Admin Portal</span>
          <ChevronRight className="size-3 text-zinc-300" />
          <span className="text-zinc-450">Analytics Dashboard</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
          System Overview
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-450 font-medium">
          Monitor your catalog visibility metrics, stock health statuses, and customer review showcases.
        </p>
      </section>

      {isLoading ? (
        /* Skeleton dashboard grid */
        <div className="w-full flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* 2. Analytics Summary Cards */}
          <AnalyticsCards stats={stats} />

          {/* 3. Recharts Visualizations */}
          <Charts 
            stockData={stockChartData} 
            reviewData={reviewChartData} 
            mobileTimelineData={mobileTimelineData} 
          />

          {/* 4. Feeds and Overviews Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            
            {/* Stock Shortages */}
            <div className="xl:col-span-1 h-full">
              <StockOverview lowStockMobiles={lowStockMobiles} />
            </div>

            {/* Recent Activities */}
            <div className="xl:col-span-1 h-full">
              <ActivityFeed activities={recentActivities} />
            </div>

            {/* Customer Testimonials */}
            <div className="xl:col-span-1 h-full">
              <RecentReviews reviews={recentReviews} />
            </div>

          </div>

          {/* 5. Operations Actions Footer */}
          <section className="flex flex-col gap-4 border-t border-zinc-150 dark:border-zinc-850 pt-8">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase tracking-wider select-none">
              Quick Operations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard
                title="Add Mobile"
                description="List a new smartphone in the storefront catalog."
                icon={Plus}
                href="/admin/mobiles/add"
                actionText="Launch Form"
                iconColor="text-blue-500"
                iconBg="bg-blue-50 dark:bg-blue-950/30 border-blue-100"
              />
              <QuickActionCard
                title="Manage Mobiles"
                description="Modify inventory specifications, stocks, or remove items."
                icon={Smartphone}
                href="/admin/mobiles"
                actionText="Open Inventory"
                iconColor="text-zinc-700 dark:text-zinc-350"
                iconBg="bg-zinc-50 dark:bg-zinc-900 border-zinc-200/50"
              />
              <QuickActionCard
                title="Manage Reviews"
                description="Moderate rating logs displayed on the landing page."
                icon={Star}
                href="/admin/reviews"
                actionText="Moderate Testimonials"
                iconColor="text-amber-500"
                iconBg="bg-amber-50 dark:bg-amber-950/30 border-amber-100"
              />
              <QuickActionCard
                title="View Store"
                description="Open storefront catalog page index."
                icon={ShoppingBag}
                href="/mobiles"
                actionText="Launch Store"
                iconColor="text-emerald-500"
                iconBg="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100"
              />
            </div>
          </section>
        </>
      )}

    </div>
  );
}
