'use client';

import { X, GripVertical, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PreviewImage {
  id: string;
  previewUrl: string;
  file?: File;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  uploadedUrl?: string;
}

interface ImagePreviewProps {
  image: PreviewImage;
  index: number;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export default function ImagePreview({
  image,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: ImagePreviewProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={cn(
        "group relative aspect-square rounded-2xl overflow-hidden border bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all cursor-grab active:cursor-grabbing shadow-sm",
        image.status === "error" && "border-rose-300 dark:border-rose-900/50"
      )}
    >
      {/* 1. Preview Image */}
      <Image
        src={image.previewUrl}
        alt={`Product preview image ${index + 1}`}
        fill
        unoptimized
        className="object-cover pointer-events-none"
        sizes="(max-width: 768px) 33vw, 120px"
      />

      {/* 2. Drag Handle overlay */}
      <div className="absolute top-2 left-2 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
        <GripVertical className="size-3.5" />
      </div>

      {/* 3. Upload Status Overlay */}
      {image.status !== "idle" && (
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5 p-2 text-center text-white">
          {image.status === "uploading" && (
            <>
              <Loader2 className="size-5 animate-spin text-blue-400" />
              <span className="text-[9px] font-bold tracking-wide">
                {image.progress}%
              </span>
              {/* Progress bar line */}
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${image.progress}%` }}
                />
              </div>
            </>
          )}

          {image.status === "success" && (
            <>
              <CheckCircle2 className="size-5 text-emerald-450" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-300">Ready</span>
            </>
          )}

          {image.status === "error" && (
            <>
              <AlertCircle className="size-5 text-rose-450" />
              <span className="text-[8px] font-bold uppercase tracking-wider text-rose-300">Failed</span>
            </>
          )}
        </div>
      )}

      {/* 4. Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
        aria-label="Remove image"
      >
        <X className="size-3.5" />
      </button>

      {/* 5. Primary badge (renders only for first index) */}
      {index === 0 && (
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[9px] font-bold tracking-wide select-none">
          Cover
        </div>
      )}
    </div>
  );
}
