import { useCart } from "@/store/cart-store";
import type { Product } from "@/types";

export default function AddToCartButton({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "lg" }) {
  const { add } = useCart();

  const sizeClasses = {
    sm: "px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base w-full",
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(product);
      }}
      className={`
        ${sizeClasses[size]}
        font-inter font-medium
        bg-accent text-white
        rounded-lg
        transition-all duration-200
        hover:bg-[#16A34A] hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]
        active:scale-[0.97]
        cursor-pointer
        inline-flex items-center justify-center gap-2
      `}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Səbətə at
    </button>
  );
}
