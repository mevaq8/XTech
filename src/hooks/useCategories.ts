import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  is_active: boolean;
}

const ALL_CATEGORY: HomeCategory = {
  id: "all",
  name: "Bütün Məhsullar",
  slug: "all",
  image: null,
  is_active: true,
};

export function useCategories() {
  const [categories, setCategories] = useState<HomeCategory[]>([ALL_CATEGORY]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError("Supabase bağlantısı qurulmayıb");
      return;
    }

    const supabase = getSupabaseClient();

    const loadCategories = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("id,name,slug,image,is_active,created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setCategories([ALL_CATEGORY, ...((data ?? []) as HomeCategory[])]);
      setError(null);
      setLoading(false);
    };

    loadCategories();

    const channel = supabase
      .channel("categories-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          loadCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { categories, loading, error };
}
