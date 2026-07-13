'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toggleVisibilityAction } from "@/lib/actions/mobile-actions";
import { Button } from "@/components/ui/button";

interface ToggleVisibilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mobile: {
    id: string;
    name: string;
    brand: string;
    hidden: boolean;
  };
}

export default function ToggleVisibilityDialog({
  isOpen,
  onClose,
  onConfirm,
  mobile,
}: ToggleVisibilityDialogProps) {
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

  const handleToggle = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await toggleVisibilityAction(mobile.id, mobile.hidden);
      if (res.success) {
        onConfirm();
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to update visibility.");
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
            aria-labelledby="visibility-dialog-title"
            className="relative w-full max-w-[400px] bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 flex flex-col text-center items-center"
          >
            
            {/* Visibility Icon */}
            <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-450 border border-blue-100 dark:border-blue-900/30 shrink-0">
              {mobile.hidden ? (
                <Eye className="size-6 stroke-[1.8]" />
              ) : (
                <EyeOff className="size-6 stroke-[1.8]" />
              )}
            </div>

            <h3 id="visibility-dialog-title" className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
              {mobile.hidden ? "Unhide listing?" : "Hide listing?"}
            </h3>
            
            <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium mb-6 max-w-[280px] leading-relaxed">
              {mobile.hidden 
                ? `Show "${mobile.name}" on the public store directory page.` 
                : `Temporarily hide "${mobile.name}" from public store directory catalogs.`}
            </p>

            {errorMsg && (
              <p className="text-[10px] font-semibold text-rose-500 mb-4 text-center">
                {errorMsg}
              </p>
            )}

            {/* Dialog Buttons */}
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
                onClick={handleToggle}
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-blue-300" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    {mobile.hidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    <span>{mobile.hidden ? "Unhide" : "Hide"}</span>
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
