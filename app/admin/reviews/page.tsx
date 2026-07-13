'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus, RotateCcw, AlertTriangle, ChevronRight, Inbox, Search, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Review } from "@/types/database";
import ReviewTable from "@/components/admin/review-table";
import AddReviewDialog from "@/components/admin/add-review-dialog";
import DeleteReviewDialog from "@/components/admin/delete-review-dialog";
import { Button } from "@/components/ui/button";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search & Sort state
  const [searchVal, setSearchVal] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Dialog Toggles
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Success / Error Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("*");

      if (error) {
        console.error("Database fetch error reviews:", error);
        setErrorMsg(error.message + " (Code: " + error.code + ")");
        setIsError(true);
        return;
      }

      setReviews((data as Review[]) || []);
    } catch (err) {
      console.error("Unexpected error fetching reviews catalog:", err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected connection error occurred.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchVal]);

  // Client side search & sort
  const processedReviews = useMemo(() => {
    let result = [...reviews];

    // 1. Apply Search
    if (debouncedSearch.trim() !== "") {
      const query = debouncedSearch.toLowerCase().trim();
      result = result.filter((r) => 
        r.customer_name.toLowerCase().includes(query) ||
        r.review.toLowerCase().includes(query)
      );
    }

    // 2. Apply Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "highest") {
        return b.rating - a.rating;
      }
      if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    return result;
  }, [reviews, debouncedSearch, sortBy]);

  const handleDeleteClick = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const handleAddConfirm = () => {
    triggerToast("Review added successfully.");
    fetchReviews();
  };

  const handleDeleteConfirm = () => {
    triggerToast("Review deleted successfully.");
    fetchReviews();
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-6 select-none">
      
      {/* Toast alert overlay */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white ${
              toastType === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header & Actions */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-150 dark:border-zinc-850">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
            <Link href="/admin" className="hover:text-zinc-650 dark:hover:text-zinc-300">
              Admin Portal
            </Link>
            <ChevronRight className="size-3 text-zinc-300" />
            <span className="text-zinc-600 dark:text-zinc-400">Reviews</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">
            Manage Reviews
          </h2>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">
            Manage customer reviews shown on the homepage.
          </p>
        </div>

        {/* Add Review Dialog Trigger */}
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="size-4 shrink-0" />
          <span>Add Review</span>
        </Button>
      </section>

      {/* 2. Filters bar */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20 p-4 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-50 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 select-none">
          <label htmlFor="reviews-sort" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-wider whitespace-nowrap">
            Sort By
          </label>
          <select
            id="reviews-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "highest" | "lowest")}
            className="w-full sm:w-44 px-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none cursor-pointer text-zinc-800 dark:text-zinc-300 font-semibold"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </section>

      {/* 3. Page Content */}
      <section className="flex-1 min-h-[50vh] flex flex-col">
        {isLoading ? (
          /* Table Loading Skeleton display */
          <div className="w-full flex flex-col gap-4">
            <div className="hidden md:block w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl animate-pulse mb-2" />
            {Array.from({ length: 4 }).map((_, i) => (
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
              <div className="size-14 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30">
                <AlertTriangle className="size-7 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Failed to load reviews
              </h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-xs mb-8">
                {errorMsg || "An unexpected error occurred while fetching the user feedback logs directory."}
              </p>
              <Button
                onClick={fetchReviews}
                className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-5 px-6 text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Retry</span>
              </Button>
            </div>
          </div>
        ) : processedReviews.length === 0 ? (
          /* Empty State card */
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-white dark:bg-zinc-900/40 border border-zinc-150/80 dark:border-zinc-800/80 rounded-3xl max-w-md mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.005)] animate-fade-in">
              <div className="size-14 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-505 border border-zinc-200/50 dark:border-zinc-800/50">
                <Inbox className="size-7 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1.5">
                No reviews found
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-455 max-w-xs mb-8 leading-relaxed">
                {debouncedSearch.trim() !== ""
                  ? "We couldn't find any user feedback matching your criteria. Try adjusting your queries."
                  : "There are no customer reviews listed in the database directory yet. Click the button to add showcase reviews."}
              </p>
              {debouncedSearch.trim() === "" && (
                <Button
                  onClick={() => setIsAddOpen(true)}
                  className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="size-4 shrink-0" />
                  <span>Add Review</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Review tables list rendering */
          <ReviewTable
            reviews={processedReviews}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </section>

      {/* Dialog Modals */}
      <AddReviewDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAddConfirm}
      />

      {selectedReview && (
        <DeleteReviewDialog
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedReview(null);
          }}
          onConfirm={handleDeleteConfirm}
          review={{
            id: selectedReview.id,
            customer_name: selectedReview.customer_name,
            review: selectedReview.review,
          }}
        />
      )}

    </div>
  );
}
