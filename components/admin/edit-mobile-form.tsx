'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Mobile } from "@/types/database";
import EditImageUpload from "./edit-image-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Form Validation Schema using Zod
const editMobileSchema = z.object({
  brand: z.string().min(1, "Brand is required."),
  modelName: z.string().min(1, "Model Name is required."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  processor: z.string().min(1, "Processor detail is required."),
  display: z.string().min(1, "Display detail is required."),
  camera: z.string().min(1, "Camera detail is required."),
  battery: z.string().min(1, "Battery detail is required."),
  ram: z.string().min(1, "RAM configuration is required."),
  storage: z.string().min(1, "Storage configuration is required."),
  price: z.number({ message: "Price is required." }).positive("Price must be greater than 0."),
  discountPrice: z.number().positive("Discount price must be greater than 0.").nullable().or(z.nan()).optional(),
  stockStatus: z.enum(["In Stock", "Limited Stock", "Out of Stock"], {
    message: "Stock status is required.",
  }),
  hidden: z.boolean(),
  images: z.array(z.string()).min(1, "At least one image is required.").max(5, "Maximum of 5 images allowed."),
}).refine(
  (data) => {
    if (data.discountPrice !== null && data.discountPrice !== undefined && !isNaN(data.discountPrice)) {
      return data.discountPrice < data.price;
    }
    return true;
  },
  {
    message: "Discount price cannot exceed or equal the base price.",
    path: ["discountPrice"],
  }
);

type EditMobileFormValues = z.infer<typeof editMobileSchema>;

interface EditMobileFormProps {
  mobile: Mobile;
}

export default function EditMobileForm({ mobile }: EditMobileFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditMobileFormValues>({
    resolver: zodResolver(editMobileSchema),
    defaultValues: {
      brand: mobile.brand,
      modelName: mobile.name,
      description: mobile.description,
      processor: mobile.processor,
      display: mobile.display,
      camera: mobile.camera,
      battery: mobile.battery,
      ram: mobile.ram,
      storage: mobile.storage,
      price: mobile.price,
      discountPrice: mobile.discount_price ?? null,
      stockStatus: mobile.stock_status as "In Stock" | "Limited Stock" | "Out of Stock",
      hidden: mobile.hidden,
      images: mobile.images,
    },
  });

  // Prompt confirmation on unsaved form leaves
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (values: EditMobileFormValues) => {
    setSubmitError(null);
    try {
      const supabase = createClient();

      const discountPriceVal = 
        values.discountPrice === null || 
        values.discountPrice === undefined || 
        isNaN(values.discountPrice)
          ? null 
          : Number(values.discountPrice);

      const { error } = await supabase
        .from("mobiles")
        .update({
          name: values.modelName,
          brand: values.brand,
          price: Number(values.price),
          discount_price: discountPriceVal,
          ram: values.ram,
          storage: values.storage,
          processor: values.processor,
          display: values.display,
          battery: values.battery,
          camera: values.camera,
          description: values.description,
          images: values.images,
          stock_status: values.stockStatus,
          hidden: !!values.hidden,
          updated_at: new Date().toISOString(),
        })
        .eq("id", mobile.id);

      if (error) {
        console.error("Supabase update error:", error);
        setSubmitError(error.message + " (Code: " + error.code + ")");
        return;
      }

      setShowToast(true);
      setTimeout(() => {
        router.push("/admin/mobiles");
      }, 1500);

    } catch (err) {
      console.error("Unexpected update failure:", err);
      setSubmitError(err instanceof Error ? err.message : "An unexpected network or database error occurred.");
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold"
          >
            <span>Product updated successfully! Redirecting...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-[1100px] mx-auto pb-24">
        
        {submitError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-455 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">Failed to update mobile</span>
              <span>{submitError}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Specifications Details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/85 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.003)] space-y-5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight pb-3 border-b border-zinc-100 dark:border-zinc-850">
                Core Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="brand" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Brand
                  </label>
                  <input
                    id="brand"
                    type="text"
                    placeholder="e.g. Apple, Samsung"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300",
                      errors.brand && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("brand")}
                  />
                  {errors.brand && <span className="text-[9px] text-rose-500 font-semibold">{errors.brand.message}</span>}
                </div>

                {/* Model Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modelName" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Model Name
                  </label>
                  <input
                    id="modelName"
                    type="text"
                    placeholder="e.g. iPhone 15 Pro Max"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300",
                      errors.modelName && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("modelName")}
                  />
                  {errors.modelName && <span className="text-[9px] text-rose-500 font-semibold">{errors.modelName.message}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label htmlFor="description" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Provide a premium description detailing design, performance..."
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder-zinc-400 text-zinc-900 dark:text-zinc-300 resize-none leading-relaxed",
                    errors.description && "border-rose-500 focus:ring-rose-500"
                  )}
                  {...register("description")}
                />
                {errors.description && <span className="text-[9px] text-rose-500 font-semibold">{errors.description.message}</span>}
              </div>
            </div>

            {/* Specifications Card */}
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/85 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.003)] space-y-5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight pb-3 border-b border-zinc-100 dark:border-zinc-850">
                Technical Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Processor */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="processor" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Processor
                  </label>
                  <input
                    id="processor"
                    type="text"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.processor && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("processor")}
                  />
                  {errors.processor && <span className="text-[9px] text-rose-500 font-semibold">{errors.processor.message}</span>}
                </div>

                {/* Display */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="display" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Display
                  </label>
                  <input
                    id="display"
                    type="text"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.display && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("display")}
                  />
                  {errors.display && <span className="text-[9px] text-rose-500 font-semibold">{errors.display.message}</span>}
                </div>

                {/* Camera */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="camera" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Camera System
                  </label>
                  <input
                    id="camera"
                    type="text"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.camera && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("camera")}
                  />
                  {errors.camera && <span className="text-[9px] text-rose-500 font-semibold">{errors.camera.message}</span>}
                </div>

                {/* Battery */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="battery" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Battery & Charging
                  </label>
                  <input
                    id="battery"
                    type="text"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.battery && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("battery")}
                  />
                  {errors.battery && <span className="text-[9px] text-rose-500 font-semibold">{errors.battery.message}</span>}
                </div>

                {/* RAM */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ram" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    RAM Memory
                  </label>
                  <input
                    id="ram"
                    type="text"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.ram && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("ram")}
                  />
                  {errors.ram && <span className="text-[9px] text-rose-500 font-semibold">{errors.ram.message}</span>}
                </div>

                {/* Storage */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="storage" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Storage Capacity
                  </label>
                  <input
                    id="storage"
                    type="text"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.storage && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("storage")}
                  />
                  {errors.storage && <span className="text-[9px] text-rose-500 font-semibold">{errors.storage.message}</span>}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Images, Pricing, & Visibility */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Image Upload Box */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/85 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.003)]">
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <EditImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.images && (
                <span className="text-[9px] text-rose-500 font-semibold flex items-center gap-1 mt-2">
                  <AlertCircle className="size-3" />
                  {errors.images.message}
                </span>
              )}
            </div>

            {/* Pricing Details */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/85 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.003)] space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight pb-3 border-b border-zinc-100 dark:border-zinc-850">
                Pricing Binds
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="price" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Base Price (₹)
                  </label>
                  <input
                    id="price"
                    type="number"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.price && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && <span className="text-[9px] text-rose-500 font-semibold">{errors.price.message}</span>}
                </div>

                {/* Discount Price */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="discountPrice" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Discount Price (₹)
                  </label>
                  <input
                    id="discountPrice"
                    type="number"
                    className={cn(
                      "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300",
                      errors.discountPrice && "border-rose-500 focus:ring-rose-500"
                    )}
                    {...register("discountPrice", { valueAsNumber: true })}
                  />
                  {errors.discountPrice && <span className="text-[9px] text-rose-500 font-semibold">{errors.discountPrice.message}</span>}
                </div>
              </div>
            </div>

            {/* Inventory Status & Visibility */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/85 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.003)] space-y-5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight pb-3 border-b border-zinc-100 dark:border-zinc-850">
                Availability Settings
              </h3>

              {/* Stock Status Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="stockStatus" className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Stock Status
                </label>
                <select
                  id="stockStatus"
                  className={cn(
                    "w-full px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-300 cursor-pointer",
                    errors.stockStatus && "border-rose-500 focus:ring-rose-500"
                  )}
                  {...register("stockStatus")}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Limited Stock">Limited Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                {errors.stockStatus && <span className="text-[9px] text-rose-500 font-semibold">{errors.stockStatus.message}</span>}
              </div>

              {/* Hidden Switch Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl select-none">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                    Hide Product Listing
                  </span>
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-550 font-medium">
                    Do not display in storefront catalogs.
                  </span>
                </div>
                
                <input
                  type="checkbox"
                  id="hidden"
                  className="size-5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 dark:border-zinc-800 cursor-pointer"
                  {...register("hidden")}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-20 bg-white/70 dark:bg-zinc-950/70 border-t border-zinc-150 dark:border-zinc-850 py-4 px-6 md:px-8 backdrop-blur-md flex items-center justify-end gap-3.5 select-none">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/admin/mobiles")}
            className="border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-xl px-5 py-5 text-xs font-bold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl px-5 py-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin text-zinc-400" />
                <span>Updating Product...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Update Mobile</span>
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
