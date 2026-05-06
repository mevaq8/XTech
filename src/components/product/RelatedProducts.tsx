import { visibleProducts } from "@/data/products";
import ProductCard from "@/components/shared/ProductCard";
import type { Product } from "@/types";

export default function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const related = visibleProducts
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="font-sora font-semibold text-primary text-lg mb-6">Oxşar məhsullar</h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
