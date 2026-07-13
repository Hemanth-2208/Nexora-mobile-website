'use client';

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input Container */}
      <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.012)] focus-within:border-zinc-400 dark:focus-within:border-zinc-650 transition-all duration-300">
        
        {/* Leading Search Icon */}
        <div className="pl-4 text-zinc-450 pointer-events-none">
          <Search className="size-5 stroke-[1.8]" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by mobile name..."
          className="w-full pl-3 pr-10 py-4 bg-transparent text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none"
          aria-label="Search smartphones"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3.5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
            aria-label="Clear search input"
          >
            <X className="size-4" />
          </button>
        )}

      </div>
    </div>
  );
}
