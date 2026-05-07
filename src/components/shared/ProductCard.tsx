import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart-store";
import type { Product, ProductVariant } from "@/types";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

function truncateText(text: string, max = 150) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export default function ProductCard({ product, variants = [] }: { product: Product; variants?: ProductVariant[] }) {
  const { add } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id ?? "");
  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId) ?? variants[0],
    [selectedVariantId, variants]
  );
  const basePrice = Number(product.sale_price ?? product.price ?? 0);
  const finalPrice = basePrice + Number(selectedVariant?.price_adjustment ?? 0);
  const currentStock = selectedVariant ? Number(selectedVariant.stock ?? 0) : Number(product.stock ?? 0);
  const originalPrice = Number(product.price ?? 0) + Number(selectedVariant?.price_adjustment ?? 0);
  const hasSale = typeof product.sale_price === "number" && product.sale_price > 0 && product.sale_price < product.price;
  const discountPercent = hasSale ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
  const description = truncateText(product.description ?? product.shortDescription ?? "Məhsul məlumatı", 150);

  const cartProduct: Product = {
    ...product,
    id: selectedVariant ? `${product.id}:${selectedVariant.id}` : product.id,
    name: selectedVariant ? `${product.name} (${selectedVariant.variant_name}: ${selectedVariant.variant_value})` : product.name,
    price: finalPrice,
    stock: currentStock,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)] h-full">
          <div className="relative aspect-[4/3] bg-slate-50 flex items-center justify-center overflow-hidden">
            {product.main_image ? (
              <img
                src={product.main_image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />
            ) : (
              <img src={PLACEHOLDER_IMAGE} alt="No image" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            )}
          </div>
          <div className="p-4 h-full flex flex-col">
            <p className="text-[11px] font-medium text-secondary uppercase tracking-wider mb-1 font-inter">
              {product.categoryName ?? "Kateqoriya"}
            </p>
            <h3 className="font-sora font-semibold text-primary text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 font-inter mb-3 line-clamp-1">
              {description}
            </p>
            {variants.length > 0 ? (
              <div className="mb-3">
                <label className="mb-1 block text-[11px] text-slate-500">{selectedVariant?.variant_name ?? "Variant"}</label>
                <select
                  value={selectedVariant?.id ?? ""}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantId(e.target.value);
                  }}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-slate-400"
                >
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.variant_value} ({variant.stock} ədəd)
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="mt-auto flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                {hasSale ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 line-through">{originalPrice.toLocaleString("az-AZ")} AZN</span>
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">-{discountPercent}%</span>
                  </div>
                ) : null}
                <span className={`font-sora font-bold text-base ${hasSale ? "text-red-600" : "text-primary"}`}>
                  {finalPrice.toLocaleString("az-AZ")} <span className="text-sm font-medium text-slate-400">AZN</span>
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  add(cartProduct);
                }}
                disabled={currentStock <= 0}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs text-white hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Səbətə at
              </button>
            </div>
            <p className={`mt-2 text-[11px] ${currentStock > 0 ? "text-green-600" : "text-red-600"}`}>
              {currentStock > 0 ? `Stokda: ${currentStock}` : "Stok bitib"}
            </p>
            {selectedVariant && selectedVariant.price_adjustment !== 0 ? (
              <p className="mt-1 text-[11px] text-slate-500">
                Variant fərqi: {selectedVariant.price_adjustment > 0 ? "+" : ""}
                {selectedVariant.price_adjustment} AZN
              </p>
            ) : null}
            </div>
          </div>
      </Link>
    </motion.div>
  );
}
