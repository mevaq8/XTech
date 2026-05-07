import { useState } from "react";
import { useCart } from "@/store/cart-store";
import QuantitySelector from "@/components/shared/QuantitySelector";
import type { Product, ProductVariant } from "@/types";

export default function ProductInfo({
  product,
  variants = [],
}: {
  product: Product;
  variants?: ProductVariant[];
}) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id ?? "");
  const selectedVariant = variants.find((item) => item.id === selectedVariantId) ?? variants[0];
  const basePrice = Number(product.sale_price ?? product.price ?? 0);
  const finalPrice = basePrice + Number(selectedVariant?.price_adjustment ?? 0);
  const originalPrice = Number(product.price ?? 0) + Number(selectedVariant?.price_adjustment ?? 0);
  const hasSale = typeof product.sale_price === "number" && product.sale_price > 0 && product.sale_price < product.price;
  const discountPercent = hasSale ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
  const finalStock = selectedVariant ? selectedVariant.stock : product.stock;
  const cartProduct: Product = {
    ...product,
    id: selectedVariant ? `${product.id}:${selectedVariant.id}` : product.id,
    name: selectedVariant ? `${product.name} (${selectedVariant.variant_name}: ${selectedVariant.variant_value})` : product.name,
    price: finalPrice,
    stock: finalStock,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-2 font-inter">
          {product.categoryName ?? "Kateqoriya"}
        </p>
        <h1 className="font-sora font-bold text-2xl md:text-3xl text-primary leading-tight">
          {product.name}
        </h1>
      </div>

      <div>
        {hasSale ? (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm text-slate-400 line-through">{originalPrice.toLocaleString("az-AZ")} AZN</span>
            <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">-{discountPercent}%</span>
          </div>
        ) : null}
        <p className={`font-sora font-bold text-3xl ${hasSale ? "text-red-600" : "text-primary"}`}>
          {finalPrice.toLocaleString("az-AZ")}{" "}
          <span className="text-lg font-medium text-slate-400">AZN</span>
        </p>
      </div>

      <p className="font-inter text-sm text-slate-600 leading-relaxed">
        {product.shortDescription ?? product.description}
      </p>

      {variants.length > 0 ? (
        <div>
          <label className="mb-1.5 block text-sm text-slate-700">{selectedVariant?.variant_name ?? "Variant seçin"}</label>
          <select
            value={selectedVariant?.id ?? ""}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variant_value} ({variant.stock} ədəd)
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <span className="text-sm text-slate-400 font-inter">
          Stokda: {finalStock} ədəd
        </span>
      </div>

      <button
        onClick={() => {
          for (let i = 0; i < quantity; i++) {
            add(cartProduct);
          }
        }}
        disabled={finalStock <= 0}
        className="w-full py-4 bg-accent text-white font-inter font-semibold text-base rounded-xl hover:bg-[#16A34A] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
      >
        Səbətə əlavə et
      </button>
    </div>
  );
}
