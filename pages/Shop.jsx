import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ProductCard from "@/components/ProductCard";
import BackButton from "@/components/BackButton";
import { X, SlidersHorizontal, ArrowUpDown, Search, EyeOff, Eye } from "lucide-react";

const FEATURED_TEE_ORDER = ["prod-9", "prod-5", "prod-8", "prod-7"];

const collectionTabs = [
  "All",
  "New Arrivals",
  "Hoodies",
  "Sweatpants",
  "Golf / Polo Shirts",
  "Caps",
  "Embroidered Tees",
  "Printed Tees",
  "T-Shirts",
  "Best Sellers",
  "Oversized Collection",
  "Premium Cotton Collection",
  "Limited Edition",
];

export default function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Parse filters from search query
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchParam = queryParams.get("q") || queryParams.get("search") || "";
  const categoryParam = queryParams.get("category") || "";
  const sizeParam = queryParams.get("size") || "";
  const colorParam = queryParams.get("color") || "";
  const collectionParam = queryParams.get("collection") || "";
  const sortParam = queryParams.get("sort") || "Newest";

  const [searchInput, setSearchInput] = useState(searchParam);

  // Keep local search input in sync with URL
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    } else {
      params.delete("q");
      params.delete("search");
    }
    navigate(`/shop?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(location.search);
    params.delete("q");
    params.delete("search");
    navigate(`/shop?${params.toString()}`);
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = () => {
      base44.entities.Product.list("-created_date", 100)
        .then((list) => {
          setProducts(list || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch products:", err);
          setLoading(false);
        });
    };

    fetchProducts();

    window.addEventListener("fortified_products_updated", fetchProducts);
    window.addEventListener("storage", fetchProducts);

    return () => {
      window.removeEventListener("fortified_products_updated", fetchProducts);
      window.removeEventListener("storage", fetchProducts);
    };
  }, []);

  // Update active collection tab if collectionParam is set
  useEffect(() => {
    if (collectionParam) {
      if (collectionTabs.includes(collectionParam)) {
        setActiveTab(collectionParam);
      } else {
        setActiveTab("All");
      }
    } else {
      setActiveTab("All");
    }
  }, [collectionParam]);

  // Dynamically compute visible tabs based on non-hidden products available in store
  const visibleCollectionTabs = useMemo(() => {
    return collectionTabs.filter((tab) => {
      if (tab === "All" || tab === "New Arrivals" || tab === "Best Sellers") return true;

      const tabLower = tab.toLowerCase();

      // Check if any non-hidden product matches this category or collection tab
      return products.some((p) => {
        if (p.hidden) return false;
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        const pCategory = p.category?.toLowerCase() || "";

        if (tabLower.includes("hoodie")) {
          return pCategory.includes("hoodie") || name.includes("hoodie");
        }
        if (tabLower.includes("sweatpant") || tabLower.includes("jogger")) {
          return pCategory.includes("sweatpant") || name.includes("sweatpant") || name.includes("jogger");
        }
        if (tabLower.includes("polo") || tabLower.includes("golf")) {
          return pCategory.includes("polo") || pCategory.includes("golf") || name.includes("polo") || name.includes("golf");
        }
        if (tabLower.includes("cap") || tabLower.includes("headwear")) {
          return pCategory.includes("cap") || name.includes("cap") || name.includes("hat");
        }
        if (tabLower === "embroidered tees") {
          return pCategory.includes("embroidered") || name.includes("embroidered");
        }
        if (tabLower === "printed tees") {
          return pCategory.includes("printed") || name.includes("printed") || name.includes("classic tee");
        }
        if (tabLower === "t-shirts") {
          return pCategory === "t-shirts" || name.includes("tee") || name.includes("t-shirt");
        }

        // Collection checks
        if (Array.isArray(p.collections)) {
          if (p.collections.some((c) => c.toLowerCase() === tabLower)) return true;
        }
        if (Array.isArray(p.collection)) {
          if (p.collection.some((c) => c.toLowerCase() === tabLower)) return true;
        }
        return p.collection?.toLowerCase() === tabLower || pCategory === tabLower;
      });
    });
  }, [products]);

  // Handle Tab Switch (Collection click)
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(location.search);
    if (tab === "All") {
      params.delete("collection");
    } else {
      params.set("collection", tab);
    }
    navigate(`/shop?${params.toString()}`);
  };

  // Remove individual filter parameter
  const removeFilter = (key) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    navigate(`/shop?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    navigate("/shop");
  };

  // Smart Filtering Engine
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => !p.hidden);

    // 0. Search Query Matcher
    if (searchParam) {
      const q = searchParam.toLowerCase();
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const colMatch = p.collection?.toLowerCase().includes(q) ||
          (Array.isArray(p.collections) && p.collections.some((c) => c.toLowerCase().includes(q)));
        const catMatch = p.category?.toLowerCase().includes(q);
        const colorMatch = Array.isArray(p.colors) && p.colors.some((col) => col.toLowerCase().includes(q));
        return nameMatch || descMatch || colMatch || catMatch || colorMatch;
      });
    }

    // 1. Collection Tab / Query Filter & Category Tab Filter
    const activeFilter = collectionParam || (activeTab !== "All" ? activeTab : "");
    if (activeFilter) {
      const filterLower = activeFilter.toLowerCase();
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const pCategory = p.category?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        
        // Category checks
        if (filterLower.includes("hoodie")) {
          return pCategory.includes("hoodie") || name.includes("hoodie");
        }
        if (filterLower.includes("sweatpant") || filterLower.includes("jogger")) {
          return pCategory.includes("sweatpant") || name.includes("sweatpant") || name.includes("jogger");
        }
        if (filterLower.includes("polo") || filterLower.includes("golf")) {
          return pCategory.includes("polo") || pCategory.includes("golf") || name.includes("polo") || name.includes("golf");
        }
        if (filterLower.includes("cap") || filterLower.includes("headwear")) {
          return pCategory.includes("cap") || name.includes("cap") || name.includes("hat");
        }
        if (filterLower === "embroidered tees") {
          return pCategory.includes("embroidered") || name.includes("embroidered");
        }
        if (filterLower === "printed tees") {
          return pCategory.includes("printed") || name.includes("printed") || name.includes("classic tee");
        }
        if (filterLower === "t-shirts") {
          return pCategory === "t-shirts" || name.includes("heavyweight tee") || name.includes("box tee") || name.includes("graphic tee");
        }

        // Collection checks
        if (Array.isArray(p.collections)) {
          if (p.collections.some((c) => c.toLowerCase() === filterLower)) return true;
        }
        if (Array.isArray(p.collection)) {
          if (p.collection.some((c) => c.toLowerCase() === filterLower)) return true;
        }
        return p.collection?.toLowerCase() === filterLower || pCategory === filterLower;
      });
    }

    // 2. Category Matcher (From URL query parameter if specified)
    if (categoryParam) {
      const cat = categoryParam.toLowerCase();
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        const col = p.collection?.toLowerCase() || "";
        const pCategory = p.category?.toLowerCase() || "";
        
        if (cat.includes("hoodie")) {
          return pCategory.includes("hoodie") || name.includes("hoodie");
        }
        if (cat.includes("sweatpant") || cat.includes("jogger")) {
          return pCategory.includes("sweatpant") || name.includes("sweatpant") || name.includes("jogger");
        }
        if (cat.includes("polo") || cat.includes("golf")) {
          return pCategory.includes("polo") || pCategory.includes("golf") || name.includes("polo") || name.includes("golf");
        }
        if (cat.includes("cap") || cat.includes("headwear")) {
          return pCategory.includes("cap") || name.includes("cap");
        }
        if (cat === "t-shirts" || cat === "tees") {
          return name.includes("tee") || name.includes("t-shirt") || name.includes("tshirt") || pCategory.includes("t-shirt") || pCategory.includes("tee");
        }
        if (cat.includes("embroidered")) {
          return name.includes("embroidered") || name.includes("embroidery") || pCategory.includes("embroidered");
        }
        if (cat.includes("printed") || cat.includes("wide print")) {
          return name.includes("print") || name.includes("printed") || pCategory.includes("printed");
        }
        return name.includes(cat) || desc.includes(cat) || col.includes(cat) || pCategory.includes(cat);
      });
    }

    // 3. Color Matcher
    if (colorParam) {
      const col = colorParam.toLowerCase();
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const desc = p.description?.toLowerCase() || "";
        return name.includes(col) || desc.includes(col);
      });
    }

    // 4. Size Matcher
    if (sizeParam) {
      const sz = sizeParam.toLowerCase();
      result = result.filter((p) => {
        const desc = p.description?.toLowerCase() || "";
        return desc.includes(`size ${sz}`) || desc.includes(`-${sz}`) || true; 
      });
    }

    // 5. Sorting Engine
    if (sortParam === "Price Low → High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortParam === "Price High → Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortParam === "Best Selling") {
      result.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
    } else if (sortParam === "Featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      result.sort((a, b) => {
        const aIndex = FEATURED_TEE_ORDER.indexOf(a.id);
        const bIndex = FEATURED_TEE_ORDER.indexOf(b.id);
        if (aIndex !== -1 || bIndex !== -1) {
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        }
        return new Date(b.created_date || 0) - new Date(a.created_date || 0);
      });
    }

    return result;
  }, [products, activeTab, searchParam, categoryParam, sizeParam, colorParam, collectionParam, sortParam]);

  const hasActiveFilters = searchParam || categoryParam || sizeParam || colorParam || collectionParam;

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="mx-auto max-w-[1600px] px-6 pb-28 pt-36 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">The Vault</p>
            <h1 className="mt-4 font-display text-6xl font-black tracking-monolith text-black md:text-8xl">Shop</h1>
          </div>
          
          {/* Right side controls: Search Bar + Sorting */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Inline Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search pieces..."
                className="w-full bg-neutral-50 border border-neutral-300 text-black placeholder-neutral-400 font-mono text-[10px] uppercase tracking-wider py-2 pl-8 pr-7 focus:outline-none focus:border-black transition-all rounded"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Hide/Show Filters Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              type="button"
              className="flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black font-mono text-[10px] uppercase tracking-wider py-2 px-3 focus:outline-none transition-all rounded font-bold"
            >
              {showFilters ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-neutral-600" />
                  <span>Hide Filters</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-black" />
                  <span>Show Filters</span>
                </>
              )}
            </button>

            {/* Sorting Dropdown directly on page */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
              <select
                value={sortParam}
                onChange={(e) => {
                  const params = new URLSearchParams(location.search);
                  params.set("sort", e.target.value);
                  navigate(`/shop?${params.toString()}`);
                }}
                className="bg-neutral-50 border border-neutral-300 text-black font-mono text-[10px] uppercase tracking-wider py-2 px-3 focus:outline-none focus:border-black transition-all duration-300 rounded font-semibold"
              >
                <option value="Newest">Newest</option>
                <option value="Best Selling">Best Selling</option>
                <option value="Featured">Featured</option>
                <option value="Price Low → High">Price Low → High</option>
                <option value="Price High → Low">Price High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collection Navigation Tabs */}
        {showFilters && (
          <>
            <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto border-b border-neutral-200 pb-4">
              {visibleCollectionTabs.map((f) => (
                <button
                  key={f}
                  onClick={() => handleTabSwitch(f)}
                  className={`whitespace-nowrap px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 rounded-sm ${
                    (f === "All" && !collectionParam && activeTab === "All") || (collectionParam === f) || (activeTab === f && !collectionParam)
                      ? "bg-black text-white font-bold shadow-sm"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100 font-semibold"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold mr-1.5 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Active Filters:
                </span>
                
                {searchParam && (
                  <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-black rounded-full font-bold">
                    Search: "{searchParam}"
                    <button onClick={handleClearSearch} className="text-neutral-500 hover:text-black transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {categoryParam && (
                  <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-black rounded-full font-bold">
                    Category: {categoryParam}
                    <button onClick={() => removeFilter("category")} className="text-neutral-500 hover:text-black transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {collectionParam && (
                  <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-black rounded-full font-bold">
                    Collection: {collectionParam}
                    <button onClick={() => removeFilter("collection")} className="text-neutral-500 hover:text-black transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {colorParam && (
                  <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-black rounded-full font-bold">
                    Color: {colorParam}
                    <button onClick={() => removeFilter("color")} className="text-neutral-500 hover:text-black transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {sizeParam && (
                  <span className="inline-flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-black rounded-full font-bold">
                    Size: {sizeParam}
                    <button onClick={() => removeFilter("size")} className="text-neutral-500 hover:text-black transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black hover:underline transition-all ml-2 font-bold"
                >
                  Clear All
                </button>
              </div>
            )}
          </>
        )}

        {/* Product Grid section */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-32 text-center space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold">
              No pieces match the selected parameters
            </p>
            <button
              onClick={clearAllFilters}
              className="font-mono text-[10px] uppercase tracking-[0.2em] border border-black bg-black text-white px-4 py-2 hover:bg-neutral-800 transition-all font-bold rounded-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-neutral-200 flex justify-start">
          <BackButton label="BACK" to="/" />
        </div>
      </div>
    </div>
  );
}
