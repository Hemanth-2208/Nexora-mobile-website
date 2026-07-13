'use client';

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mobile } from "@/types/database";

interface UseMobilesParams {
  search: string;
  brand: string;
  ram: string;
  storage: string;
  stock: string;
  sort: string;
}

export function useMobiles({ search, brand, ram, storage, stock, sort }: UseMobilesParams) {
  const [mobiles, setMobiles] = useState<Mobile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchMobiles = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const supabase = createClient();
      let query = supabase
        .from("mobiles")
        .select("*")
        .eq("hidden", false);

      // Apply Filters
      if (brand) {
        query = query.eq("brand", brand);
      }
      if (ram) {
        query = query.eq("ram", ram);
      }
      if (storage) {
        query = query.eq("storage", storage);
      }
      if (stock) {
        query = query.eq("stock_status", stock);
      }

      // Apply Case-Insensitive Search
      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
      }

      // Apply Sorting
      if (sort === "low") {
        query = query.order("price", { ascending: true });
      } else if (sort === "high") {
        query = query.order("price", { ascending: false });
      } else if (sort === "newest") {
        query = query.order("created_at", { ascending: false });
      } else {
        // Default sort (newest first)
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error in useMobiles:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          error: error
        });
        setIsError(true);
        setMobiles([]);
      } else {
        setMobiles((data as Mobile[]) || []);
      }
    } catch (err) {
      console.error("Unexpected error in useMobiles hook:", err);
      setIsError(true);
      setMobiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, brand, ram, storage, stock, sort]);

  useEffect(() => {
    fetchMobiles();
  }, [fetchMobiles]);

  return {
    mobiles,
    isLoading,
    isError,
    refetch: fetchMobiles,
  };
}
