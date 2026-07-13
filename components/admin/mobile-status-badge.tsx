'use client';

import { cn } from "@/lib/utils";

interface MobileStatusBadgeProps {
  type: "stock" | "visibility";
  value: string | boolean;
}

export default function MobileStatusBadge({ type, value }: MobileStatusBadgeProps) {
  if (type === "stock") {
    const stockStr = String(value);
    let classes = "";

    switch (stockStr) {
      case "In Stock":
        classes = "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30";
        break;
      case "Limited Stock":
        classes = "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30";
        break;
      case "Out of Stock":
        classes = "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30";
        break;
      default:
        classes = "bg-zinc-50 text-zinc-700 border-zinc-200/50 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800/30";
    }

    return (
      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border select-none shrink-0", classes)}>
        {stockStr}
      </span>
    );
  } else {
    const isHidden = !!value;
    const classes = isHidden
      ? "bg-zinc-100 text-zinc-650 border-zinc-200/60 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800/50"
      : "bg-blue-50 text-blue-700 border-blue-150/40 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30";

    return (
      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border select-none shrink-0", classes)}>
        {isHidden ? "Hidden" : "Visible"}
      </span>
    );
  }
}
