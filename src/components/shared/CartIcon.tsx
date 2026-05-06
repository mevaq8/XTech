import { Link } from "react-router-dom";
import { useCart } from "@/store/cart-store";

export default function CartIcon({ iconClassName = "text-primary" }: { iconClassName?: string }) {
  const { totalItems } = useCart();

  return (
    <Link to="/cart" className="relative p-2 rounded-xl hover:bg-slate-100/20 transition-colors">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClassName}>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full px-1">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
