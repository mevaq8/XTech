import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductDetails } from "@/hooks/useProductDetails";
import { useProductImages } from "@/hooks/useProductImages";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductSpecs from "@/components/product/ProductSpecs";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { product, variants, attributes, loading } = useProductDetails(slug);
  const { images } = useProductImages(product?.id, product?.images ?? []);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg pt-6 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-slate-500">Məhsul yüklənir...</div>
      </main>
    );
  }

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-bg pt-6 pb-16"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={images} name={product.name} />
          <div className="space-y-6">
            <ProductInfo product={product} variants={variants} />
            {Object.keys(attributes).length ? <ProductSpecs specs={attributes} /> : null}
          </div>
        </div>
        <div className="mt-8">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8">
            <h3 className="font-sora font-semibold text-primary text-lg mb-4">Məhsul haqqında</h3>
            <p className="font-inter text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
