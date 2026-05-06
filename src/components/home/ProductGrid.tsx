import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilter } from "@/store/filter-store";
import { visibleProducts } from "@/data/products";
import ProductCard from "@/components/shared/ProductCard";

export default function ProductGrid() {
  const { searchQuery, activeCategory } = useFilter();

  const filtered = useMemo(() => {
    return visibleProducts.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section className="py-6 bg-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
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
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
