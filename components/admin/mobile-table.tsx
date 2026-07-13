'use client';

import Image from "next/image";
import { Smartphone } from "lucide-react";
import { Mobile } from "@/types/database";
import MobileTableRow from "./mobile-table-row";
import MobileStatusBadge from "./mobile-status-badge";
import MobileActions from "./mobile-actions";

interface MobileTableProps {
  mobiles: Mobile[];
  onRefresh: () => void;
}

export default function MobileTable({ mobiles, onRefresh }: MobileTableProps) {
  if (mobiles.length === 0) {
    return null; // Empty state handled inside page container
  }

  return (
    <div className="w-full">
      {/* 1. Mobile & Tablet stacked cards display (hidden on desktop/large screens) */}
      <div className="md:hidden flex flex-col gap-4">
        {mobiles.map((mobile) => {
          const imageSrc = mobile.images && mobile.images.length > 0 ? mobile.images[0] : null;
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(new Date(mobile.created_at));

          return (
            <div
              key={mobile.id}
              className="p-5 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800 shrink-0">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={mobile.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                        <Smartphone className="size-6 stroke-[1.5]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block leading-none mb-1">
                      {mobile.brand}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
                      {mobile.name}
                    </h4>
                  </div>
                </div>

                {/* Mobile actions trigger */}
                <MobileActions mobile={mobile} onRefresh={onRefresh} />
              </div>

              {/* Specs and Details Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-3 border-t border-b border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
                <div>
                  <span className="font-semibold text-zinc-400 block mb-0.5">Configuration</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{mobile.ram} / {mobile.storage}</span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-400 block mb-0.5">Price</span>
                  {mobile.discount_price !== null ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-zinc-900 dark:text-zinc-50">₹{mobile.discount_price.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] line-through text-zinc-400">₹{mobile.price.toLocaleString("en-IN")}</span>
                    </div>
                  ) : (
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-50">₹{mobile.price.toLocaleString("en-IN")}</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-zinc-400 block mb-0.5">Stock Status</span>
                  <MobileStatusBadge type="stock" value={mobile.stock_status} />
                </div>
                <div>
                  <span className="font-semibold text-zinc-400 block mb-0.5">Visibility</span>
                  <MobileStatusBadge type="visibility" value={mobile.hidden} />
                </div>
              </div>

              {/* Creation Date footer */}
              <div className="flex justify-between items-center text-[10px] font-medium text-zinc-450 dark:text-zinc-500">
                <span>Added: {formattedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop data table view (hidden on small/mobile viewports) */}
      <div className="hidden md:block overflow-x-auto w-full bg-white dark:bg-zinc-900/50 border border-zinc-150/80 dark:border-zinc-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.003)]">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Device</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Brand</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Model Name</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">RAM</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Storage</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Price</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Discount Price</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Stock Status</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Visibility</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Created Date</th>
              <th className="px-5 py-4 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {mobiles.map((mobile) => (
              <MobileTableRow key={mobile.id} mobile={mobile} onRefresh={onRefresh} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
