"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Server Action: Deletes a mobile record from Supabase.
 */
export async function deleteMobileAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized access. Admin privileges required.");
    }

    const { error } = await supabase
      .from("mobiles")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting mobile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete mobile." 
    };
  }
}

/**
 * Server Action: Toggles the hidden status of a mobile record.
 */
export async function toggleVisibilityAction(id: string, currentHidden: boolean) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized access. Admin privileges required.");
    }

    const { error } = await supabase
      .from("mobiles")
      .update({ 
        hidden: !currentHidden,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error) {
    console.error("Error toggling mobile visibility:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update visibility." 
    };
  }
}

/**
 * Server Action: Updates the stock status of a mobile record.
 */
export async function updateStockAction(id: string, newStatus: "In Stock" | "Limited Stock" | "Out of Stock") {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Unauthorized access. Admin privileges required.");
    }

    const { error } = await supabase
      .from("mobiles")
      .update({ 
        stock_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating mobile stock status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update stock status." 
    };
  }
}
