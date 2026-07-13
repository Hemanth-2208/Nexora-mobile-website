"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Server Action: Adds a new customer review to Supabase.
 */
export async function addReviewAction(customerName: string, rating: number, review: string) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized access. Admin privileges required.");
    }

    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          customer_name: customerName,
          rating,
          review,
        }
      ]);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error) {
    console.error("Error adding review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add review."
    };
  }
}

/**
 * Server Action: Deletes a customer review from Supabase.
 */
export async function deleteReviewAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized access. Admin privileges required.");
    }

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete review."
    };
  }
}
