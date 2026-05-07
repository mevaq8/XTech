import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

interface ProductImageRow {
  url: string;
}

export function useProductImages(productId?: string, fallbackImages: string[] = []) {
  const [images, setImages] = useState<string[]>(fallbackImages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId || !isSupabaseConfigured) {
      setImages(fallbackImages);
      return;
    }
    const supabase = getSupabaseClient();

    const loadImages = async () => {
      setLoading(true);
      const res = await supabase.from("product_images").select("url").eq("product_id", productId).order("sort_order", { ascending: true });
      if (res.error) {
        setImages(fallbackImages);
        setLoading(false);
        return;
      }
      const fromTable = ((res.data ?? []) as ProductImageRow[]).map((item) => item.url).filter(Boolean);
      setImages(fromTable.length ? fromTable : fallbackImages);
      setLoading(false);
    };

    loadImages();

    const channel = supabase
      .channel(`product-images-realtime-${productId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images", filter: `product_id=eq.${productId}` }, () => {
        loadImages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId, fallbackImages.join("|")]);

  return { images, loading };
}
