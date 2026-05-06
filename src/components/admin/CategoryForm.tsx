import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";
import type { AdminCategory } from "@/types/admin";

const schema = z.object({
  name: z.string().trim().min(1, "Kateqoriya adı tələb olunur"),
  slug: z.string().trim().min(1, "Slug tələb olunur"),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ə/g, "e")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryForm({
  initial,
  loading,
  onSave,
  onCancel,
}: {
  initial?: AdminCategory | null;
  loading?: boolean;
  onSave: (payload: { name: string; slug: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});

  useEffect(() => {
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
  }, [initial]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, slug });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ name: f.name?.[0], slug: f.slug?.[0] });
      return;
    }
    setErrors({});
    await onSave(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm text-slate-700">Kateqoriya adı</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (!slug.trim()) setSlug(slugify(name));
          }}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-slate-700">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        {errors.slug ? <p className="mt-1 text-xs text-red-600">{errors.slug}</p> : null}
      </div>
      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
          Ləğv et
        </button>
        <button disabled={loading} type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-70">
          Yadda saxla
        </button>
      </div>
    </form>
  );
}
