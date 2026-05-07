import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, ProductVariant } from "@/types";

interface AttributeRow {
  attribute_name: string;
  attribute_value: string;
}

export function useProductDetails(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError("Supabase bağlantısı qurulmayıb");
      return;
    }

    const supabase = getSupabaseClient();
    const load = async () => {
      setLoading(true);

      const productRes = await supabase
        .from("products")
        .select("id,name,description,price,category_id,stock,images,attributes,is_active,categories(name,slug)")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();

      let row: any = null;
      if (!productRes.error && productRes.data) {
        row = productRes.data as any;
      } else {
        const basicRes = await supabase
          .from("products")
          .select("id,name,description,price,category_id,stock,is_active")
          .eq("id", productId)
          .eq("is_active", true)
          .maybeSingle();
        if (basicRes.error || !basicRes.data) {
          setProduct(null);
          setLoading(false);
          if (basicRes.error) setError(basicRes.error.message);
          return;
        }
        let categoryData: any = null;
        if (basicRes.data.category_id) {
          const catRes = await supabase.from("categories").select("name,slug").eq("id", basicRes.data.category_id).maybeSingle();
          if (!catRes.error) categoryData = catRes.data;
        }
        row = { ...basicRes.data, images: [], attributes: null, categories: categoryData };
      }
      const images = (row.images ?? []) as string[];
      setProduct({
        id: row.id,
        slug: row.id,
        name: row.name,
        description: row.description ?? "",
        shortDescription: (row.description ?? "").slice(0, 120),
        price: Number(row.price ?? 0),
        stock: Number(row.stock ?? 0),
        category: row.categories?.slug ?? "other",
        category_id: row.category_id ?? undefined,
        main_image: images[0] ?? null,
        images,
        attributes: row.attributes ?? undefined,
        categoryName: row.categories?.name ?? undefined,
        categorySlug: row.categories?.slug ?? undefined,
      });

      const variantsRes = await supabase
        .from("product_variants")
        .select("id,product_id,variant_name,variant_value,price_adjustment,stock")
        .eq("product_id", productId);
      setVariants((variantsRes.data ?? []) as ProductVariant[]);

      const attrsRes = await supabase
        .from("product_attributes")
        .select("attribute_name,attribute_value")
        .eq("product_id", productId);
      const attrRows = attrsRes.error ? [] : ((attrsRes.data ?? []) as AttributeRow[]);
      const fromTable = attrRows.reduce<Record<string, string>>((acc, item) => {
        acc[item.attribute_name] = item.attribute_value;
        return acc;
      }, {});
      const fromJson = row.attributes && typeof row.attributes === "object" ? (row.attributes as Record<string, string>) : {};
      setAttributes({ ...fromJson, ...fromTable });

      setError(null);
      setLoading(false);
    };

    load();
  }, [productId]);

  const groupedVariants = useMemo(() => {
    return variants.reduce<Record<string, ProductVariant[]>>((acc, variant) => {
      if (!acc[variant.variant_name]) acc[variant.variant_name] = [];
      acc[variant.variant_name].push(variant);
      return acc;
    }, {});
  }, [variants]);

  return { product, variants, groupedVariants, attributes, loading, error };
}
