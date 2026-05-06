import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface FilterContextType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const handleSetSearchQuery = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  const handleSetActiveCategory = useCallback((c: string) => {
    setActiveCategory(c);
  }, []);

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        activeCategory,
        setActiveCategory: handleSetActiveCategory,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterProvider");
  return ctx;
}
