import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import type { AdminProduct } from "@/types/admin";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import EmptyState from "@/components/admin/common/EmptyState";
import { SkeletonTable } from "@/components/admin/common/Skeleton";
import Toast from "@/components/admin/common/Toast";

function stockBadge(stock: number) {
  if (stock <= 0) return "bg-red-100 text-red-700";
  if (stock <= 5) return "bg-yellow-100 text-yellow-700";
  if (stock <= 10) return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
}

function stockText(stock: number) {
  if (stock <= 0) return "Stok bitib";
  if (stock <= 5) return "1-5 ədəd";
  if (stock <= 10) return "6-10 ədəd";
  return `${stock} ədəd`;
}

export default function ProductList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [deleting, setDeleting] = useState<AdminProduct | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();

  const load = async () => {
    const supabase = getSupabaseClient();
    setLoading(true);
    const fullRes = await supabase
      .from("products")
      .select("id,name,price,sale_price,stock,is_active,images,category_id,categories(name)")
      .order("created_at", { ascending: false });
    if (!fullRes.error) {
      const normalized = ((fullRes.data ?? []) as AdminProduct[]).map((item) => ({
        ...item,
        main_image: item.images?.[0] ?? null,
      }));
      setProducts(normalized);
      setLoading(false);
      return;
    }
    const fallbackRes = await supabase
      .from("products")
      .select("id,name,price,discount_price,stock,is_active,main_image,category_id,categories(name)")
      .order("created_at", { ascending: false });
    setProducts((fallbackRes.data ?? []) as AdminProduct[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const stateToast = (location.state as { toast?: string } | null)?.toast ?? null;
    if (stateToast) setToast(stateToast);
  }, [location.state]);

  const removeProduct = async () => {
    if (!deleting) return;
    const supabase = getSupabaseClient();
    setDeleteLoading(true);
    await supabase.from("products").delete().eq("id", deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-sora text-xl text-slate-900">Məhsullar</h2>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          Yeni məhsul
        </Link>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : products.length === 0 ? (
        <EmptyState text="Hələ heç bir məhsul əlavə edilməyib" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Şəkil</th>
                <th className="px-4 py-3 text-left">Ad</th>
                <th className="px-4 py-3 text-left">Kateqoriya</th>
                <th className="px-4 py-3 text-left">Qiymət</th>
                <th className="px-4 py-3 text-left">Stok</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <img src={item.main_image ?? "https://placehold.co/40x40?text=Yox"} alt={item.name} className="h-10 w-10 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3 text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.categories?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-800">{item.price.toLocaleString("az-AZ")} AZN</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${stockBadge(item.stock)}`}>{stockText(item.stock)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${item.is_active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"}`}>
                      {item.is_active ? "Aktiv" : "Deaktiv"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/edit/${item.id}`} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setDeleting(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        loading={deleteLoading}
        title="Məhsulu sil"
        message="Silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        onCancel={() => setDeleting(null)}
        onConfirm={removeProduct}
      />
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
