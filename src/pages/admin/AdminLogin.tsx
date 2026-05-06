import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import LoadingSpinner from "@/components/admin/common/LoadingSpinner";

const loginSchema = z.object({
  email: z.string().email("Düzgün email daxil edin"),
  password: z.string().min(6, "Şifrə ən azı 6 simvol olmalıdır"),
});

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSessionChecked(true);
      return;
    }
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setSessionChecked(true);
    });
  }, []);

  if (!sessionChecked) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (hasSession) {
    return <Navigate to="/admin" replace />;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <h2 className="font-sora text-lg">Supabase mühit dəyişənləri tapılmadı</h2>
          <p className="mt-2 text-sm">`.env` faylında `VITE_SUPABASE_URL` və `VITE_SUPABASE_ANON_KEY` dəyərlərini qeyd edin.</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrors({ general: "Giriş uğursuz oldu. Məlumatları yoxlayın." });
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-sora text-xl text-slate-900">Admin giriş</h1>
        <p className="mt-1 text-sm text-slate-600">Davam etmək üçün hesabınıza daxil olun.</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-slate-700">Şifrə</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
            {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
          </div>
        </div>
        {errors.general ? <p className="mt-3 text-sm text-red-600">{errors.general}</p> : null}
        <button
          disabled={loading}
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {loading ? <LoadingSpinner /> : null}
          Daxil ol
        </button>
      </form>
    </div>
  );
}
