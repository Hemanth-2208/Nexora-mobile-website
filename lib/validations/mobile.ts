import { z } from "zod";

export const mobileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be greater than 0"),
  discount_price: z.number().positive("Discount price must be greater than 0").nullable().optional(),
  ram: z.string().min(1, "RAM is required"),
  storage: z.string().min(1, "Storage is required"),
  processor: z.string().min(1, "Processor is required"),
  display: z.string().min(1, "Display details are required"),
  battery: z.string().min(1, "Battery details are required"),
  camera: z.string().min(1, "Camera details are required"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required")
    .max(5, "A maximum of five images is allowed"),
  stock_status: z.enum(["In Stock", "Limited Stock", "Out of Stock"], {
    message: "Invalid stock status",
  }).default("In Stock"),
  hidden: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.discount_price !== undefined && data.discount_price !== null) {
      return data.discount_price < data.price;
    }
    return true;
  },
  {
    message: "Discount price must be less than original price",
    path: ["discount_price"],
  }
);

export type MobileInput = z.infer<typeof mobileSchema>;
