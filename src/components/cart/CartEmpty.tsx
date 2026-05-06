import { Link } from "react-router-dom";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <h2 className="font-sora font-semibold text-xl text-primary mb-2">Səbətiniz boşdur</h2>
      <p className="font-inter text-sm text-slate-500 mb-6 max-w-xs">
        Səbətinizdə heç bir məhsul yoxdur. Məhsullara baxın və səbətinizi doldurun.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-accent text-white font-inter font-medium rounded-xl hover:bg-[#16A34A] transition-all duration-200"
      >
        Məhsullara bax
      </Link>
    </div>
  );
}
