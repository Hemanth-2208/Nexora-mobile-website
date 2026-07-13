'use client';

import { Smartphone, Star, RefreshCw, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "mobile_add" | "review_add" | "mobile_update";
  title: string;
  detail: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "mobile_add":
        return <Smartphone className="size-4 text-blue-500" />;
      case "review_add":
        return <Star className="size-4 text-amber-500 fill-amber-500" />;
      case "mobile_update":
        return <RefreshCw className="size-4 text-emerald-500" />;
      default:
        return <MessageSquare className="size-4 text-zinc-500" />;
    }
  };

  const getIconBg = (type: ActivityItem["type"]) => {
    switch (type) {
      case "mobile_add":
        return "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30";
      case "review_add":
        return "bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/30";
      case "mobile_update":
        return "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30";
      default:
        return "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50";
    }
  };

  // Format relative time helper
  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.max(1, Math.floor(diffMs / 60000));
      
      if (diffMins < 60) {
        return `${diffMins}m ago`;
      }
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      }
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.002)] h-full">
      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight uppercase tracking-wider mb-6">
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-zinc-450 dark:text-zinc-500 font-medium">
            No recent activity logs.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[360px] scrollbar-thin">
          {activities.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-start gap-3.5 group">
              {/* Icon Container */}
              <div className={cn(
                "size-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                getIconBg(item.type)
              )}>
                {getIcon(item.type)}
              </div>

              {/* Title & Detail */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-950 dark:text-zinc-50 truncate leading-snug mb-0.5">
                  {item.title}
                </p>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate leading-none">
                  {item.detail}
                </p>
              </div>

              {/* Date relative */}
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 whitespace-nowrap shrink-0 pt-0.5 select-none">
                {formatRelativeTime(item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
