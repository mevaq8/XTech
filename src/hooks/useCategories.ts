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
      const fullRes = await supabase
        .from("categories")
        .select("id,name,slug,image,is_active,created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!fullRes.error) {
        setCategories([ALL_CATEGORY, ...((fullRes.data ?? []) as HomeCategory[])]);
        setError(null);
        setLoading(false);
        return;
      }

      // Fallback for schemas without image/is_active/created_at columns.
      const basicRes = await supabase.from("categories").select("id,name,slug").order("name");
      if (basicRes.error) {
        setError(basicRes.error.message);
        setLoading(false);
        return;
      }

      const normalized = (basicRes.data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        image: null,
        is_active: true,
      })) as HomeCategory[];
      setCategories([ALL_CATEGORY, ...normalized]);
      setError(null);
      setLoading(false);
    };

    loadCategories();

    const channel = supabase
      .channel(`categories-realtime-${Math.random().toString(36).slice(2)}`)
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
