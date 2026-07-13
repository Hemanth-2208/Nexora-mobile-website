'use client';

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
  iconBg?: string;
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30",
}: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2">
            {title}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
              {description}
            </p>
          )}
        </div>
        <div className={`size-11 rounded-xl flex items-center justify-center border shrink-0 ${iconBg}`}>
          <Icon className={`size-5 stroke-[1.8] ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
