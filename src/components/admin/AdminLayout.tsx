import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Menu, Package, Settings, Tags, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";

const links = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Məhsullar", icon: Package },
  { to: "/admin/categories", label: "Kateqoriyalar", icon: Tags },
  { to: "/admin/settings", label: "Parametrlər", icon: Settings },
];

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {links.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
              isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout({ session }: { session: Session }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const email = useMemo(() => session.user.email ?? "", [session.user.email]);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <Link to="/admin" className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-sora">A</div>
          <span className="font-sora text-sm text-slate-900">Admin Panel</span>
        </Link>
        <SidebarLinks />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white p-4 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-sora text-sm text-slate-900">Admin Panel</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-slate-700 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarLinks onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden">
                <Menu className="h-5 w-5 text-slate-700" />
              </button>
              <h1 className="font-sora text-base text-slate-900">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-600 sm:block">{email}</span>
              <button
                onClick={() => getSupabaseClient().auth.signOut()}
                className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Çıxış
              </button>
            </div>
          </div>
        </header>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 sm:p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
