import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidImageUrl(url: unknown): boolean {
  if (typeof url !== "string" || !url || url.trim() === "") {
    return false;
  }
  if (!url.startsWith("https://")) {
    return false;
  }
  try {
    const parsed = new URL(url);
    const allowedHosts = ["res.cloudinary.com", "images.unsplash.com", "ui-avatars.com"];
    return allowedHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}
