import { motion } from "framer-motion";
import { useCart } from "@/store/cart-store";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import CartEmpty from "@/components/cart/CartEmpty";

export default function CartPage() {
  const { items } = useCart();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-bg pt-6 pb-16"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-sora font-bold text-2xl text-primary mb-8">Səbət</h1>
        {items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
}
