import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Product } from "@/types";

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_active: boolean;
  stock: number;
  images: string[] | null;
  created_at: string;
  attributes?: Record<string, string> | null;
  categories?: {
    name?: string;
    slug?: string;
  } | null;
}

function toProduct(row: ProductRow): Product {
  const images = row.images ?? [];
  return {
    id: row.id,
    slug: row.id,
    name: row.name,
    description: row.description ?? "",
    shortDescription: (row.description ?? "").slice(0, 100),
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
    category: row.categories?.slug ?? "other",
    category_id: row.category_id ?? undefined,
    main_image: images[0] ?? null,
    images,
    created_at: row.created_at,
    attributes: row.attributes ?? undefined,
    categoryName: row.categories?.name ?? undefined,
    categorySlug: row.categories?.slug ?? undefined,
  };
}

export function useProducts({ activeCategory, searchQuery }: { activeCategory: string; searchQuery: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError("Supabase bağlantısı qurulmayıb");
      return;
    }
    const supabase = getSupabaseClient();

    const loadProducts = async () => {
      setLoading(true);
      let categoryId: string | null = null;
      if (activeCategory !== "all") {
        const categoryRes = await supabase.from("categories").select("id").eq("slug", activeCategory).maybeSingle();
        categoryId = categoryRes.data?.id ?? null;
      }

      let query = supabase
        .from("products")
        .select("id,name,description,price,category_id,is_active,stock,images,created_at,attributes,categories(name,slug)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (categoryId) query = query.eq("category_id", categoryId);
      const { data, error: fetchError } = await query;
      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setProducts(((data ?? []) as ProductRow[]).map(toProduct));
      setError(null);
      setLoading(false);
    };

    loadProducts();

    const productsChannel = supabase
      .channel("products-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        loadProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, [activeCategory]);

  const filtered = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(normalized) ||
        (p.shortDescription ?? "").toLowerCase().includes(normalized) ||
        (p.description ?? "").toLowerCase().includes(normalized)
      );
    });
  }, [products, searchQuery]);

  return { products: filtered, loading, error };
}
