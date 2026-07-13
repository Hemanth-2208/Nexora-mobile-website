'use client';

import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, Check, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FilterState {
  brand: string;
  ram: string;
  storage: string;
  stock: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
}

const brands = ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "Nothing", "Motorola", "Vivo", "Oppo", "Realme"];
const rams = ["4GB", "6GB", "8GB", "12GB", "16GB"];
const storages = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const stocks = ["All", "In Stock", "Limited Stock", "Out of Stock"];

export default function FilterPanel({ filters, onChange, onClear }: FilterPanelProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isTabletCollapsed, setIsTabletCollapsed] = useState(true);

  const [expandedSection, setExpandedSection] = useState<Record<string, boolean>>({
    brand: true,
    ram: true,
    storage: true,
    stock: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = filters.brand || filters.ram || filters.storage || (filters.stock && filters.stock !== "All");

  // Reusable core filter content
  const FilterContent = ({ layout }: { layout: "sidebar" | "drawer" | "collapsible" }) => (
    <div className={cn(
      "flex flex-col gap-6",
      layout === "collapsible" && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl"
    )}>
      {/* Category: Brand */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 py-1 cursor-pointer"
        >
          <span>Brand</span>
          {layout !== "collapsible" && (
            <ChevronDown className={cn("size-3.5 transition-transform duration-200", expandedSection.brand && "rotate-180")} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {(expandedSection.brand || layout === "collapsible") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 pt-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                <button
                  onClick={() => onChange("brand", "")}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150",
                    !filters.brand
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850/50"
                  )}
                >
                  <span>All Brands</span>
                  {!filters.brand && <Check className="size-3.5" />}
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => onChange("brand", brand)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150",
                      filters.brand === brand
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850/50"
                    )}
                  >
                    <span>{brand}</span>
                    {filters.brand === brand && <Check className="size-3.5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category: RAM */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toggleSection("ram")}
          className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 py-1 cursor-pointer"
        >
          <span>RAM</span>
          {layout !== "collapsible" && (
            <ChevronDown className={cn("size-3.5 transition-transform duration-200", expandedSection.ram && "rotate-180")} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {(expandedSection.ram || layout === "collapsible") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onChange("ram", "")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all duration-200",
                    !filters.ram
                      ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400"
                      : "bg-white border-zinc-200 text-zinc-650 hover:border-zinc-350 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-850"
                  )}
                >
                  All
                </button>
                {rams.map((ram) => (
                  <button
                    key={ram}
                    onClick={() => onChange("ram", ram)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all duration-200",
                      filters.ram === ram
                        ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400"
                        : "bg-white border-zinc-200 text-zinc-650 hover:border-zinc-350 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-850"
                    )}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category: Storage */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toggleSection("storage")}
          className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 py-1 cursor-pointer"
        >
          <span>Storage</span>
          {layout !== "collapsible" && (
            <ChevronDown className={cn("size-3.5 transition-transform duration-200", expandedSection.storage && "rotate-180")} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {(expandedSection.storage || layout === "collapsible") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onChange("storage", "")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all duration-200",
                    !filters.storage
                      ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400"
                      : "bg-white border-zinc-200 text-zinc-650 hover:border-zinc-350 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-850"
                  )}
                >
                  All
                </button>
                {storages.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => onChange("storage", storage)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all duration-200",
                      filters.storage === storage
                        ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-400"
                        : "bg-white border-zinc-200 text-zinc-650 hover:border-zinc-350 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-850"
                    )}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category: Stock Status */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toggleSection("stock")}
          className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 py-1 cursor-pointer"
        >
          <span>Stock Status</span>
          {layout !== "collapsible" && (
            <ChevronDown className={cn("size-3.5 transition-transform duration-200", expandedSection.stock && "rotate-180")} />
          )}
        </button>

        <AnimatePresence initial={false}>
          {(expandedSection.stock || layout === "collapsible") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1.5 pt-2">
                {stocks.map((stock) => (
                  <button
                    key={stock}
                    onClick={() => onChange("stock", stock === "All" ? "" : stock)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150",
                      (stock === "All" && !filters.stock) || filters.stock === stock
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850/50"
                    )}
                  >
                    <span>{stock}</span>
                    {((stock === "All" && !filters.stock) || filters.stock === stock) && <Check className="size-3.5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar Version */}
      <div className="hidden lg:flex flex-col w-72 shrink-0 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-zinc-900/50 p-6 h-fit shadow-[0_8px_30px_rgb(0,0,0,0.008)]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/50 mb-6">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <SlidersHorizontal className="size-4 text-zinc-550 dark:text-zinc-400" />
            <h3 className="text-sm font-bold">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              <RotateCcw className="size-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
        <FilterContent layout="sidebar" />
      </div>

      {/* 2. Tablet Collapsible Action bar */}
      <div className="hidden md:flex lg:hidden flex-col w-full gap-4">
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-3.5 shadow-sm">
          <button
            onClick={() => setIsTabletCollapsed(!isTabletCollapsed)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-850 dark:text-zinc-250 cursor-pointer"
          >
            <SlidersHorizontal className="size-4 text-zinc-500" />
            <span>{isTabletCollapsed ? "Show Filters" : "Hide Filters"}</span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {!isTabletCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <FilterContent layout="collapsible" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Mobile Drawer Trigger Button */}
      <div className="flex md:hidden w-full">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm cursor-pointer"
        >
          <SlidersHorizontal className="size-4 text-zinc-500" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
      </div>

      {/* 4. Mobile Drawer Overlay & Sheet */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-zinc-950 z-50 rounded-t-3xl border-t border-zinc-200 dark:border-zinc-850 flex flex-col p-6 shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900 mb-6">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Filters</h3>
                <div className="flex items-center gap-4">
                  {hasActiveFilters && (
                    <button
                      onClick={onClear}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      <span>Reset</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Core filters list */}
              <div className="flex-1 overflow-y-auto pb-6">
                <FilterContent layout="drawer" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
