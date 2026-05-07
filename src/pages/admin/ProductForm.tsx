import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { getSupabaseClient } from "@/lib/supabase";
import type { AdminCategory, AdminProduct } from "@/types/admin";
import LoadingSpinner from "@/components/admin/common/LoadingSpinner";
import ImageUploader, { type UploadItem } from "@/components/admin/ImageUploader";
import { SkeletonTable } from "@/components/admin/common/Skeleton";

const schema = z.object({
  name: z.string().trim().min(1, "Məhsul adı tələb olunur"),
  category_id: z.string().trim().min(1, "Kateqoriya tələb olunur"),
  price: z.number().positive("Qiymət müsbət ədəd olmalıdır"),
  discount_price: z.number().optional(),
  stock: z.number().min(0, "Stok sayı mənfi ola bilməz"),
});

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [mainImage, setMainImage] = useState<UploadItem[]>([]);
  const [additionalImages, setAdditionalImages] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Məhsul təsviri əlavə edin..." })],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-36 rounded-b-xl border border-t-0 border-slate-300 p-3 text-sm outline-none",
      },
    },
  });

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseClient();
      setLoading(true);
      const categoriesRes = await supabase.from("categories").select("id,name,slug").order("name");
      setCategories((categoriesRes.data ?? []) as AdminCategory[]);

      if (isEdit && id) {
        const { data } = await supabase
          .from("products")
          .select("id,name,category_id,price,discount_price,stock,description,is_active,main_image,additional_images")
          .eq("id", id)
          .single();
        const product = data as AdminProduct | null;
        if (product) {
          setName(product.name ?? "");
          setCategoryId(product.category_id ?? "");
          setPrice(String(product.price ?? ""));
          setDiscountPrice(product.discount_price ? String(product.discount_price) : "");
          setStock(String(product.stock ?? 0));
          setIsActive(Boolean(product.is_active));
          setMainImage(product.main_image ? [{ url: product.main_image }] : []);
          setAdditionalImages((product.additional_images ?? []).map((url) => ({ url })));
          editor?.commands.setContent(product.description ?? "");
        }
      }
      setLoading(false);
    };
    load();
  }, [editor, id, isEdit]);

  const toolbarButtonClass = "rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50";
  const descriptionHtml = useMemo(() => editor?.getHTML() ?? "", [editor]);

  const uploadImages = async (productId: string) => {
    const supabase = getSupabaseClient();
    const uploadSingle = async (item: UploadItem) => {
      if (!item.file) return item.url;

      const timestamp = Date.now();
      const filename = `${timestamp}-${item.file.name}`;
      const path = `products/${productId}/${filename}`;

      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, item.file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData, error: urlError } = supabase.storage.from("product-images").getPublicUrl(path);
      if (urlError) throw urlError;
      if (!publicUrlData?.publicUrl) throw new Error("Public URL alınmadı");

      return publicUrlData.publicUrl;
    };

    const mainUrl = await uploadSingle(mainImage[0]);
    const additionalUrls = await Promise.all(additionalImages.map((item) => uploadSingle(item)));
    return {
      mainUrl,
      additionalUrls: additionalUrls.filter(Boolean),
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      name,
      category_id: categoryId,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
    });
    setGeneralError(null);
    if (!mainImage.length) {
      setErrors({ main_image: "Əsas şəkil tələb olunur" });
      return;
    }
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({
        name: f.name?.[0],
        category_id: f.category_id?.[0],
        price: f.price?.[0],
        stock: f.stock?.[0],
      });
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const supabase = getSupabaseClient();

      const productId = isEdit && id ? id : crypto.randomUUID();

      // 1) Şəkilləri ƏVVƏLCƏ yükləyirik ki, şəkil alınmasa məhsul DB-ə düşməsin.
      let uploadedMain: string;
      let uploadedAdditional: string[];
      try {
        const uploaded = await uploadImages(productId);
        uploadedMain = uploaded.mainUrl;
        uploadedAdditional = uploaded.additionalUrls;
      } catch (_err) {
        setGeneralError("Şəkil yüklənmədi, yenidən cəhd edin");
        return;
      }

      const payload = {
        id: isEdit ? productId : productId,
        name: parsed.data.name,
        category_id: parsed.data.category_id,
        price: parsed.data.price,
        discount_price: discountPrice ? Number(discountPrice) : null,
        stock: parsed.data.stock,
        description: descriptionHtml,
        is_active: isActive,
        main_image: uploadedMain,
        additional_images: uploadedAdditional,
      };

      if (isEdit) {
        await supabase.from("products").update(payload).eq("id", productId);
      } else {
        const insertRes = await supabase.from("products").insert(payload).select("id").single();
        if (!insertRes.data?.id) {
          setGeneralError("Məhsul əlavə edilmədi");
          return;
        }
      }

      const toastMessage = isEdit ? "Məhsul yeniləndi" : "Məhsul əlavə edildi";
      navigate("/admin/products", { state: { toast: toastMessage } });
    } catch (_err) {
      // Yalnız insert zamanı xüsusi mesaj tələb olunur; update zamanı isə generic saxlayırıq.
      if (!isEdit) setGeneralError("Məhsul əlavə edilmədi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonTable rows={7} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-sora text-xl text-slate-900">{isEdit ? "Məhsulu redaktə et" : "Yeni məhsul"}</h2>
        <div className="flex gap-2">
          <Link to="/admin/products" className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            Ləğv et
          </Link>
          <button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-70">
            {saving ? <LoadingSpinner /> : null}
            Yadda saxla
          </button>
        </div>
      </div>
      {generalError ? <p className="text-sm text-red-600">{generalError}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-700">Məhsul adı</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-700">Kateqoriya</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500">
              <option value="">Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id ? <p className="mt-1 text-xs text-red-600">{errors.category_id}</p> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-700">Qiymət</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
              {errors.price ? <p className="mt-1 text-xs text-red-600">{errors.price}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-700">Endirimli qiymət</label>
              <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-700">Stok sayı</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
              {errors.stock ? <p className="mt-1 text-xs text-red-600">{errors.stock}</p> : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-700">Status</label>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={`flex h-10 w-full items-center rounded-xl px-3 text-sm ${isActive ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"}`}
              >
                {isActive ? "Aktiv" : "Deaktiv"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
          <ImageUploader label="Əsas şəkil" items={mainImage} onChange={setMainImage} required />
          {errors.main_image ? <p className="text-xs text-red-600">{errors.main_image}</p> : null}
          <ImageUploader label="Əlavə şəkillər" items={additionalImages} onChange={setAdditionalImages} multiple />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="mb-1.5 block text-sm text-slate-700">Məhsul təsviri</label>
        <div className="rounded-t-xl border border-slate-300 bg-slate-50 p-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()} className={toolbarButtonClass}>
            Paragraf
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={toolbarButtonClass}>
            Qalın
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={toolbarButtonClass}>
            Maili
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={toolbarButtonClass}>
            Siyahı
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={toolbarButtonClass}>
            Nömrəli siyahı
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </form>
  );
}
