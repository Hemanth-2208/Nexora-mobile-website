'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950 py-16 lg:py-24 xl:py-32">
      {/* Background blur decorative circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-40 dark:opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] aspect-square rounded-full bg-gradient-to-tr from-blue-200 via-indigo-100 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] right-[-20%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-indigo-200 via-purple-100 to-transparent blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Typography Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-semibold text-zinc-900 dark:text-zinc-50 mb-6"
            >
              <Award className="size-3.5 text-blue-600" />
              <span>Next-Gen Premium Smartphones</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight sm:leading-[1.1] mb-6"
            >
              Discover Your Next{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Smartphone
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mb-10 leading-relaxed"
            >
              Experience next-level innovation. Explore our curated selection of high-performance mobile devices, complete with exceptional support and custom premium shopping experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <Button asChild size="lg" className="rounded-full px-8 font-semibold shadow-lg hover:shadow-blue-500/10 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer group hover:scale-102 transition-all">
                <Link href="/mobiles">
                  Browse Mobiles
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800 cursor-pointer">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase Device Mockup */}
          <div className="lg:col-span-5 relative flex justify-center items-center px-4 md:px-0">
            {/* Device Mockup Shadow Base */}
            <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent blur-[80px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[300px] sm:max-w-[340px] aspect-[9/18.5] rounded-[48px] border-[12px] border-zinc-950 dark:border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden z-10"
            >
              {/* Internal Mockup Image */}
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800"
                  alt="Premium Smartphone Showcase Card"
                  fill
                  sizes="(max-w-768px) 100vw, 340px"
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Reflection effect overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              </div>
            </motion.div>

            {/* Floating New Arrival Badge */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="absolute top-12 -left-4 sm:-left-8 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border border-zinc-200/50 dark:border-zinc-800/80 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 select-none"
            >
              <div className="flex items-center justify-center size-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <Award className="size-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Status</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-50 font-bold">New Arrival</span>
              </div>
            </motion.div>

            {/* Floating Rating Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="absolute bottom-12 -right-4 sm:-right-8 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border border-zinc-200/50 dark:border-zinc-800/80 px-5 py-3.5 rounded-2xl shadow-xl flex items-start gap-3.5 select-none"
            >
              <div className="flex items-center justify-center size-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                <Star className="size-5 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">4.9 Rating</span>
                <span className="text-xs text-zinc-500 font-medium">5,000+ Happy Customers</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
