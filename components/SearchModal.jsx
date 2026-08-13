import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, ArrowRight, Clock, Sparkles, Filter, SlidersHorizontal, Trash2 } from "lucide-react";
import { useSearch } from "@/lib/SearchContext";
import { base44 } from "@/api/base44Client";
import { zar, IMG } from "@/lib/media";
import { useCart } from "@/lib/CartContext";

const POPULAR_SEARCHES = [
  "Embroidered",
  "Jet Black",
  "Heavyweight",
  "Wide Print",
  "Classic Tee",
  "Oversized",
  "Permanent Art",
  "White Tee",
];

const QUICK_FILTERS = [
  { id: "all", label: "ALL PIECES" },
  { id: "hoodies", label: "HOODIES" },
  { id: "sweatpants", label: "SWEATPANTS" },
  { id: "polos", label: "POLOS / GOLF" },
  { id: "caps", label: "CAPS" },
  { id: "tees", label: "T-SHIRTS" },
  { id: "embroidered", label: "EMBROIDERED" },
  { id: "printed", label: "PRINTED" },
  { id: "under1000", label: "UNDER R1,000" },
  { id: "new", label: "NEW ARRIVALS" },
  { id: "bestsellers", label: "BEST SELLERS" },
];

export default function SearchModal() {
  const { isOpen, closeSearch } = useSearch();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortOption, setSortOption] = useState("relevance");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);

  // Filter quick filters based on visible non-hidden products
  const visibleQuickFilters = useMemo(() => {
    return QUICK_FILTERS.filter((f) => {
      if (f.id === "all" || f.id === "under1000" || f.id === "new" || f.id === "bestsellers") return true;
      return products.some((p) => {
        if (p.hidden) return false;
        const name = p.name?.toLowerCase() || "";
        const cat = p.category?.toLowerCase() || "";
        if (f.id === "hoodies") return cat.includes("hoodie") || name.includes("hoodie");
        if (f.id === "sweatpants") return cat.includes("sweatpant") || name.includes("sweatpant") || name.includes("jogger");
        if (f.id === "polos") return cat.includes("polo") || cat.includes("golf") || name.includes("polo") || name.includes("golf");
        if (f.id === "caps") return cat.includes("cap") || name.includes("cap");
        if (f.id === "tees") return cat.includes("t-shirt") || name.includes("tee") || name.includes("t-shirt");
        if (f.id === "embroidered") return cat.includes("embroidered") || name.includes("embroidered");
        if (f.id === "printed") return cat.includes("printed") || name.includes("printed");
        return true;
      });
    });
  }, [products]);

  // Load products on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      base44.entities.Product.list("-created_date", 100)
        .then((list) => setProducts(list || []))
        .catch((err) => console.error("Error fetching products for search engine:", err))
        .finally(() => setLoading(false));

      // Focus input automatically
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);

      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fortified_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read recent searches from localStorage", e);
    }
  }, []);

  // Save recent search
  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    const updated = [cleanTerm, ...recentSearches.filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem("fortified_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recent search", e);
    }
  };

  // Remove single recent search
  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem("fortified_recent_searches", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("fortified_recent_searches");
  };

  // Perform search query logic
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    let filtered = products.filter((p) => !p.hidden).filter((p) => {
      // Quick filter checks
      if (selectedFilter === "hoodies" && !p.name?.toLowerCase().includes("hoodie") && !p.category?.toLowerCase().includes("hoodie")) {
        return false;
      }
      if (selectedFilter === "sweatpants" && !p.name?.toLowerCase().includes("sweatpant") && !p.name?.toLowerCase().includes("jogger") && !p.category?.toLowerCase().includes("sweatpant")) {
        return false;
      }
      if (selectedFilter === "polos" && !p.name?.toLowerCase().includes("polo") && !p.name?.toLowerCase().includes("golf") && !p.category?.toLowerCase().includes("polo") && !p.category?.toLowerCase().includes("golf")) {
        return false;
      }
      if (selectedFilter === "caps" && !p.name?.toLowerCase().includes("cap") && !p.name?.toLowerCase().includes("hat") && !p.name?.toLowerCase().includes("beanie") && !p.category?.toLowerCase().includes("cap")) {
        return false;
      }
      if (selectedFilter === "tees" && !p.name?.toLowerCase().includes("tee") && !p.category?.toLowerCase().includes("t-shirt")) {
        return false;
      }
      if (selectedFilter === "embroidered" && !p.name?.toLowerCase().includes("embroidered") && !p.description?.toLowerCase().includes("embroidered")) {
        return false;
      }
      if (selectedFilter === "printed" && !p.name?.toLowerCase().includes("print") && !p.description?.toLowerCase().includes("printed")) {
        return false;
      }
      if (selectedFilter === "under1000" && p.price >= 1000) {
        return false;
      }
      if (selectedFilter === "new" && p.collection !== "New Arrivals" && (!Array.isArray(p.collections) || !p.collections.includes("New Arrivals"))) {
        return false;
      }
      if (selectedFilter === "bestsellers" && p.collection !== "Best Sellers" && (!Array.isArray(p.collections) || !p.collections.includes("Best Sellers"))) {
        return false;
      }

      // Text Query filter
      if (!q) return true;

      const nameMatch = p.name?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const categoryMatch = p.category?.toLowerCase().includes(q);
      const collectionMatch = p.collection?.toLowerCase().includes(q) ||
        (Array.isArray(p.collections) && p.collections.some((c) => c.toLowerCase().includes(q)));
      const colorMatch = Array.isArray(p.colors) && p.colors.some((col) => col.toLowerCase().includes(q));

      return nameMatch || descMatch || categoryMatch || collectionMatch || colorMatch;
    });

    // Sorting
    if (sortOption === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
    }

    return filtered;
  }, [products, query, selectedFilter, sortOption]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const handleSelectPopularOrRecent = (term) => {
    setQuery(term);
    saveRecentSearch(term);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, "M", 1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl text-white">
        
        {/* Ambient Subtle Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* TOP HEADER & SEARCH INPUT BAR */}
        <div className="relative border-b border-[#222] bg-[#0A0A0A] px-6 py-6 md:px-12">
          <div className="mx-auto flex max-w-5xl items-center gap-4">
            
            {/* Search Icon */}
            <Search className="h-6 w-6 text-white/60 shrink-0" />

            {/* Form & Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search FORTIFIED Vault (e.g. 'black tee', 'embroidered', 'heavyweight')..."
                className="w-full bg-transparent text-lg md:text-2xl font-mono uppercase tracking-wider text-white placeholder-neutral-600 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Clear query"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>

            {/* ESC / Close Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={closeSearch}
                className="flex items-center gap-2 border border-[#333] hover:border-white bg-[#111] hover:bg-white hover:text-black transition-all px-3.5 py-2 rounded-md font-mono text-[10px] uppercase tracking-widest text-neutral-300"
              >
                <span>ESC</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="mx-auto max-w-5xl mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 mr-2 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              Filter:
            </span>
            {visibleQuickFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                  selectedFilter === f.id
                    ? "bg-white text-black font-bold border-white"
                    : "bg-[#111] text-neutral-400 border-[#222] hover:text-white hover:border-[#444]"
                }`}
              >
                {f.label}
              </button>
            ))}

            {/* Sort Dropdown */}
            <div className="ml-auto shrink-0 flex items-center gap-2 pl-4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#111] border border-[#222] text-white font-mono text-[9px] uppercase tracking-wider py-1.5 px-3 rounded focus:outline-none focus:border-white transition-colors"
              >
                <option value="relevance">Sort: Recommended</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEARCH BODY CONTENT AREA */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8 md:px-12">
          <div className="mx-auto max-w-5xl space-y-8">
            
            {/* If NO query typed yet: Show Recent Searches & Trending Terms */}
            {!query.trim() && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-neutral-400" />
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-300 font-bold">
                          Recent Searches
                        </h3>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          onClick={() => handleSelectPopularOrRecent(term)}
                          className="group flex items-center gap-2 bg-[#161616] hover:bg-[#222] border border-[#262626] rounded-full px-3.5 py-1.5 cursor-pointer transition-all duration-200"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-300 group-hover:text-white">
                            {term}
                          </span>
                          <button
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-neutral-500 hover:text-white p-0.5"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular / Trending Searches */}
                <div className={`bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-6 ${recentSearches.length === 0 ? "md:col-span-2" : ""}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-neutral-400" />
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-300 font-bold">
                      Trending Keywords
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectPopularOrRecent(term)}
                        className="font-mono text-[10px] uppercase tracking-wider bg-[#141414] hover:bg-white hover:text-black border border-[#262626] text-neutral-300 px-4 py-2 rounded-full transition-all duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS COUNTER BAR */}
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                {query.trim() ? (
                  <>
                    Search Results for <span className="text-white font-bold">"{query}"</span> ({searchResults.length})
                  </>
                ) : (
                  <>All Vault Catalog ({searchResults.length} Pieces)</>
                )}
              </p>

              {query.trim() && (
                <button
                  onClick={handleSearchSubmit}
                  className="font-mono text-[10px] uppercase tracking-widest text-neutral-300 hover:text-white underline flex items-center gap-1"
                >
                  View All in Shop Page
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* RESULTS GRID / LIST */}
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-white mb-4" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Scanning Vault Database...
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-8">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-400">
                  No matching pieces found for "{query}"
                </p>
                <p className="font-mono text-[11px] text-neutral-500 max-w-md mx-auto">
                  Try checking spelling, searching for generic terms like "tee" or "black", or select a quick category filter above.
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedFilter("all");
                  }}
                  className="mt-2 inline-block bg-white text-black font-mono text-[10px] uppercase tracking-[0.2em] font-bold px-6 py-2.5 rounded hover:bg-neutral-200 transition-colors"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {searchResults.map((product) => {
                  const hasImages = Array.isArray(product.images) && product.images.length > 0;
                  const primaryImg = hasImages ? product.images[0] : null;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#333] rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-300"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        onClick={() => {
                          if (query) saveRecentSearch(query);
                          closeSearch();
                        }}
                        className="block relative aspect-[4/5] bg-[#050505] overflow-hidden"
                      >
                        {primaryImg ? (
                          <img
                            src={primaryImg}
                            alt={product.name}
                            className="h-full w-full object-cover transition-opacity duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-[#080808]">
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-600 font-bold border border-[#222] px-2 py-1 rounded">
                              Coming Soon
                            </span>
                          </div>
                        )}

                        <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md border border-[#333] text-white font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded">
                          {product.collection || "Permanent Art"}
                        </span>
                      </Link>

                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3 text-left">
                        <div>
                          <Link
                            to={`/product/${product.id}`}
                            onClick={() => {
                              if (query) saveRecentSearch(query);
                              closeSearch();
                            }}
                            className="font-sans text-[12px] font-medium text-white hover:underline line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <p className="font-mono text-[11px] text-neutral-400 mt-1 font-bold">
                            {zar(product.price)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="w-full bg-[#1A1A1A] hover:bg-white hover:text-black border border-[#2B2B2B] hover:border-white text-white font-mono text-[9px] uppercase tracking-[0.2em] font-bold py-2 rounded transition-all duration-200 flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        {searchResults.length > 0 && query.trim() && (
          <div className="border-t border-[#222] bg-[#0A0A0A] px-6 py-4 md:px-12 text-center">
            <button
              onClick={handleSearchSubmit}
              className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-mono text-[10px] uppercase tracking-[0.25em] font-bold px-8 py-3 rounded-md transition-colors shadow-lg"
            >
              <span>VIEW ALL {searchResults.length} RESULTS IN SHOP</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
