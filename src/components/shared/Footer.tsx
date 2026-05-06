import { Link, useNavigate, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { useFilter } from "@/store/filter-store";
import { categories } from "@/data/products";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveCategory } = useFilter();

  const handleCategoryClick = (slug: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => setActiveCategory(slug), 100);
    } else {
      setActiveCategory(slug);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const categoryItems = categories.filter((c) => c.slug !== "all");

  return (
    <footer className="bg-[#0F172A]">
      {/* Subtle gradient fade from white content into dark footer */}
      <div className="h-16 bg-gradient-to-b from-[#F8FAFC] to-[#0F172A]" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Left Column — Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-white font-sora font-bold text-sm">X</span>
              </div>
              <span className="font-sora font-bold text-lg text-white">XTech</span>
            </Link>
            <p className="text-sm font-inter text-slate-400 leading-relaxed max-w-xs">
              Bakıda noutbuk, printer və İT avadanlıqlarının satışı. Oyun, iş və ev istifadəsi üçün ən sərfəli modellər.
            </p>
          </div>

          {/* Middle Column — Quick Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-sora font-semibold text-white text-sm mb-4">Kateqoriyalar</h4>
              <ul className="space-y-2.5">
                {categoryItems.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="text-sm font-inter text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sora font-semibold text-white text-sm mb-4">Səhifələr</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="text-sm font-inter text-slate-400 hover:text-white transition-colors">
                    Ana səhifə
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick("all")}
                    className="text-sm font-inter text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Məhsullar
                  </button>
                </li>
                <li>
                  <Link to="/cart" className="text-sm font-inter text-slate-400 hover:text-white transition-colors">
                    Səbət
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column — Contact Information */}
          <div>
            <h4 className="font-sora font-semibold text-white text-sm mb-4">Əlaqə</h4>
            <ul className="space-y-2.5">
              <li className="text-sm font-inter text-slate-400">
                <span className="text-slate-500">Telefon:</span>{" "}
                <a href="tel:+994503201156" className="hover:text-white transition-colors">+994 50 320 11 56</a>
              </li>
              <li className="text-sm font-inter text-slate-400">
                <span className="text-slate-500">Email:</span>{" "}
                <a href="mailto:info@xtech.az" className="hover:text-white transition-colors">info@xtech.az</a>
              </li>
              <li className="text-sm font-inter text-slate-400">
                <span className="text-slate-500">Ünvan:</span> Bakı, Azərbaycan
              </li>
              <li className="text-sm font-inter">
                <span className="text-slate-500">WhatsApp:</span>{" "}
                <a
                  href="https://wa.me/994503201156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-[#4ade80] transition-colors font-medium"
                >
                  +994 50 320 11 56
                </a>
                <span className="text-[10px] text-slate-500 ml-1.5">(sifarişlər)</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-5">
              <p className="text-xs font-inter text-slate-500 mb-2.5">Bizi izləyin</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex items-center justify-between gap-3">
          <p className="text-xs font-inter text-slate-500">
            © 2026 XTech. Bütün hüquqlar qorunur.
          </p>
          <Link to="/admin" className="text-slate-500 hover:text-slate-300 transition-colors" aria-label="Admin panel">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
