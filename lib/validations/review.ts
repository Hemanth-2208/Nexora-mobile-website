import { z } from "zod";

export const reviewSchema = z.object({
  customer_name: z.string().min(1, "Name is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  review: z.string().min(1, "Review content is required"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
