import { useFilter } from "@/store/filter-store";

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilter();

  return (
    <div className="relative w-full max-w-[140px] sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:w-full xl:max-w-none">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Məhsul axtar..."
        className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-primary placeholder:text-slate-400 font-inter focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
