'use client';

import { useState, useRef, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import EditImagePreview, { PreviewImage } from "./edit-image-preview";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";

interface EditImageUploadProps {
  onChange: (urls: string[]) => void;
  value: string[];
}

export default function EditImageUpload({ onChange, value }: EditImageUploadProps) {
  const [localImages, setLocalImages] = useState<PreviewImage[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);
  const localImagesRef = useRef<PreviewImage[]>([]);
  localImagesRef.current = localImages;

  // Suppress unused warning in strict configs
  if (value && false) {
    console.log(value);
  }

  // Populate localImages with existing database values on mount
  useEffect(() => {
    if (value && value.length > 0 && localImages.length === 0) {
      const initial = value.map((url) => ({
        id: Math.random().toString(36).substring(7),
        previewUrl: url,
        status: "success" as const,
        progress: 100,
        uploadedUrl: url,
      }));
      setLocalImages(initial);
    }
  }, [value, localImages.length]);

  // Helper to read File as Base64 Data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processFiles = async (files: FileList) => {
    const totalAllowed = 5;
    const currentCount = localImages.length;

    if (currentCount + files.length > totalAllowed) {
      alert(`You can only upload up to ${totalAllowed} images. Only the first ${totalAllowed - currentCount} will be processed.`);
    }

    const filesToProcess = Array.from(files).slice(0, totalAllowed - currentCount);

    const newImages: PreviewImage[] = filesToProcess.map((file) => {
      const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!acceptedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not supported. Please upload JPEG, PNG, or WEBP.`);
        return null;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 5 MB limit.`);
        return null;
      }

      return {
        id: Math.random().toString(36).substring(7),
        previewUrl: URL.createObjectURL(file),
        file,
        status: "idle",
        progress: 0,
      };
    }).filter(Boolean) as PreviewImage[];

    if (newImages.length === 0) return;

    const updatedImages = [...localImages, ...newImages];
    setLocalImages(updatedImages);

    // Upload new files to Cloudinary
    for (const img of newImages) {
      setLocalImages(prev => prev.map(p => p.id === img.id ? { ...p, status: "uploading", progress: 10 } : p));

      try {
        const base64Data = await fileToBase64(img.file!);

        const progressInterval = setInterval(() => {
          setLocalImages(prev => prev.map(p => {
            if (p.id === img.id && p.status === "uploading" && p.progress < 90) {
              return { ...p, progress: p.progress + 15 };
            }
            return p;
          }));
        }, 150);

        const secureUrl = await uploadToCloudinary(base64Data);

        clearInterval(progressInterval);

        setLocalImages(prev => prev.map(p => p.id === img.id ? { ...p, status: "success" as const, progress: 100, uploadedUrl: secureUrl } : p));
        
        // Sync with parent form outside of state updater function context
        const currentImages = localImagesRef.current;
        const nextImages = currentImages.map(p => p.id === img.id ? { ...p, status: "success" as const, progress: 100, uploadedUrl: secureUrl } : p);
        const urls = nextImages.map(n => n.uploadedUrl).filter(Boolean) as string[];
        onChange(urls);

      } catch (err) {
        console.error("Cloudinary upload failed inside edit upload handler", img.id, err);
        setLocalImages(prev => prev.map(p => p.id === img.id ? { ...p, status: "error", progress: 0 } : p));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemove = (id: string) => {
    const updated = localImages.filter(img => {
      if (img.id === id) {
        if (img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
        return false;
      }
      return true;
    });
    setLocalImages(updated);
    const urls = updated.map(n => n.uploadedUrl).filter(Boolean) as string[];
    onChange(urls);
  };

  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleItemDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || dragIndex === index) return;

    const reordered = [...localImages];
    const [draggedItem] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, draggedItem);

    setLocalImages(reordered);
    dragIndexRef.current = null;

    const urls = reordered.map(n => n.uploadedUrl).filter(Boolean) as string[];
    onChange(urls);
  };

  return (
    <div className="space-y-4">
      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
        Product Images (1 to 5)
      </span>

      {localImages.length < 5 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-blue-500 bg-blue-50/10"
              : "border-zinc-200 hover:border-zinc-350 dark:border-zinc-800 dark:hover:border-zinc-700 bg-zinc-50/30 hover:bg-zinc-50/80 dark:bg-zinc-950/20 dark:hover:bg-zinc-950/40"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-250/20 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4 shadow-sm shrink-0">
            <UploadCloud className="size-6 stroke-[1.8]" />
          </div>

          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 mb-1">
            Drag & Drop to Upload
          </p>
          <p className="text-[10px] text-zinc-455 dark:text-zinc-500 font-medium max-w-xs leading-relaxed">
            Supports JPEG, PNG, or WEBP (Max 5 MB each)
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 text-[10px] font-bold rounded-xl bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-colors shadow-sm cursor-pointer"
          >
            Browse Files
          </button>
        </div>
      )}

      {localImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3.5 mt-4">
          {localImages.map((image, idx) => (
            <EditImagePreview
              key={image.id}
              image={image}
              index={idx}
              onRemove={handleRemove}
              onDragStart={handleItemDragStart}
              onDragOver={handleItemDragOver}
              onDrop={handleItemDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}
