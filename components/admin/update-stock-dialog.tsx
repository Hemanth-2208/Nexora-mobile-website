'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Settings, Loader2 } from "lucide-react";
import { updateStockAction } from "@/lib/actions/mobile-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpdateStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mobile: {
    id: string;
    name: string;
    brand: string;
    stock_status: string;
  };
}

const STOCK_OPTIONS: ("In Stock" | "Limited Stock" | "Out of Stock")[] = [
  "In Stock",
  "Limited Stock",
  "Out of Stock",
];

export default function UpdateStockDialog({
  isOpen,
  onClose,
  onConfirm,
  mobile,
}: UpdateStockDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<"In Stock" | "Limited Stock" | "Out of Stock">(
    (mobile.stock_status as "In Stock" | "Limited Stock" | "Out of Stock") || "In Stock"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Sync initial state when mobile info changes
  useEffect(() => {
    if (mobile.stock_status) {
      setSelectedStatus(mobile.stock_status as "In Stock" | "Limited Stock" | "Out of Stock");
    }
  }, [mobile.stock_status]);

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

  const handleUpdate = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await updateStockAction(mobile.id, selectedStatus);
      if (res.success) {
        onConfirm();
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to update stock status.");
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
            aria-labelledby="stock-dialog-title"
            className="relative w-full max-w-[400px] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 flex flex-col items-center"
          >
            
            {/* Gear Icon */}
            <div className="size-12 rounded-full bg-zinc-50 dark:bg-zinc-950/30 flex items-center justify-center mb-4 text-zinc-650 dark:text-zinc-350 border border-zinc-100 dark:border-zinc-800/80 shrink-0">
              <Settings className="size-6 stroke-[1.8]" />
            </div>

            <h3 id="stock-dialog-title" className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-1 text-center">
              Update Stock Status
            </h3>
            
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium mb-6 text-center max-w-[280px]">
              Set stock status options for &ldquo;{mobile.name}&rdquo;.
            </p>

            {/* Radio / Option Cards list */}
            <div className="w-full flex flex-col gap-2 mb-6">
              {STOCK_OPTIONS.map((option) => {
                const isSelected = selectedStatus === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { if (!isSubmitting) setSelectedStatus(option); }}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 border rounded-2xl text-xs font-bold transition-all cursor-pointer",
                      isSelected
                        ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950 shadow-sm"
                        : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/20 dark:hover:bg-zinc-950/40 text-zinc-700 dark:text-zinc-350"
                    )}
                  >
                    <span>{option}</span>
                    {isSelected && <Check className="size-4 shrink-0 stroke-[2.5]" />}
                  </button>
                );
              })}
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
                onClick={handleUpdate}
                className="w-full justify-center bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl py-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-zinc-400" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Status</span>
                )}
              </Button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
