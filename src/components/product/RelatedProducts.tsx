import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import ProductCard from "@/components/shared/ProductCard";
import type { Product } from "@/types";

export default function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const { products } = useProducts({ activeCategory: currentProduct.categorySlug ?? "all", searchQuery: "" });
  const related = useMemo(() => {
    return products.filter((p) => p.id !== currentProduct.id).slice(0, 4);
  }, [currentProduct.id, products]);
  const { byProductId } = useProductVariants(related.map((p) => p.id));

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="font-sora font-semibold text-primary text-lg mb-6">Oxşar məhsullar</h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} variants={byProductId[product.id] ?? []} />
        ))}
      </div>
    </div>
  );
}
