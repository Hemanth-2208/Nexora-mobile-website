'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type SortOption = "default" | "low" | "high" | "newest";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "low", label: "Price Low → High" },
  { value: "high", label: "Price High → Low" },
  { value: "newest", label: "Newest First" },
] as const;


export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = sortOptions.find((opt) => opt.value === value)?.label || "Default";

  return (
    <div className="relative z-30" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-350 dark:hover:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all duration-300 shadow-sm cursor-pointer select-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Sort mobiles dropdown"
      >
        <ArrowUpDown className="size-3.5 text-zinc-400 dark:text-zinc-505" />
        <span>Sort: {selectedLabel}</span>
        <ChevronDown className={cn(
          "size-3.5 text-zinc-400 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-1 w-52 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-1.5 flex flex-col gap-1 focus:outline-none"
            role="listbox"
          >
            {sortOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-200 select-none",
                  value === option.value
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-850"
                )}
                role="option"
                aria-selected={value === option.value}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
