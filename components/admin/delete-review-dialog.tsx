'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Loader2, Quote } from "lucide-react";
import { deleteReviewAction } from "@/lib/actions/review-actions";
import { Button } from "@/components/ui/button";

interface DeleteReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  review: {
    id: string;
    customer_name: string;
    review: string;
  };
}

export default function DeleteReviewDialog({
  isOpen,
  onClose,
  onConfirm,
  review,
}: DeleteReviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

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

  const handleDelete = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await deleteReviewAction(review.id);
      if (res.success) {
        onConfirm();
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to delete review.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
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
            aria-labelledby="delete-review-title"
            className="relative w-full max-w-[400px] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 flex flex-col text-center items-center"
          >
            
            {/* Alert Icon */}
            <div className="size-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30 shrink-0">
              <AlertTriangle className="size-6 stroke-[1.8]" />
            </div>

            <h3 id="delete-review-title" className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
              Delete customer review?
            </h3>
            
            <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium mb-6 max-w-[280px] leading-relaxed">
              This action cannot be undone. The review will be removed from the homepage showcase index.
            </p>

            {/* Product Card Details */}
            <div className="w-full flex flex-col items-start gap-2.5 p-3.5 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl mb-6 text-left">
              <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-550">
                <Quote className="size-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {review.customer_name}
                </span>
              </div>
              <p className="text-[11px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">
                &ldquo;{review.review}&rdquo;
              </p>
            </div>

            {errorMsg && (
              <p className="text-[10px] font-semibold text-rose-500 mb-4 text-center">
                {errorMsg}
              </p>
            )}

            {/* Action Buttons */}
            <div className="w-full flex items-center gap-3">
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
                type="button"
                disabled={isSubmitting}
                onClick={handleDelete}
                className="w-full justify-center bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-rose-300" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
