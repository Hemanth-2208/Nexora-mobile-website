"use server";

import { v2 as cloudinary } from "cloudinary";

import { createClient } from "@/lib/supabase/server";

// Configure Cloudinary securely on the server
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 image string to Cloudinary and returns the secure URL.
 * Runs strictly on the server as a Next.js Server Action.
 */
export async function uploadToCloudinary(base64Image: string): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized access. Admin privileges required.");
    }

    // Basic validation of base64 format
    if (!base64Image.startsWith("data:image/")) {
      throw new Error("Invalid image format. Must be a base64 encoded image.");
    }

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "ecom-mobiles",
      resource_type: "image",
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload server action error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to upload image to Cloudinary."
    );
  }
}
