import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import type { SiteSettingsRow } from "@/types/admin";
import ImageUploader, { type UploadItem } from "@/components/admin/ImageUploader";
import LoadingSpinner from "@/components/admin/common/LoadingSpinner";
import { SkeletonTable } from "@/components/admin/common/Skeleton";

export default function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState<string>("");
  const [siteName, setSiteName] = useState("");
  const [logo, setLogo] = useState<UploadItem[]>([]);
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabaseClient();
      setLoading(true);
      const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      let row = data as SiteSettingsRow | null;
      if (!row) {
        const inserted = await supabase.from("site_settings").insert({ site_name: "XTech" }).select("*").single();
        row = inserted.data as SiteSettingsRow;
      }
      setRowId(row?.id ?? "");
      setSiteName(row?.site_name ?? "");
      setLogo(row?.logo ? [{ url: row.logo }] : []);
      setWhatsapp(row?.whatsapp ?? "");
      setAddress(row?.address ?? "");
      setInstagram(row?.instagram ?? "");
      setFacebook(row?.facebook ?? "");
      setTiktok(row?.tiktok ?? "");
      setEmail(row?.email ?? "");
      setLoading(false);
    };
    load();
  }, []);

  const saveLogo = async () => {
    const supabase = getSupabaseClient();
    const first = logo[0];
    if (!first?.file) return first?.url ?? null;
    const path = `settings/${Date.now()}-${first.file.name}`;
    await supabase.storage.from("product-images").upload(path, first.file, { upsert: true });
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e: FormEvent) => {
    const supabase = getSupabaseClient();
    e.preventDefault();
    setSaving(true);
    const uploadedLogo = await saveLogo();
    await supabase
      .from("site_settings")
      .update({
        site_name: siteName,
        logo: uploadedLogo ?? logo[0]?.url ?? null,
        whatsapp: whatsapp,
        address,
        instagram,
        facebook,
        tiktok,
        email,
      })
      .eq("id", rowId);
    setSaving(false);
    setSuccess("Parametrlər yadda saxlanıldı");
    setTimeout(() => setSuccess(""), 2500);
  };

  if (loading) return <SkeletonTable rows={6} />;

  return (
    <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="font-sora text-xl text-slate-900">Sayt parametrləri</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-slate-700">Sayt adı</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-700">WhatsApp nömrəsi</label>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="994501234567"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>
      </div>
      <ImageUploader label="Loqo" items={logo} onChange={setLogo} />
      <div>
        <label className="mb-1.5 block text-sm text-slate-700">Ünvan</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-slate-700">Instagram</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-700">Facebook</label>
          <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-700">TikTok</label>
          <input value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button disabled={saving} type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-70">
          {saving ? <LoadingSpinner /> : null}
          Parametrləri yadda saxla
        </button>
        {success ? <p className="text-sm text-green-700">{success}</p> : null}
      </div>
    </form>
  );
}
