'use client';

import { motion } from "framer-motion";
import { Smartphone, Star, AlertCircle, CheckCircle } from "lucide-react";
import DashboardCard from "./dashboard-card";

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

interface AnalyticsCardsProps {
  stats: AnalyticsStats;
}

export default function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      {/* 1. Total Mobiles Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <DashboardCard
          title="Total Mobiles"
          value={stats.totalMobiles}
          icon={Smartphone}
          description={`Visible: ${stats.visibleMobiles} | Hidden: ${stats.hiddenMobiles}`}
          iconColor="text-blue-500 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30"
        />
      </motion.div>

      {/* 2. Stock Health Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <DashboardCard
          title="Stock Health"
          value={stats.inStockCount}
          icon={CheckCircle}
          description={`In Stock items`}
          iconColor="text-emerald-500 dark:text-emerald-450"
          iconBg="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30"
        />
      </motion.div>

      {/* 3. Stock Shortages Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <DashboardCard
          title="Alert Stock"
          value={stats.limitedStockCount + stats.outOfStockCount}
          icon={AlertCircle}
          description={`Limited: ${stats.limitedStockCount} | Out: ${stats.outOfStockCount}`}
          iconColor="text-rose-500 dark:text-rose-450"
          iconBg="bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30"
        />
      </motion.div>

      {/* 4. Average Review Ratings Card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <DashboardCard
          title="Average Rating"
          value={stats.avgRating > 0 ? Number(stats.avgRating.toFixed(1)) : 0}
          icon={Star}
          description={`From ${stats.totalReviews} customer reviews`}
          iconColor="text-amber-500 dark:text-amber-455"
          iconBg="bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30"
        />
      </motion.div>

    </div>
  );
}
