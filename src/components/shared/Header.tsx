import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import { useFilter } from "@/store/filter-store";
import { categories } from "@/data/products";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveCategory } = useFilter();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleCategoryClick = (slug: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => setActiveCategory(slug), 100);
    } else {
      setActiveCategory(slug);
    }
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-[#0F172A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Menyu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="font-sora font-bold text-sm text-white">X</span>
            </div>
            <span className="font-sora font-bold text-sm sm:text-lg text-white">XTech</span>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center px-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1">
            <div className="lg:hidden mr-1">
              <SearchBar />
            </div>
            <CartIcon iconClassName="text-white" />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-[#0F172A]/98 backdrop-blur-xl border-t border-white/10">
          <nav className="max-w-[1400px] mx-auto px-4 py-4 space-y-1">
            <Link to="/" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors">
              Ana səhifə
            </Link>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {cat.name}
              </button>
            ))}
            <Link to="/cart" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors">
              Səbət
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
