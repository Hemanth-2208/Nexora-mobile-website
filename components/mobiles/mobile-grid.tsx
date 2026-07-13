'use client';

import { motion } from "framer-motion";
import { Mobile } from "@/types/database";
import MobileCard from "@/components/mobile/mobile-card";

interface MobileGridProps {
  mobiles: Mobile[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export default function MobileGrid({ mobiles }: MobileGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
    >
      {mobiles.map((mobile) => (
        <motion.div key={mobile.id} variants={itemVariants}>
          <MobileCard mobile={mobile} />
        </motion.div>
      ))}
    </motion.div>
  );
}
