'use client';

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Loader2, MessageSquarePlus } from "lucide-react";
import { addReviewAction } from "@/lib/actions/review-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const reviewSchema = z.object({
  customerName: z.string().min(3, "Customer Name must be at least 3 characters."),
  rating: z.number().min(1, "Rating must be at least 1 star.").max(5, "Rating cannot exceed 5 stars."),
  review: z.string().min(20, "Review content must be at least 20 characters."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function AddReviewDialog({
  isOpen,
  onClose,
  onConfirm,
}: AddReviewDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: "",
      rating: 5,
      review: "",
    },
  });

  // Reset form state when modal closes / opens
  useEffect(() => {
    if (isOpen) {
      reset({
        customerName: "",
        rating: 5,
        review: "",
      });
      setSubmitError(null);
    }
  }, [isOpen, reset]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      
      // Focus trap
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const onSubmit = async (values: ReviewFormValues) => {
    setSubmitError(null);
    try {
      const res = await addReviewAction(values.customerName, values.rating, values.review);
      if (res.success) {
        onConfirm();
        onClose();
      } else {
        setSubmitError(res.error || "Failed to add review.");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected database error occurred.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!isSubmitting) onClose(); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-review-title"
            className="relative w-full max-w-[460px] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 flex flex-col"
          >
            
            {/* Close Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="size-11 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800 text-zinc-650 dark:text-zinc-350 flex items-center justify-center shadow-sm">
                <MessageSquarePlus className="size-5 stroke-[1.8]" />
              </div>
              <div className="flex flex-col">
                <h3 id="add-review-title" className="text-base font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
                  Add Customer Review
                </h3>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
                  Provide custom ratings showcase details.
                </p>
              </div>
            </div>

            {/* Global Submit Error Message */}
            {submitError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-455 text-[10px] font-semibold mb-4 leading-relaxed">
                {submitError}
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Customer Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="customerName" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Customer Name
                </label>
                <input
                  id="customerName"
                  type="text"
                  placeholder="e.g. John Doe"
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300",
                    errors.customerName && "border-rose-500 focus:ring-rose-500"
                  )}
                  {...register("customerName")}
                />
                {errors.customerName && <span className="text-[9px] text-rose-500 font-semibold">{errors.customerName.message}</span>}
              </div>

              {/* Rating stars slider */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Rating Selection
                </span>
                
                <Controller
                  name="rating"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-1.5 py-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const starValue = idx + 1;
                        const isFilled = field.value >= starValue;
                        return (
                          <motion.button
                            key={starValue}
                            type="button"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { if (!isSubmitting) field.onChange(starValue); }}
                            className="p-1 rounded text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
                            aria-label={`Rate ${starValue} stars`}
                          >
                            <Star
                              className={cn(
                                "size-6",
                                isFilled ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-800"
                              )}
                            />
                          </motion.button>
                        );
                      })}
                      <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-350 ml-2">
                        {field.value} Star{field.value > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                />
                {errors.rating && <span className="text-[9px] text-rose-500 font-semibold">{errors.rating.message}</span>}
              </div>

              {/* Review content */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label htmlFor="review" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Review Text
                </label>
                <textarea
                  id="review"
                  rows={4}
                  placeholder="Share details of the user experience (minimum 20 characters)..."
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300 resize-none leading-relaxed",
                    errors.review && "border-rose-500 focus:ring-rose-500"
                  )}
                  {...register("review")}
                />
                {errors.review && <span className="text-[9px] text-rose-500 font-semibold">{errors.review.message}</span>}
              </div>

              {/* Action Buttons */}
              <div className="w-full flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={onClose}
                  className="w-full justify-center border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-xl py-5 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full justify-center bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin text-zinc-450" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add Review</span>
                  )}
                </Button>
              </div>

            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
