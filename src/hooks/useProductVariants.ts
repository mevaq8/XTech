import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { ProductVariant } from "@/types";

export function useProductVariants(productIds: string[]) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError("Supabase bağlantısı qurulmayıb");
      return;
    }
    if (!productIds.length) {
      setVariants([]);
      setLoading(false);
      return;
    }
    const supabase = getSupabaseClient();

    const loadVariants = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("product_variants")
        .select("id,product_id,variant_name,variant_value,price_adjustment,stock")
        .in("product_id", productIds);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setVariants((data ?? []) as ProductVariant[]);
      setError(null);
      setLoading(false);
    };

    loadVariants();

    const variantsChannel = supabase
      .channel(`product-variants-realtime-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, () => {
        loadVariants();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(variantsChannel);
    };
  }, [productIds.join(",")]);

  const byProductId = useMemo(() => {
    return variants.reduce<Record<string, ProductVariant[]>>((acc, variant) => {
      if (!acc[variant.product_id]) acc[variant.product_id] = [];
      acc[variant.product_id].push(variant);
      return acc;
    }, {});
  }, [variants]);

  return { variants, byProductId, loading, error };
}
