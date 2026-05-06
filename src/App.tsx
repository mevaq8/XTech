import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { CartProvider } from "@/store/cart-store";
import { FilterProvider } from "@/store/filter-store";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import DashboardHome from "@/pages/admin/DashboardHome";
import ProductList from "@/pages/admin/ProductList";
import ProductForm from "@/pages/admin/ProductForm";
import CategoryList from "@/pages/admin/CategoryList";
import SiteSettings from "@/pages/admin/SiteSettings";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function RequireAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-50" />;
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
          <h2 className="font-sora text-lg">Supabase bağlantısı qurulmayıb</h2>
          <p className="mt-2 text-sm">`.env` faylında `VITE_SUPABASE_URL` və `VITE_SUPABASE_ANON_KEY` dəyərlərini əlavə edin.</p>
        </div>
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  return <AdminLayout session={session} />;
}

export default function App() {
  return (
    <CartProvider>
      <FilterProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdminAuth />}>
              <Route index element={<DashboardHome />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="settings" element={<SiteSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </CartProvider>
  );
}
