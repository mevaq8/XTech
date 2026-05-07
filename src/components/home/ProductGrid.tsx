import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilter } from "@/store/filter-store";
import { useProducts } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import ProductCard from "@/components/shared/ProductCard";

export default function ProductGrid() {
  const { searchQuery, activeCategory } = useFilter();
  const { products, loading, error } = useProducts({ activeCategory, searchQuery });
  const productIds = useMemo(() => products.map((p) => p.id), [products]);
  const { byProductId } = useProductVariants(productIds);

  const filtered = products;

  return (
    <section className="py-6 bg-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
              <p className="text-slate-400 font-inter text-base">Məhsullar yüklənir...</p>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
              <p className="text-red-500 font-inter text-base">Məhsullar yüklənmədi: {error}</p>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-slate-400 font-inter text-base">Məhsul tapılmadı</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <AnimatePresence>
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} variants={byProductId[product.id] ?? []} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
