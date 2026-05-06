import { motion } from "framer-motion";
import { useFilter } from "@/store/filter-store";
import { categories } from "@/data/products";

export default function CategoryNav() {
  const { activeCategory, setActiveCategory } = useFilter();

  return (
    <section id="products" className="py-4 bg-bg sticky top-[64px] lg:top-[72px] z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin -mx-1 px-1 snap-x sm:snap-none snap-mandatory">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`relative flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium font-inter transition-all duration-200 cursor-pointer whitespace-nowrap snap-start ${
                activeCategory === cat.slug
                  ? "bg-accent/10 text-accent border border-accent/30 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                  : "bg-white text-slate-600 border border-slate-100 hover:border-slate-200 hover:text-primary"
              }`}
            >
              {activeCategory === cat.slug && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full border-2 border-accent/40"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
