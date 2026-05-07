import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import type { AdminCategory } from "@/types/admin";
import CategoryForm from "@/components/admin/CategoryForm";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import EmptyState from "@/components/admin/common/EmptyState";
import { SkeletonTable } from "@/components/admin/common/Skeleton";
import Toast from "@/components/admin/common/Toast";

export default function CategoryList() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    const supabase = getSupabaseClient();
    setLoading(true);
    const fullRes = await supabase
      .from("categories")
      .select("id,name,slug,image,is_active,sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (!fullRes.error) {
      setCategories((fullRes.data ?? []) as AdminCategory[]);
      setLoading(false);
      return;
    }
    const basicRes = await supabase.from("categories").select("id,name,slug").order("name", { ascending: true });
    setCategories((basicRes.data ?? []) as AdminCategory[]);
    setLoading(false);
  };
  const moveCategory = async (category: AdminCategory, direction: "up" | "down") => {
    const supabase = getSupabaseClient();
    const ordered = [...categories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const currentIndex = ordered.findIndex((item) => item.id === category.id);
    if (currentIndex < 0) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;
    const current = ordered[currentIndex];
    const target = ordered[targetIndex];
    const currentOrder = current.sort_order ?? currentIndex + 1;
    const targetOrder = target.sort_order ?? targetIndex + 1;
    await supabase.from("categories").update({ sort_order: targetOrder }).eq("id", current.id);
    await supabase.from("categories").update({ sort_order: currentOrder }).eq("id", target.id);
    await loadData();
  };


  useEffect(() => {
    loadData();
  }, []);

  const saveCategory = async (payload: { name: string; slug: string }) => {
    const supabase = getSupabaseClient();
    setSaving(true);
    try {
      const message = editing ? "Kateqoriya yeniləndi" : "Kateqoriya əlavə edildi";
      if (editing) {
        await supabase.from("categories").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("categories").insert(payload);
      }

      setFormOpen(false);
      setEditing(null);
      await loadData();
      setToast(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!deleting) return;
    const supabase = getSupabaseClient();
    setDeleteLoading(true);
    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", deleting.id);
    if ((count ?? 0) > 0) {
      alert("Bu kateqoriyada məhsullar var, əvvəlcə onları başqa kateqoriyaya köçürün");
      setDeleteLoading(false);
      setDeleting(null);
      return;
    }
    await supabase.from("categories").delete().eq("id", deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    await loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-sora text-xl text-slate-900">Kateqoriyalar</h2>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Yeni kateqoriya
        </button>
      </div>

      {formOpen ? (
        <CategoryForm
          initial={editing}
          loading={saving}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSave={saveCategory}
        />
      ) : null}

      {loading ? (
        <SkeletonTable />
      ) : categories.length === 0 ? (
        <EmptyState text="Hələ heç bir kateqoriya yoxdur" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Ad</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Sıra</th>
                <th className="px-4 py-3 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600">{item.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{item.sort_order ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => moveCategory(item, "up")} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Yuxarı">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button onClick={() => moveCategory(item, "down")} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Aşağı">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditing(item);
                          setFormOpen(true);
                        }}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
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
        title="Kateqoriyanı sil"
        message="Silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
        onCancel={() => setDeleting(null)}
        onConfirm={deleteCategory}
      />
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
