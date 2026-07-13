'use client';

import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  actionText: string;
  iconColor?: string;
  iconBg?: string;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  actionText,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/30",
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.005)] hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        <div className={`size-11 rounded-xl flex items-center justify-center border shrink-0 mb-4 ${iconBg}`}>
          <Icon className={`size-5 stroke-[1.8] ${iconColor}`} />
        </div>
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          {title}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="group inline-flex items-center gap-1 text-xs font-bold text-blue-650 dark:text-blue-400 hover:underline uppercase tracking-wide"
      >
        <span>{actionText}</span>
        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );
}
