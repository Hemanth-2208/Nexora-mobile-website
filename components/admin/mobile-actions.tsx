'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Eye, Edit3, Trash2, EyeOff, ClipboardList, AlertCircle, CheckCircle } from "lucide-react";
import { Mobile } from "@/types/database";
import DeleteMobileDialog from "./delete-mobile-dialog";
import ToggleVisibilityDialog from "./toggle-visibility-dialog";
import UpdateStockDialog from "./update-stock-dialog";

interface MobileActionsProps {
  mobile: Mobile;
  onRefresh: () => void;
}

export default function MobileActions({ mobile, onRefresh }: MobileActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Dialog Open States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);

  // Toast Notification States
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

  const handleActionConfirm = (actionName: string) => {
    triggerToast(`${mobile.brand} ${mobile.name} ${actionName} updated successfully!`);
    onRefresh();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toast Alert overlay */}
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

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        aria-label="Actions menu"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 shadow-lg py-1.5 z-30 flex flex-col focus:outline-none"
          >
            {/* View Store */}
            <Link
              href={`/mobiles/${mobile.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors font-medium"
            >
              <Eye className="size-3.5 text-zinc-400" />
              <span>View Product</span>
            </Link>

            {/* Edit Product */}
            <Link
              href={`/admin/mobiles/edit/${mobile.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors font-medium"
            >
              <Edit3 className="size-3.5 text-zinc-400" />
              <span>Edit Details</span>
            </Link>

            {/* Toggle Status (Hide / Unhide) */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsVisibilityOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors font-medium cursor-pointer"
            >
              {mobile.hidden ? (
                <>
                  <Eye className="size-3.5 text-zinc-400" />
                  <span>Unhide Listing</span>
                </>
              ) : (
                <>
                  <EyeOff className="size-3.5 text-zinc-400" />
                  <span>Hide Listing</span>
                </>
              )}
            </button>

            {/* Update Stock Status */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsStockOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors font-medium cursor-pointer"
            >
              <ClipboardList className="size-3.5 text-zinc-400" />
              <span>Update Stock</span>
            </button>

            {/* Separator */}
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

            {/* Delete Listing */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsDeleteOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors font-medium cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Mobile</span>
            </button>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog Modals */}
      <DeleteMobileDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleActionConfirm("deleted")}
        mobile={{
          id: mobile.id,
          name: mobile.name,
          brand: mobile.brand,
          images: mobile.images,
        }}
      />

      <ToggleVisibilityDialog
        isOpen={isVisibilityOpen}
        onClose={() => setIsVisibilityOpen(false)}
        onConfirm={() => handleActionConfirm(mobile.hidden ? "unhidden" : "hidden")}
        mobile={{
          id: mobile.id,
          name: mobile.name,
          brand: mobile.brand,
          hidden: mobile.hidden,
        }}
      />

      <UpdateStockDialog
        isOpen={isStockOpen}
        onClose={() => setIsStockOpen(false)}
        onConfirm={() => handleActionConfirm("stock status")}
        mobile={{
          id: mobile.id,
          name: mobile.name,
          brand: mobile.brand,
          stock_status: mobile.stock_status,
        }}
      />
    </div>
  );
}
