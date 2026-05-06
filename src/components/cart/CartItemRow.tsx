import { useCart } from "@/store/cart-store";
import CubePlaceholder from "@/components/shared/CubePlaceholder";
import QuantitySelector from "@/components/shared/QuantitySelector";
import type { CartItem } from "@/types";

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, remove } = useCart();

  return (
    <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4">
      <div className="w-20 h-20 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center">
        <div className="w-12 h-12">
          <CubePlaceholder />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-sora font-semibold text-sm text-primary truncate">{item.product.name}</h4>
        <p className="text-xs text-slate-400 font-inter mt-0.5">
          {item.product.price.toLocaleString("az-AZ")} AZN / ədəd
        </p>
      </div>
      <div className="flex items-center gap-4">
        <QuantitySelector
          quantity={item.quantity}
          onChange={(q) => updateQuantity(item.product.id, q)}
        />
        <div className="hidden sm:block text-right min-w-[80px]">
          <p className="font-sora font-bold text-sm text-primary">
            {(item.product.price * item.quantity).toLocaleString("az-AZ")} AZN
          </p>
        </div>
        <button
          onClick={() => remove(item.product.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          aria-label="Sil"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
