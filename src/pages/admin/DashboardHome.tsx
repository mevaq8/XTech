import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Package, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "@/lib/supabase";
import type { AdminProduct } from "@/types/admin";
import EmptyState from "@/components/admin/common/EmptyState";
import { SkeletonCard, SkeletonImage } from "@/components/admin/common/Skeleton";
import Toast from "@/components/admin/common/Toast";
import { seedDatabase } from "@/db/seed";

interface Stats {
  total: number;
  active: number;
  outOfStock: number;
  categories: number;
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, outOfStock: 0, categories: 0 });
  const [latest, setLatest] = useState<AdminProduct[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [seedLoading, setSeedLoading] = useState(false);

  const load = async () => {
      const supabase = getSupabaseClient();
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("id,name,price,sale_price,stock,is_active,images,main_image,created_at").order("created_at", { ascending: false }),
        supabase.from("categories").select("id"),
      ]);

      const products = ((productsRes.data ?? []) as AdminProduct[]).map((item) => ({
        ...item,
        main_image: item.main_image ?? item.images?.[0] ?? null,
      }));
      setLatest(products.slice(0, 5));
      setStats({
        total: products.length,
        active: products.filter((p) => p.is_active).length,
        outOfStock: products.filter((p) => (p.stock ?? 0) <= 0).length,
        categories: (categoriesRes.data ?? []).length,
      });
      setLoading(false);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const supabase = getSupabaseClient();
      const productsCount = await supabase.from("products").select("id", { count: "exact", head: true });
      if ((productsCount.count ?? 0) === 0) {
        try {
          await seedDatabase(false);
          setToast("Nümunə məlumatlar əlavə edildi");
        } catch (_err) {
          setToast("Nümunə məlumat əlavə edilərkən xəta oldu");
        }
      }
      await load();
    };
    bootstrap();
  }, []);

  const handleSeed = async () => {
    setSeedLoading(true);
    try {
      await seedDatabase(true);
      await load();
      setToast("Nümunə məlumatlar yenidən əlavə edildi");
    } catch (_err) {
      setToast("Seed əməliyyatı alınmadı");
    } finally {
      setSeedLoading(false);
    }
  };

  const cards = [
    { title: "Ümumi məhsul", value: stats.total, icon: Package },
    { title: "Aktiv məhsul", value: stats.active, icon: CheckCircle },
    { title: "Stok bitən", value: stats.outOfStock, icon: AlertTriangle },
    { title: "Ümumi kateqoriya", value: stats.categories, icon: Tags },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
          : cards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">{card.title}</p>
                  <card.icon className="h-5 w-5 text-slate-700" />
                </div>
                <p className="mt-3 font-sora text-3xl text-slate-900">{card.value}</p>
              </div>
            ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/products/new" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
          Yeni məhsul
        </Link>
        <Link to="/admin/categories" className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
          Kateqoriyaları idarə et
        </Link>
        <Link to="/admin/settings" className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
          Parametrləri aç
        </Link>
        <button
          type="button"
          disabled={seedLoading}
          onClick={handleSeed}
          className="rounded-xl border border-emerald-300 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-70"
        >
          {seedLoading ? "Əlavə edilir..." : "Nümunə məlumatları əlavə et"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <h2 className="font-sora text-lg text-slate-900">Son 5 məhsul</h2>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <SkeletonImage />
                  <div className="h-4 w-44 rounded bg-slate-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : latest.length === 0 ? (
            <EmptyState text="Hələ heç bir məhsul əlavə edilməyib" />
          ) : (
            <div className="space-y-3">
              {latest.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.main_image ?? "https://placehold.co/40x40?text=Yox"}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <p className="text-sm text-slate-700">{item.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item.price?.toLocaleString("az-AZ")} AZN</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
