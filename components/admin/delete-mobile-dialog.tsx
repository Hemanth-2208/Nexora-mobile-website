'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, Smartphone, Loader2 } from "lucide-react";
import { deleteMobileAction } from "@/lib/actions/mobile-actions";
import { Button } from "@/components/ui/button";

interface DeleteMobileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mobile: {
    id: string;
    name: string;
    brand: string;
    images?: string[];
  };
}

export default function DeleteMobileDialog({
  isOpen,
  onClose,
  onConfirm,
  mobile,
}: DeleteMobileDialogProps) {
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
      
      // Simple focus trap
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
      const res = await deleteMobileAction(mobile.id);
      if (res.success) {
        onConfirm();
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to delete listing.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageSrc = mobile.images && mobile.images.length > 0 ? mobile.images[0] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* 1. Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!isSubmitting) onClose(); }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* 2. Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="relative w-full max-w-[400px] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 flex flex-col text-center items-center"
          >
            
            {/* Warning Icon */}
            <div className="size-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30 shrink-0">
              <AlertTriangle className="size-6 stroke-[1.8]" />
            </div>

            <h3 id="delete-dialog-title" className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
              Delete smartphone listing?
            </h3>
            
            <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium mb-6 max-w-[280px] leading-relaxed">
              This action cannot be undone. The listing will be deleted permanently.
            </p>

            {/* Product Card Details */}
            <div className="w-full flex items-center gap-3.5 p-3.5 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl mb-6">
              <div className="relative size-12 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800 shrink-0">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={mobile.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                    <Smartphone className="size-5 stroke-[1.5]" />
                  </div>
                )}
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">
                  {mobile.brand}
                </span>
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50 truncate leading-none">
                  {mobile.name}
                </span>
              </div>
            </div>

            {/* Error Message inside Dialog */}
            {errorMsg && (
              <p className="text-[10px] font-semibold text-rose-500 mb-4 text-center">
                {errorMsg}
              </p>
            )}

            {/* Dialog Action Buttons */}
            <div className="w-full flex items-center gap-3 mt-2">
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
